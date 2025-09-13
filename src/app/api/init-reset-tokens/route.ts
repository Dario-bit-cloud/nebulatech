import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST() {
  try {
    // Crea la tabella password_reset_tokens
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Crea indice per performance
    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
      ON password_reset_tokens(token)
    `);

    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires 
      ON password_reset_tokens(expires_at)
    `);

    // Verifica che la tabella sia stata creata
    const result = await executeQuery(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'password_reset_tokens'
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      success: true,
      message: 'Tabella password_reset_tokens creata con successo',
      schema: result as Record<string, unknown>[]
    });
  } catch (error) {
    console.error('Errore creazione tabella password_reset_tokens:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante la creazione della tabella',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

// GET - Verifica lo stato della tabella
export async function GET() {
  try {
    // Verifica se la tabella esiste
    const tables = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'password_reset_tokens'
    `);

    // Ottieni informazioni sulla struttura della tabella
    const columns = await executeQuery(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'password_reset_tokens' 
      ORDER BY ordinal_position
    `);

    // Conta i token attivi (non scaduti)
    const [activeTokens] = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM password_reset_tokens 
      WHERE expires_at > NOW()
    `);

    // Conta i token scaduti
    const [expiredTokens] = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM password_reset_tokens 
      WHERE expires_at <= NOW()
    `);

    return NextResponse.json({
      success: true,
      message: 'Informazioni tabella password_reset_tokens',
      data: {
        tableExists: tables.length > 0,
        columns: columns,
        activeTokens: activeTokens?.count || 0,
        expiredTokens: expiredTokens?.count || 0
      }
    });
  } catch (error) {
    console.error('Errore verifica tabella password_reset_tokens:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante la verifica della tabella',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

// DELETE - Pulisce i token scaduti
export async function DELETE() {
  try {
    const result = await executeQuery(`
      DELETE FROM password_reset_tokens 
      WHERE expires_at <= NOW()
    `);

    return NextResponse.json({
      success: true,
      message: `Eliminati ${result.length} token scaduti`
    });
  } catch (error) {
    console.error('Errore pulizia token scaduti:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante la pulizia dei token scaduti',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}