import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, username, password, firstName, lastName } = body

    switch (action) {
      case 'register': {
        // Validazione campi obbligatori
        if (!email || !username || !password || !firstName || !lastName) {
          return NextResponse.json(
            { success: false, error: 'Tutti i campi sono obbligatori' },
            { status: 400 }
          )
        }

        // Controlla se email esiste già
        const existingEmail = await db.getUserByEmail(email)
        if (existingEmail) {
          return NextResponse.json(
            { success: false, error: 'Email già registrata' },
            { status: 409 }
          )
        }

        // Controlla se username esiste già
        const existingUsername = await db.getUserByUsername(username)
        if (existingUsername) {
          return NextResponse.json(
            { success: false, error: 'Username già in uso' },
            { status: 409 }
          )
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Crea nuovo utente
        const newUser = await db.createUser({
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName
        })

        return NextResponse.json({
          success: true,
          message: 'Registrazione completata con successo',
          user: {
            id: newUser.id,
            name: `${firstName} ${lastName}`,
            email,
            username
          }
        })
      }

      case 'login': {
        // Validazione campi obbligatori
        if (!email || !password) {
          return NextResponse.json(
            { success: false, error: 'Email e password sono obbligatori' },
            { status: 400 }
          )
        }

        // Trova utente per email
        const user = await db.getUserByEmail(email)
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Credenziali non valide' },
            { status: 401 }
          )
        }

        // Verifica password - usa password_hash se password non è disponibile
        const passwordToCheck = user.password || user.password_hash
        if (!passwordToCheck) {
          return NextResponse.json(
            { success: false, error: 'Errore interno: password non trovata' },
            { status: 500 }
          )
        }
        
        const isValidPassword = await bcrypt.compare(password, passwordToCheck)
        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, error: 'Credenziali non valide' },
            { status: 401 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Login effettuato con successo',
          user: {
            id: user.id,
            name: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.username,
            email: user.email,
            username: user.username
          }
        })
      }

      case 'check-email': {
        if (!email) {
          return NextResponse.json(
            { success: false, error: 'Email richiesta' },
            { status: 400 }
          )
        }

        const existingEmail = await db.getUserByEmail(email)
        return NextResponse.json({
          success: true,
          available: !existingEmail
        })
      }

      case 'check-username': {
        if (!username) {
          return NextResponse.json(
            { success: false, error: 'Username richiesto' },
            { status: 400 }
          )
        }

        const existingUsername = await db.getUserByUsername(username)
        return NextResponse.json({
          success: true,
          available: !existingUsername
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Azione non valida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Errore API auth:', error)
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}