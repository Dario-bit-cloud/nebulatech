# 🎮 Game Assets Directory

Questa cartella contiene tutte le risorse grafiche per la sezione Cloud Gaming di NebulaTech.

## 📁 Struttura delle Cartelle

### `/covers/`
Contiene le copertine dei giochi organizzate per dimensioni:

#### `/covers/large/` 
- **Dimensioni**: 1920x1080px (16:9)
- **Formato**: JPG, PNG, WebP
- **Uso**: Copertine principali, hero images, dettagli gioco
- **Qualità**: Alta (80-90%)

#### `/covers/medium/`
- **Dimensioni**: 800x450px (16:9)
- **Formato**: JPG, PNG, WebP  
- **Uso**: Card dei giochi, griglia principale
- **Qualità**: Media-Alta (70-80%)

#### `/covers/thumbnails/`
- **Dimensioni**: 400x225px (16:9)
- **Formato**: JPG, WebP
- **Uso**: Anteprime, liste compatte, mobile
- **Qualità**: Media (60-70%)

## 📝 Convenzioni di Naming

### Formato del Nome File
```
[nome-gioco]-[versione].[estensione]
```

### Esempi
```
fortnite-cover.jpg
minecraft-cover.png
call-of-duty-warzone-cover.webp
apex-legends-cover.jpg
```

### Regole di Naming
- **Tutto minuscolo**
- **Trattini al posto degli spazi**
- **Nomi descrittivi e coerenti**
- **Evitare caratteri speciali**

## 🎨 Specifiche Tecniche

### Formati Supportati
- **JPG**: Per immagini fotografiche e con molti colori
- **PNG**: Per immagini con trasparenza o pochi colori
- **WebP**: Formato moderno, dimensioni ridotte (preferito)

### Ottimizzazione
- Compressione ottimizzata per web
- Dimensioni file < 500KB per large
- Dimensioni file < 200KB per medium  
- Dimensioni file < 100KB per thumbnails

### Aspect Ratio
- **Principale**: 16:9 (landscape)
- **Alternativo**: 3:4 (portrait) per card verticali

## 🚀 Utilizzo nel Codice

### Importazione
```typescript
// Esempio di utilizzo nelle componenti React
const gameImage = '/games/covers/medium/fortnite-cover.webp'

// Con Next.js Image
import Image from 'next/image'
<Image 
  src="/games/covers/large/fortnite-cover.webp"
  alt="Fortnite Cover"
  width={800}
  height={450}
/>
```

### Path di Accesso
```
/games/covers/large/[nome-gioco]-cover.[ext]
/games/covers/medium/[nome-gioco]-cover.[ext]  
/games/covers/thumbnails/[nome-gioco]-cover.[ext]
```

## 📋 Checklist per Nuove Immagini

- [ ] Rispetta le dimensioni specificate
- [ ] Segue le convenzioni di naming
- [ ] È ottimizzata per il web
- [ ] Ha un aspect ratio corretto
- [ ] È disponibile in tutte e 3 le dimensioni
- [ ] Ha un alt text descrittivo

## 🔄 Aggiornamenti

Per aggiornare o aggiungere nuove copertine:

1. Prepara l'immagine nelle 3 dimensioni
2. Ottimizza per il web
3. Rinomina seguendo le convenzioni
4. Carica nelle rispettive cartelle
5. Aggiorna i riferimenti nel codice

---

**Ultimo aggiornamento**: Settembre 2024  
**Versione**: 1.0.0