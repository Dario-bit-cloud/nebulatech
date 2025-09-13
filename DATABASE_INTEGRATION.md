# Integrazione Database Neon - NebulaTech

Questa documentazione descrive come utilizzare il database Neon integrato nel progetto NebulaTech.

## 📋 Panoramica

Il progetto è stato configurato per utilizzare **Neon Database** tramite Netlify, con il package `@netlify/neon` per una connessione ottimizzata e serverless.

## 🚀 Configurazione Iniziale

### 1. Variabili d'Ambiente

Il file `.env.local` contiene le configurazioni necessarie:

```env
NETLIFY_DATABASE_URL=your_database_url_here
NETLIFY_DATABASE_URL_UNPOOLED=your_unpooled_database_url_here
```

**⚠️ IMPORTANTE**: Sostituisci i valori placeholder con le URL reali dal tuo dashboard Netlify.

### 2. Package Installato

```bash
npm install @netlify/neon
```

## 🏗️ Struttura dei File

```
src/
├── lib/
│   └── database.ts          # Configurazione e funzioni database
├── app/
│   └── api/
│       └── test-db/
│           └── route.ts     # API di test per il database
└── components/
    └── DatabaseTest.tsx     # Componente React per test UI
```

## 💻 Utilizzo del Database

### Importazione

```typescript
import db from '@/lib/database';
```

### Funzioni Disponibili

#### Query Generica
```typescript
const result = await db.query('SELECT * FROM users WHERE active = $1', [true]);
```

#### Operazioni CRUD per Posts (Esempio)

```typescript
// Ottenere tutti i post
const posts = await db.getPosts();

// Ottenere un post specifico
const post = await db.getPostById('123');

// Creare un nuovo post
const newPost = await db.createPost('Titolo', 'Contenuto', 'Autore');

// Aggiornare un post
const updatedPost = await db.updatePost('123', 'Nuovo Titolo', 'Nuovo Contenuto');

// Eliminare un post
await db.deletePost('123');
```

## 🧪 Test dell'Integrazione

### 1. API Endpoint

Testa la connessione tramite:
- **GET** `/api/test-db` - Test di connessione
- **POST** `/api/test-db` - Creazione post di esempio

### 2. Componente UI

Utilizza il componente `DatabaseTest` per testare l'integrazione dal frontend:

```tsx
import DatabaseTest from '@/components/DatabaseTest';

function TestPage() {
  return (
    <div>
      <h1>Test Database</h1>
      <DatabaseTest />
    </div>
  );
}
```

## 📊 Schema Database di Esempio

Per utilizzare le funzioni di esempio, crea una tabella `posts`:

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Personalizzazione

### Aggiungere Nuove Funzioni

Nel file `src/lib/database.ts`, aggiungi nuove funzioni al oggetto `db`:

```typescript
export const db = {
  // ... funzioni esistenti
  
  // Nuova funzione personalizzata
  async getActiveUsers() {
    return executeQuery('SELECT * FROM users WHERE active = true');
  },
  
  async createUser(name: string, email: string) {
    const [user] = await executeQuery(
      'INSERT INTO users (name, email, active, created_at) VALUES ($1, $2, true, NOW()) RETURNING *',
      [name, email]
    );
    return user;
  }
};
```

### Gestione Errori

Tutte le funzioni includono gestione automatica degli errori. Per gestione personalizzata:

```typescript
try {
  const result = await db.getPosts();
  // Gestisci il successo
} catch (error) {
  console.error('Errore:', error.message);
  // Gestisci l'errore
}
```

## 🚀 Deployment

### Netlify

1. Assicurati che le variabili d'ambiente siano configurate nel dashboard Netlify
2. Il database Neon è automaticamente disponibile in produzione
3. Le connessioni sono ottimizzate per l'ambiente serverless

### Variabili d'Ambiente in Produzione

Nel dashboard Netlify, configura:
- `NETLIFY_DATABASE_URL`
- `NETLIFY_DATABASE_URL_UNPOOLED`

## 📝 Best Practices

1. **Usa sempre parametri preparati** per evitare SQL injection
2. **Gestisci sempre gli errori** nelle operazioni database
3. **Limita le query** per evitare timeout in ambiente serverless
4. **Usa transazioni** per operazioni multiple correlate
5. **Monitora le performance** tramite il dashboard Neon

## 🔍 Troubleshooting

### Errori Comuni

1. **"Database connection failed"**
   - Verifica le variabili d'ambiente
   - Controlla la connettività di rete

2. **"Table doesn't exist"**
   - Assicurati che le tabelle siano create nel database
   - Verifica i nomi delle tabelle

3. **"Timeout error"**
   - Ottimizza le query
   - Considera l'uso di indici

### Log e Debug

I log degli errori sono disponibili:
- Console del browser (per errori frontend)
- Log di Netlify Functions (per errori API)
- Dashboard Neon (per errori database)

## 📚 Risorse Utili

- [Documentazione Neon](https://neon.tech/docs)
- [Documentazione @netlify/neon](https://docs.netlify.com/databases/neon/)
- [Best Practices Serverless DB](https://neon.tech/docs/guides/serverless)

---

**Nota**: Questa integrazione è ottimizzata per l'ambiente serverless di Netlify e include gestione automatica delle connessioni e pooling.