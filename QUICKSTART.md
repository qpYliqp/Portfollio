# 🚀 Démarrage Rapide - 5 Minutes

Guide ultra-rapide pour avoir votre personnage 3D en ligne en moins de 5 minutes.

## ⚡ Méthode 1 : Démarrage Immédiat (Recommandé)

### Étape 1 : Installation (30 secondes)

```bash
npm install
```

### Étape 2 : Lancement (10 secondes)

```bash
npm run dev
```

### Étape 3 : Résultat

Ouvrez `http://localhost:3000` dans votre navigateur.

**Vous devriez voir :**
- ✅ Un personnage humanoïde à droite
- ✅ En train de taper sur un ordinateur
- ✅ Avec animation des mains
- ✅ Sur fond sombre dégradé

**🎉 C'est tout ! Votre scène 3D fonctionne.**

---

## 🎨 Méthode 2 : Personnalisation Rapide (5 minutes)

### 1. Changer la couleur du personnage

Ouvrez `src/components/Character.jsx` et trouvez (ligne ~50) :

```jsx
<meshStandardMaterial
  color="#2c3e50"  // ← Changez cette couleur (vêtements)
/>
```

**Couleurs suggérées :**
- Bleu foncé : `#2c3e50` (défaut)
- Rouge : `#e74c3c`
- Vert : `#27ae60`
- Violet : `#8e44ad`
- Noir : `#2c2c2c`

### 2. Changer la couleur de l'écran

Dans le même fichier, ligne ~200 :

```jsx
<meshStandardMaterial
  color="#6366f1"  // ← Couleur de l'écran
  emissive="#6366f1"
/>
```

### 3. Ajuster la vitesse de frappe

Ligne ~30 :

```jsx
typingSpeed: 0.8,  // ← Plus élevé = plus rapide
```

Essayez `1.5` pour une frappe rapide ou `0.3` pour une frappe lente.

### 4. Repositionner le personnage

Ligne ~1 du `return` :

```jsx
<group position={[0.5, 0, 0]}>  // ← [gauche/droite, bas/haut, avant/arrière]
```

- Plus à droite : `[1, 0, 0]`
- Plus à gauche : `[-0.5, 0, 0]`
- Plus haut : `[0.5, 0.5, 0]`

### 5. Sauvegarder et voir les changements

Les changements sont automatiquement visibles (hot reload).

---

## 🖼️ Méthode 3 : Utiliser un Modèle GLTF Réaliste (10 minutes)

Pour un personnage encore plus réaliste :

### Étape 1 : Télécharger un modèle

**Option la plus simple - Mixamo :**

1. Allez sur https://www.mixamo.com/
2. Créez un compte gratuit (avec Adobe ID)
3. Choisissez un personnage (ex: "Aj", "Kaya")
4. Cliquez sur "Download"
   - Format : **GLB**
   - Pose : **T-Pose**
5. Sauvegardez le fichier

### Étape 2 : Placer le modèle

```bash
# Créer le dossier
mkdir public/models

# Copier votre fichier téléchargé et le renommer
cp ~/Downloads/votre-modele.glb public/models/character.glb
```

### Étape 3 : Activer le composant GLTF

Dans `src/components/Scene3D.jsx`, ligne 3, changez :

```jsx
import Character from './Character'
```

par :

```jsx
import Character from './CharacterGLTF'
```

### Étape 4 : Rafraîchir le navigateur

**Résultat :** Votre personnage Mixamo apparaît maintenant !

---

## 📱 Méthode 4 : Tester sur Mobile (2 minutes)

### Option A : Utiliser ngrok (recommandé)

```bash
# Installer ngrok
npm install -g ngrok

# Dans un terminal, lancez le serveur
npm run dev

# Dans un autre terminal
ngrok http 3000
```

Ouvrez l'URL `https://xxxxx.ngrok.io` sur votre mobile.

### Option B : Utiliser votre IP locale

```bash
# Trouvez votre IP
# Sur Mac/Linux :
ifconfig | grep "inet "

# Sur Windows :
ipconfig
```

Sur votre mobile (même réseau WiFi), ouvrez :
`http://VOTRE_IP:3000`

---

## 🎯 Méthode 5 : Intégrer dans votre Site Existant (3 minutes)

### Si vous avez déjà un projet React

```bash
# Dans VOTRE projet
npm install three @react-three/fiber @react-three/drei
```

Copiez ces 3 fichiers dans votre projet :
- `src/components/Scene3D.jsx`
- `src/components/Character.jsx`
- `src/components/Lights.jsx`

Dans votre page :

```jsx
import Scene3D from './components/Scene3D'

function MaPage() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2 }}>
        {/* Votre contenu */}
      </div>

      <div style={{ flex: 1, height: '100vh' }}>
        <Scene3D />
      </div>
    </div>
  )
}
```

---

## 🔧 Problèmes Courants (Fixes Rapides)

### Le personnage n'apparaît pas

**Solution 1 :** Rafraîchissez la page (Ctrl/Cmd + R)

**Solution 2 :** Vérifiez la console (F12)
```bash
# S'il y a une erreur de dépendances :
rm -rf node_modules package-lock.json
npm install
```

### Performance lente sur mon PC

Dans `src/components/Scene3D.jsx`, ligne ~20, changez :

```jsx
dpr={[1, 2]}  // ← Changez en [1, 1]
```

Et ligne ~25 :

```jsx
antialias: true,  // ← Changez en false
```

### L'écran est noir

**Cause probable :** Carte graphique non compatible

**Solution :** Testez dans un autre navigateur (Chrome recommandé)

### Le modèle GLTF ne se charge pas

**Vérifiez :**
1. Le fichier est bien dans `public/models/character.glb`
2. Le nom est exactement `character.glb` (pas `Character.glb`)
3. Le chemin dans `CharacterGLTF.jsx` est `/models/character.glb`

---

## 🎨 Personnalisations Express

### Changer le fond

`src/components/Scene3D.jsx`, ligne ~35 :

```jsx
<color attach="background" args={['#0f0f1e']} />
```

**Fonds suggérés :**
- Bleu nuit : `#0f0f1e` (défaut)
- Noir : `#000000`
- Gris : `#1a1a1a`
- Violet foncé : `#1a0933`

### Désactiver le brouillard

Commentez la ligne ~36 :

```jsx
{/* <fog attach="fog" args={['#0f0f1e', 5, 15]} /> */}
```

### Désactiver les contrôles de caméra

Commentez lignes ~28-34 :

```jsx
{/* <OrbitControls ... /> */}
```

---

## 🚀 Build pour Production (1 minute)

```bash
# Build optimisé
npm run build

# Tester le build
npm run preview
```

Les fichiers sont dans `dist/` - uploadez-les sur votre hébergeur (Netlify, Vercel, etc.).

---

## 📚 Prochaines Étapes

Maintenant que ça fonctionne, explorez :

1. **[README.md](./README.md)** - Documentation complète
2. **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Intégration avancée
3. **[VARIANTS.md](./VARIANTS.md)** - Variantes et animations

---

## ❓ Besoin d'Aide ?

**Problème technique :**
1. Consultez la section Troubleshooting du README.md
2. Vérifiez la console du navigateur (F12)
3. Essayez dans un navigateur différent

**Personnalisation :**
- Tous les fichiers sont commentés
- Chaque section est clairement identifiée
- N'hésitez pas à expérimenter !

---

**🎉 Bon développement et amusez-vous bien avec votre personnage 3D !**

---

## 🔥 Snippets Ultra-Rapides

### Changer TOUT en une fois

Copiez-collez ça dans `Character.jsx` (ligne ~60) pour un personnage avec un style différent :

```jsx
// STYLE CYBERPUNK
<meshStandardMaterial
  color="#00ffff"
  emissive="#ff00ff"
  emissiveIntensity={0.2}
  metalness={0.8}
  roughness={0.2}
/>
```

```jsx
// STYLE CORPORATE
<meshStandardMaterial
  color="#1a1a1a"
  roughness={0.9}
  metalness={0.1}
/>
```

```jsx
// STYLE COLORÉ
<meshStandardMaterial
  color="#e74c3c"
  roughness={0.6}
  metalness={0.3}
/>
```

### Animation plus dynamique

Dans `Character.jsx`, remplacez les lignes ~40-50 par :

```jsx
// FRAPPE RAPIDE ET ÉNERGIQUE
leftHandRef.current.rotation.x = Math.sin(t * 8) * 0.3 + 0.2
leftHandRef.current.position.y = Math.sin(t * 8) * 0.08 - 0.3

rightHandRef.current.rotation.x = Math.sin(t * 8 + Math.PI) * 0.3 + 0.2
rightHandRef.current.position.y = Math.sin(t * 8 + Math.PI) * 0.08 - 0.3
```

**Sauvegardez et voyez la différence !**
