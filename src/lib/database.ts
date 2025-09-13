import { neon } from '@netlify/neon';

// Configurazione del database Neon
// Per ora usiamo un mock per evitare errori di connessione
const sql = process.env.NETLIFY_DATABASE_URL && process.env.NETLIFY_DATABASE_URL !== 'postgresql://username:password@host:port/database' 
  ? neon() 
  : null; // Mock quando non configurato

// Mock database per sviluppo
const mockUsers: any[] = [];
let mockIdCounter = 1;

// Funzione helper per eseguire query con gestione errori
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    // Se non c'è connessione reale, usa il mock
    if (!sql) {
      return mockDatabaseQuery(query, params) as T[];
    }
    
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    console.error('Query was:', query);
    console.error('Params were:', params);
    throw new Error(`Errore database: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
  }
}

// Mock database per sviluppo locale
function mockDatabaseQuery(query: string, params: any[]): any[] {
  console.log('Using mock database');
  
  // Simula INSERT per users
  if (query.includes('INSERT INTO users')) {
    const emailMatch = query.match(/VALUES \('([^']+)'/);
    const usernameMatch = query.match(/VALUES \('[^']+', '([^']+)'/);
    const passwordMatch = query.match(/VALUES \('[^']+', '[^']+', '([^']+)'/);
    const firstNameMatch = query.match(/VALUES \('[^']+', '[^']+', '[^']+', '([^']+)'/) || query.match(/VALUES \('[^']+', '[^']+', '[^']+', NULL/);
    const lastNameMatch = query.match(/VALUES \('[^']+', '[^']+', '[^']+', (?:'[^']+', |NULL, )'([^']+)'/) || query.match(/VALUES \('[^']+', '[^']+', '[^']+', (?:'[^']+', |NULL, )NULL/);
    
    if (emailMatch && usernameMatch && passwordMatch) {
      const email = emailMatch[1];
      const username = usernameMatch[1];
      const password = passwordMatch[1];
      const firstName = firstNameMatch && !query.includes('NULL') ? firstNameMatch[1] : null;
      const lastName = lastNameMatch && !query.includes('NULL') ? lastNameMatch[1] : null;
      
      // Controlla duplicati
      const existingUser = mockUsers.find(u => u.email === email || u.username === username);
      if (existingUser) {
        throw new Error(existingUser.email === email ? 'Email già registrata' : 'Username già in uso');
      }
      
      const newUser = {
        id: mockIdCounter++,
        email,
        username,
        password_hash: password,
        password: password, // Aggiungi anche questo per compatibilità
        first_name: firstName,
        last_name: lastName,
        firstName: firstName, // Aggiungi anche questo per compatibilità
        lastName: lastName, // Aggiungi anche questo per compatibilità
        role: 'user',
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      return [newUser];
    }
  }
  
  // Simula SELECT per email
  if (query.includes('SELECT * FROM users WHERE email')) {
    const email = params[0] || query.match(/email = '([^']+)'/)?.[1];
    const user = mockUsers.find(u => u.email === email);
    return user ? [user] : [];
  }
  
  // Simula SELECT per username
  if (query.includes('SELECT * FROM users WHERE username')) {
    const username = params[0] || query.match(/username = '([^']+)'/)?.[1];
    const user = mockUsers.find(u => u.username === username);
    return user ? [user] : [];
  }
  
  return [];
}

// Funzioni di esempio per operazioni comuni
export const db = {
  // Esempio: ottenere tutti i post
  async getPosts() {
    return executeQuery('SELECT * FROM posts ORDER BY created_at DESC');
  },

  // Esempio: ottenere un post per ID
  async getPostById(id: string) {
    const [post] = await executeQuery('SELECT * FROM posts WHERE id = $1', [id]);
    return post;
  },

  // Esempio: creare un nuovo post
  async createPost(title: string, content: string, author: string) {
    const [post] = await executeQuery(
      'INSERT INTO posts (title, content, author, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [title, content, author]
    );
    return post;
  },

  // Esempio: aggiornare un post
  async updatePost(id: string, title: string, content: string) {
    const [post] = await executeQuery(
      'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return post;
  },

  // Esempio: eliminare un post
  async deletePost(id: string) {
    await executeQuery('DELETE FROM posts WHERE id = $1', [id]);
  },

  // === GESTIONE UTENTI ===
  
  // Creare un nuovo utente
  async createUser(userData: { email: string, username: string, password: string, firstName?: string, lastName?: string }) {
    const { email, username, password, firstName, lastName } = userData;
    
    // Debug logging
    console.log('createUser userData:', userData);
    console.log('Extracted values:', { email, username, password: '***', firstName, lastName });
    
    // Prova con query template literals invece di parametri posizionali
    const query = `
      INSERT INTO users (email, username, password_hash, first_name, last_name, created_at) 
      VALUES ('${email}', '${username}', '${password}', ${firstName ? `'${firstName}'` : 'NULL'}, ${lastName ? `'${lastName}'` : 'NULL'}, NOW()) 
      RETURNING id, email, username, first_name, last_name, role, is_active, email_verified, created_at
    `;
    
    console.log('Generated query:', query);
    
    const [user] = await executeQuery(query, []);
    return user;
  },

  // Trovare utente per email
  async getUserByEmail(email: string) {
    const [user] = await executeQuery(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return user;
  },

  // Trovare utente per username
  async getUserByUsername(username: string) {
    const [user] = await executeQuery(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return user;
  },

  // Trovare utente per ID (senza password)
  async getUserById(id: string) {
    const [user] = await executeQuery(
      `SELECT id, email, username, first_name, last_name, role, is_active, 
              email_verified, created_at, updated_at, last_login 
       FROM users WHERE id = $1`,
      [id]
    );
    return user;
  },

  // Aggiornare ultimo login
  async updateLastLogin(userId: string) {
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [userId]
    );
  },

  // Aggiornare profilo utente
  async updateUserProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(updates.lastName);
    }
    if (updates.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const [user] = await executeQuery(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, email, username, first_name, last_name, role, is_active, email_verified, updated_at`,
      values
    );
    return user;
  },

  // Verificare email
  async verifyUserEmail(userId: string) {
    const [user] = await executeQuery(
      `UPDATE users SET email_verified = true, updated_at = NOW() WHERE id = $1 
       RETURNING id, email, email_verified`,
      [userId]
    );
    return user;
  },

  // Disattivare utente
  async deactivateUser(userId: string) {
    const [user] = await executeQuery(
      `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 
       RETURNING id, email, is_active`,
      [userId]
    );
    return user;
  },

  // Ottenere tutti gli utenti (admin)
  async getAllUsers(limit = 50, offset = 0) {
    return executeQuery(
      `SELECT id, email, username, first_name, last_name, role, is_active, 
              email_verified, created_at, last_login 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  },

  // Funzione generica per query personalizzate
  query: executeQuery
};

export default db;