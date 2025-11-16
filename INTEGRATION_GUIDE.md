# Guide d'Intégration dans un Projet Existant

Ce guide explique comment intégrer la scène 3D du personnage dans votre portfolio existant.

## 📦 Méthode 1 : Intégration Complète dans un Projet React Existant

### 1. Installer les dépendances

```bash
npm install three @react-three/fiber @react-three/drei
```

### 2. Copier les fichiers nécessaires

Copiez ces fichiers dans votre projet :

```
votre-projet/
├── src/
│   ├── components/
│   │   ├── Scene3D.jsx        # À copier
│   │   ├── Character.jsx      # À copier
│   │   └── Lights.jsx         # À copier
│   └── styles/
│       └── Scene3D.css        # Extrait de App.css
```

### 3. Créer le fichier Scene3D.css

Extrayez uniquement les styles liés à la scène 3D de `App.css` :

```css
/* Scene3D.css */
.scene-section {
  flex: 1;
  position: relative;
  min-height: 100vh;
}

.scene-section canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .scene-section {
    flex: none;
    min-height: 40vh;
    height: 40vh;
  }
}
```

### 4. Intégrer dans votre composant

Dans votre page de portfolio (ex: `HomePage.jsx`) :

```jsx
import Scene3D from './components/Scene3D'
import './styles/Scene3D.css'

function HomePage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Votre contenu existant */}
      <div style={{ flex: 2 }}>
        <h1>Mon Portfolio</h1>
        <p>Votre contenu...</p>
      </div>

      {/* Scène 3D */}
      <div className="scene-section">
        <Scene3D />
      </div>

    </div>
  )
}

export default HomePage
```

## 📦 Méthode 2 : Intégration dans un Projet Non-React (HTML/JS)

### 1. Créer un bundle séparé

Dans votre projet actuel, créez un dossier `3d-character/` :

```bash
cd votre-projet
mkdir 3d-character
cd 3d-character

# Copiez tout le contenu du projet Portfolio3D
# Puis buildez
npm install
npm run build
```

### 2. Copier le bundle dans votre projet

```bash
# Copiez le dossier dist/ généré
cp -r dist/* ../public/3d-character/
```

### 3. Intégrer dans votre HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Portfolio</title>
  <style>
    .portfolio-container {
      display: flex;
      min-height: 100vh;
    }
    .content {
      flex: 2;
      padding: 2rem;
    }
    .scene-3d {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="portfolio-container">

    <!-- Votre contenu -->
    <div class="content">
      <h1>Mon Portfolio</h1>
      <!-- ... -->
    </div>

    <!-- Scène 3D en iframe -->
    <div class="scene-3d">
      <iframe
        src="/3d-character/index.html"
        style="width: 100%; height: 100vh; border: none;"
        title="3D Character">
      </iframe>
    </div>

  </div>
</body>
</html>
```

## 📦 Méthode 3 : Web Component (Universel)

Pour une intégration universelle dans n'importe quel framework (Vue, Angular, Svelte, etc.).

### 1. Créer un Web Component

Créez `src/web-component/Character3D.jsx` :

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Scene3D from '../components/Scene3D'

class Character3DElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div')
    mountPoint.style.width = '100%'
    mountPoint.style.height = '100%'

    this.attachShadow({ mode: 'open' }).appendChild(mountPoint)

    const root = ReactDOM.createRoot(mountPoint)
    root.render(<Scene3D />)
  }
}

customElements.define('character-3d', Character3DElement)
```

### 2. Builder et utiliser

```html
<!-- Dans n'importe quel HTML -->
<script src="/character-3d-component.js"></script>

<character-3d style="width: 400px; height: 600px;"></character-3d>
```

## 🎨 Méthode 4 : Intégration Next.js

### 1. Créer un composant avec dynamic import

```jsx
// components/Scene3DWrapper.jsx
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false, // Désactiver le SSR pour Three.js
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="loading-spinner" />
    </div>
  )
})

export default function Scene3DWrapper() {
  return <Scene3D />
}
```

### 2. Utiliser dans votre page

```jsx
// pages/index.js
import Scene3DWrapper from '../components/Scene3DWrapper'

export default function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2 }}>
        <h1>Portfolio</h1>
      </div>
      <div style={{ flex: 1 }}>
        <Scene3DWrapper />
      </div>
    </div>
  )
}
```

## 🎨 Méthode 5 : Intégration WordPress

### 1. Installer le plugin "Simple Custom CSS and JS"

### 2. Upload des fichiers

Uploadez le dossier `dist/` buildé dans `/wp-content/uploads/3d-character/`

### 3. Créer un shortcode

Ajoutez dans `functions.php` :

```php
function character_3d_shortcode() {
    return '
    <div id="character-3d-root" style="width: 100%; height: 600px;"></div>
    <script src="/wp-content/uploads/3d-character/assets/index.js"></script>
    <link rel="stylesheet" href="/wp-content/uploads/3d-character/assets/index.css">
    ';
}
add_shortcode('character_3d', 'character_3d_shortcode');
```

### 4. Utiliser dans vos pages

```
[character_3d]
```

## ⚙️ Configuration Avancée

### Personnaliser les props du composant

Modifiez `Scene3D.jsx` pour accepter des props :

```jsx
function Scene3D({
  characterPosition = [0.5, 0, 0],
  cameraPosition = [0, 1.5, 5],
  enableControls = false,
  backgroundColor = '#0f0f1e'
}) {
  return (
    <Canvas>
      <PerspectiveCamera position={cameraPosition} />
      {enableControls && <OrbitControls />}
      <color attach="background" args={[backgroundColor]} />

      <Character position={characterPosition} />
    </Canvas>
  )
}
```

Usage :

```jsx
<Scene3D
  characterPosition={[1, 0, 0]}
  cameraPosition={[0, 2, 6]}
  enableControls={true}
  backgroundColor="#1a1a2e"
/>
```

### Communication parent-enfant

Pour contrôler la scène depuis votre app :

```jsx
// Dans votre composant parent
const [animationSpeed, setAnimationSpeed] = useState(0.8)

return (
  <>
    <button onClick={() => setAnimationSpeed(speed => speed + 0.2)}>
      Accélérer
    </button>

    <Scene3D animationSpeed={animationSpeed} />
  </>
)
```

```jsx
// Dans Character.jsx
function Character({ animationSpeed = 0.8 }) {
  const animationState = useRef({
    time: 0,
    typingSpeed: animationSpeed, // Utiliser la prop
    headBobbing: 0.05
  })

  // ...
}
```

## 🔧 Optimisation selon le contexte

### Pour un hero section (plein écran)

```css
.scene-section {
  position: fixed;
  top: 0;
  right: 0;
  width: 40vw;
  height: 100vh;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  width: 60vw;
}
```

### Pour une section de page

```css
.scene-section {
  width: 100%;
  height: 600px;
  max-width: 1200px;
  margin: 0 auto;
}
```

### Pour un widget sidebar

```css
.scene-section {
  width: 300px;
  height: 400px;
  position: sticky;
  top: 20px;
}
```

## 📱 Responsive Best Practices

```jsx
import { useMediaQuery } from '@react-hook/media-query'

function Scene3DResponsive() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Scene3D
      cameraPosition={isMobile ? [0, 1.5, 7] : [0, 1.5, 5]}
      enableControls={!isMobile}
    />
  )
}
```

## 🚀 Déploiement

### Vercel / Netlify

Le projet est prêt pour le déploiement :

```bash
# Build
npm run build

# Deploy avec Vercel
vercel

# Deploy avec Netlify
netlify deploy --prod --dir=dist
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name monportfolio.com;

    root /var/www/portfolio;

    location /3d-character {
        try_files $uri $uri/ /3d-character/index.html;
    }

    # Compression pour performances
    gzip on;
    gzip_types application/javascript text/css;
}
```

## ✅ Checklist d'Intégration

- [ ] Dépendances installées
- [ ] Fichiers copiés au bon endroit
- [ ] Styles CSS intégrés
- [ ] Composant importé correctement
- [ ] Scène visible dans le navigateur
- [ ] Animation de frappe fonctionne
- [ ] Responsive testé (mobile, tablet, desktop)
- [ ] Performances acceptables (> 30 FPS)
- [ ] Pas d'erreurs console
- [ ] Build de production testé

## 🆘 Problèmes Courants

### "Cannot find module 'three'"

```bash
npm install three @react-three/fiber @react-three/drei
```

### "window is not defined" (Next.js)

Utilisez dynamic import avec `ssr: false` (voir Méthode 4)

### Scène 3D ne s'affiche pas

Vérifiez que le conteneur a une hauteur définie :

```css
.scene-section {
  height: 600px; /* Hauteur fixe requise */
}
```

### Performance faible après intégration

- Vérifiez que Scene3D n'est pas re-rendu à chaque changement
- Utilisez `React.memo()` si nécessaire
- Limitez le dpr : `dpr={[1, 1.5]}`

---

**Besoin d'aide ?** Consultez le [README.md](./README.md) principal pour plus de détails.
