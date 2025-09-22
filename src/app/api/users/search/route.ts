import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (!email && !username) {
      return NextResponse.json(
        { success: false, error: 'Email o username richiesti' },
        { status: 400 }
      );
    }

    let user = null;

    if (email) {
      user = await db.getUserByEmail(email);
    } else if (username) {
      user = await db.getUserByUsername(username);
    }

    if (user) {
      // Rimuovi informazioni sensibili
      const { password_hash, password, ...safeUser } = user;
      return NextResponse.json({
        success: true,
        user: safeUser,
        exists: true
      });
    } else {
      return NextResponse.json({
        success: true,
        user: null,
        exists: false
      });
    }

  } catch (error) {
    console.error('Errore ricerca utente:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { success: false, error: 'Array di email richiesto' },
        { status: 400 }
      );
    }

    const users = [];
    
    for (const email of emails) {
      const user = await db.getUserByEmail(email);
      if (user) {
        // Rimuovi informazioni sensibili
        const { password_hash, password, ...safeUser } = user;
        users.push(safeUser);
      }
    }

    return NextResponse.json({
      success: true,
      users,
      found: users.length
    });

  } catch (error) {
    console.error('Errore ricerca multipla utenti:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}