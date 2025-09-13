import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // Ottieni i dati dalla richiesta
    const body = await request.json()
    const { userId, confirmPassword } = body

    // Validazione campi obbligatori
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID utente richiesto' },
        { status: 400 }
      )
    }

    if (!confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Password di conferma richiesta' },
        { status: 400 }
      )
    }

    // Verifica che l'utente esista e ottieni i suoi dati
    const user = await db.getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      )
    }

    // Verifica la password di conferma
    const bcrypt = require('bcryptjs')
    const userWithPassword = await db.getUserByEmail(user.email)
    const passwordToCheck = userWithPassword.password || userWithPassword.password_hash
    
    if (!passwordToCheck) {
      return NextResponse.json(
        { success: false, error: 'Errore interno: password non trovata' },
        { status: 500 }
      )
    }
    
    const isValidPassword = await bcrypt.compare(confirmPassword, passwordToCheck)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Password non corretta' },
        { status: 401 }
      )
    }

    // Elimina l'utente e tutti i suoi dati
    const deletedUser = await db.deleteUser(userId)
    
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'Errore durante l\'eliminazione dell\'account' },
        { status: 500 }
      )
    }

    // Log dell'eliminazione per audit
    console.log(`Account eliminato: ${deletedUser.email} (ID: ${deletedUser.id}) - ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Account eliminato con successo',
      deletedUser: {
        id: deletedUser.id,
        email: deletedUser.email,
        username: deletedUser.username
      }
    })

  } catch (error) {
    console.error('Errore eliminazione account:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore interno del server durante l\'eliminazione dell\'account' 
      },
      { status: 500 }
    )
  }
}

// Endpoint per verificare se l'eliminazione è possibile (opzionale)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID utente richiesto' },
        { status: 400 }
      )
    }

    // Verifica che l'utente esista
    const user = await db.getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      )
    }

    // Controlla se ci sono dati associati che verranno eliminati
    const associatedData = {
      passwordResetTokens: true, // Sempre presente nella logica di eliminazione
      // Qui si possono aggiungere altri controlli per tabelle correlate
    }

    return NextResponse.json({
      success: true,
      message: 'Eliminazione possibile',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      },
      associatedData
    })

  } catch (error) {
    console.error('Errore verifica eliminazione:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore interno del server' 
      },
      { status: 500 }
    )
  }
}