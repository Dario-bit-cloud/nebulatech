import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// POST - Crea account di test
export async function POST() {
  try {
    // Prima assicuriamoci che la tabella users esista
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

    // Account di test da creare
    const testUsers = [
      {
        email: 'test@nebulatech.it',
        username: 'testuser',
        password_hash: '$2b$10$dummy.hash.for.test.user.only', // Hash fittizio per test
        first_name: 'Test',
        last_name: 'User',
        role: 'user'
      },
      {
        email: 'gamer@nebulatech.it',
        username: 'gamer_test',
        password_hash: '$2b$10$dummy.hash.for.gamer.test.only', // Hash fittizio per test
        first_name: 'Gamer',
        last_name: 'Test',
        role: 'user'
      }
    ];

    const createdUsers = [];

    for (const user of testUsers) {
      try {
        // Verifica se l'utente esiste già
        const existingUser = await executeQuery(
          'SELECT id FROM users WHERE email = $1 OR username = $2',
          [user.email, user.username]
        );

        if (existingUser.length === 0) {
          // Inserisci il nuovo utente
          const result = await executeQuery(`
            INSERT INTO users (email, username, password_hash, first_name, last_name, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, username, first_name, last_name, role, created_at
          `, [user.email, user.username, user.password_hash, user.first_name, user.last_name, user.role]);

          createdUsers.push(result[0]);
        } else {
          console.log(`Utente ${user.username} già esistente, saltato.`);
        }
      } catch (userError) {
        console.error(`Errore nella creazione dell'utente ${user.username}:`, userError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Account di test creati con successo`,
      createdUsers: createdUsers,
      totalCreated: createdUsers.length
    });

  } catch (error) {
    console.error('Errore nella creazione degli account di test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// GET - Lista gli account di test esistenti
export async function GET() {
  try {
    const testUsers = await executeQuery(`
      SELECT id, email, username, first_name, last_name, role, is_active, created_at
      FROM users 
      WHERE email LIKE '%@nebulatech.it' 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      testUsers: testUsers,
      count: testUsers.length,
      message: 'Account di test recuperati con successo'
    });

  } catch (error) {
    console.error('Errore nel recupero degli account di test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}