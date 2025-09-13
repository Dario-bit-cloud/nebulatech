import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { handleApiError, createSuccessResponse } from '@/lib/api-utils';

// POST - Inizializza lo schema del database
export async function POST() {
  try {
    // Elimina la tabella se esiste e la ricrea con la struttura corretta
    await executeQuery(`DROP TABLE IF EXISTS posts`);
    
    await executeQuery(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verifica che la tabella sia stata creata
    const result = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'posts'
    `);

    return NextResponse.json({
      success: true,
      message: 'Database inizializzato con successo',
      tables: result as Record<string, unknown>[]
    });
  } catch (error) {
    // Errore durante l'inizializzazione del database
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante l\'inizializzazione del database',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

// GET - Verifica lo stato delle tabelle
export async function GET() {
  try {
    // Lista tutte le tabelle nel database
    const result = await executeQuery(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    return NextResponse.json({
      success: true,
      message: 'Schema database recuperato',
      schema: result as Record<string, unknown>[]
    });
  } catch (error) {
    return handleApiError(error, 'Errore durante la verifica dello schema');
  }
}