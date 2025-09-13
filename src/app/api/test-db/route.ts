import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Test della connessione al database
export async function GET() {
  try {
    // Test di connessione semplice
    const result = await db.query('SELECT NOW() as current_time, version() as postgres_version');
    
    return NextResponse.json({
      success: true,
      message: 'Connessione al database Neon riuscita!',
      data: result[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore test database:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Errore nella connessione al database',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

// POST - Esempio di creazione dati
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, message: 'Parametri mancanti: title, content, author sono richiesti' },
        { status: 400 }
      );
    }

    // Esempio di inserimento (assicurati che la tabella posts esista)
    const newPost = await db.createPost(title, content, author);
    
    return NextResponse.json({
      success: true,
      message: 'Post creato con successo',
      data: newPost
    });
  } catch (error) {
    console.error('Errore creazione post:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Errore nella creazione del post',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}