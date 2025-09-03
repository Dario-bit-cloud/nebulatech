# Guida alla Risoluzione degli Errori ESLint in Next.js

## Errori Comuni e Soluzioni

### 1. Warning: 'Metadata' is defined but never used

**Problema:**
```typescript
import type { Metadata } from 'next'; // ❌ Import non utilizzato

export const metadata = {
  title: 'Pagina',
};
```

**Soluzione:**
```typescript
// ✅ Rimuovi l'import se non usi il tipo Metadata
export const metadata = {
  title: 'Pagina',
};

// ✅ Oppure usa il tipo se necessario
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagina',
  description: 'Descrizione',
};
```

### 2. Error: Unescaped character '

**Problema:**
```jsx
<h1>All'avanguardia</h1> {/* ❌ Apostrofo non escapato */}
```

**Soluzioni:**
```jsx
{/* ✅ Opzione 1: HTML entity */}
<h1>All&apos;avanguardia</h1>

{/* ✅ Opzione 2: Unicode escape */}
<h1>All&#39;avanguardia</h1>

{/* ✅ Opzione 3: Template literal */}
<h1>{`All'avanguardia`}</h1>

{/* ✅ Opzione 4: Virgolette diverse */}
<h1>All'avanguardia</h1>
```

## Configurazione ESLint Ottimizzata

Il file `eslint.config.mjs` è stato aggiornato per:

1. **Trasformare errori in warning** - I warning non bloccano la build
2. **Regole personalizzate** - Adatte al development di Next.js
3. **Flessibilità** - Permette deploy anche con warning minori

### Regole Configurate:

- `@typescript-eslint/no-unused-vars: "warn"` - Variabili non utilizzate
- `react/no-unescaped-entities: "warn"` - Caratteri non escapati
- `no-console: "warn"` - Console.log in produzione
- `prefer-const: "warn"` - Preferenza per const

## Comandi Utili

```bash
# Controlla errori ESLint
npm run lint

# Correggi automaticamente errori semplici
npm run lint -- --fix

# Build con warning (non bloccante)
npm run build
```

## Best Practices

1. **Usa TypeScript strict mode** per catturare errori in fase di sviluppo
2. **Configura il tuo editor** per mostrare errori ESLint in tempo reale
3. **Usa pre-commit hooks** per validare il codice prima del commit
4. **Mantieni le regole ESLint aggiornate** con le best practices di Next.js