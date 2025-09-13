import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// Forza l'esecuzione runtime per le operazioni del database
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Crea la tabella users per memorizzare gli account utenti
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Verifica che la tabella sia stata creata
    const result = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (result.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Tabella users creata con successo',
        table: 'users'
      });
    } else {
      throw new Error('Errore nella creazione della tabella users');
    }
  } catch (error) {
    console.error('Errore inizializzazione tabella users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verifica se la tabella esiste
    const tables = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    // Ottieni informazioni sulla struttura della tabella
    const columns = await executeQuery(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    // Conta i record esistenti (senza esporre dati sensibili)
    const [count] = await executeQuery('SELECT COUNT(*) as count FROM users');

    return NextResponse.json({
      success: true,
      tableExists: tables.length > 0,
      columns: columns,
      userCount: count?.count || 0,
      message: 'Informazioni tabella users recuperate con successo'
    });
  } catch (error) {
    console.error('Errore nel recupero informazioni tabella users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}