import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { executeQuery } from '@/lib/database'

// Simulazione invio email (in produzione usare un servizio come SendGrid, Nodemailer, etc.)
const sendResetEmail = async (email: string, token: string) => {
  // In sviluppo, logghiamo il link invece di inviare email
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password/${token}`
  
  console.log('=== EMAIL RESET PASSWORD ===')
  console.log(`To: ${email}`)
  console.log(`Subject: Reset Password - NebulaTech`)
  console.log(`Reset Link: ${resetLink}`)
  console.log('==============================')
  
  // TODO: In produzione, implementare invio email reale
  // Esempio con nodemailer:
  /*
  const transporter = nodemailer.createTransporter({
    // configurazione SMTP
  })
  
  await transporter.sendMail({
    from: 'noreply@nebulatech.com',
    to: email,
    subject: 'Reset Password - NebulaTech',
    html: `
      <h2>Reset Password</h2>
      <p>Hai richiesto il reset della password per il tuo account NebulaTech.</p>
      <p>Clicca sul link seguente per reimpostare la password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Il link scadrà tra 1 ora.</p>
      <p>Se non hai richiesto questo reset, ignora questa email.</p>
    `
  })
  */
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'request-reset': {
        const { email } = body

        if (!email) {
          return NextResponse.json(
            { success: false, error: 'Email richiesta' },
            { status: 400 }
          )
        }

        // Verifica se l'utente esiste
        const [existingUser] = await executeQuery(
          'SELECT id, email FROM users WHERE email = $1',
          [email]
        )

        if (!existingUser) {
          // Per sicurezza, non rivelare se l'email esiste o meno
          return NextResponse.json({
            success: true,
            message: 'Se l\'email è registrata, riceverai le istruzioni per il reset'
          })
        }

        // Genera token sicuro
        const resetToken = crypto.randomBytes(32).toString('hex')
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 ora

        // Salva il token nel database
        await executeQuery(
          `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) 
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (user_id) 
           DO UPDATE SET token = $2, expires_at = $3, created_at = NOW()`,
          [existingUser.id, resetToken, tokenExpiry]
        )

        // Invia email (simulata)
        await sendResetEmail(email, resetToken)

        return NextResponse.json({
          success: true,
          message: 'Se l\'email è registrata, riceverai le istruzioni per il reset'
        })
      }

      case 'verify-token': {
        const { token } = body

        if (!token) {
          return NextResponse.json(
            { success: false, error: 'Token richiesto' },
            { status: 400 }
          )
        }

        // Verifica token e scadenza
        const [resetRecord] = await executeQuery(
          `SELECT prt.*, u.email 
           FROM password_reset_tokens prt 
           JOIN users u ON prt.user_id = u.id 
           WHERE prt.token = $1 AND prt.expires_at > NOW()`,
          [token]
        )

        if (!resetRecord) {
          return NextResponse.json(
            { success: false, error: 'Token non valido o scaduto' },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Token valido'
        })
      }

      case 'reset-password': {
        const { token, password } = body

        if (!token || !password) {
          return NextResponse.json(
            { success: false, error: 'Token e password richiesti' },
            { status: 400 }
          )
        }

        // Validazione password
        if (password.length < 8) {
          return NextResponse.json(
            { success: false, error: 'Password deve essere di almeno 8 caratteri' },
            { status: 400 }
          )
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
          return NextResponse.json(
            { success: false, error: 'Password deve contenere almeno una lettera minuscola, una maiuscola e un numero' },
            { status: 400 }
          )
        }

        // Verifica token e scadenza
        const [resetRecord] = await executeQuery(
          `SELECT prt.*, u.id as user_id, u.email 
           FROM password_reset_tokens prt 
           JOIN users u ON prt.user_id = u.id 
           WHERE prt.token = $1 AND prt.expires_at > NOW()`,
          [token]
        )

        if (!resetRecord) {
          return NextResponse.json(
            { success: false, error: 'Token non valido o scaduto' },
            { status: 400 }
          )
        }

        // Hash della nuova password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Aggiorna password utente
        await executeQuery(
          'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
          [hashedPassword, resetRecord.user_id]
        )

        // Elimina il token usato
        await executeQuery(
          'DELETE FROM password_reset_tokens WHERE token = $1',
          [token]
        )

        return NextResponse.json({
          success: true,
          message: 'Password aggiornata con successo'
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Azione non valida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Errore API reset password:', error)
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}