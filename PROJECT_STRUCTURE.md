# 📂 Structure du Projet

```
Portfollio/
│
├── 📄 index.html                  # Point d'entrée HTML
├── 📄 package.json                # Dépendances et scripts
├── 📄 vite.config.js             # Configuration Vite (build tool)
│
├── 📄 .gitignore                 # Fichiers à ignorer par Git
├── 📄 .env.example               # Variables d'environnement (template)
│
├── 📘 README.md                  # Documentation principale ⭐ COMMENCER ICI
├── 📘 QUICKSTART.md              # Guide de démarrage rapide (5 min)
├── 📘 INTEGRATION_GUIDE.md       # Guide d'intégration avancée
├── 📘 VARIANTS.md                # Variantes et exemples avancés
├── 📘 PROJECT_STRUCTURE.md       # Ce fichier
│
└── src/
    │
    ├── 📄 main.jsx               # Point d'entrée React
    ├── 📄 App.jsx                # Composant principal
    │
    ├── components/               # Composants React
    │   ├── 📄 Scene3D.jsx        # Scène 3D principale
    │   ├── 📄 Character.jsx      # Personnage (primitives Three.js)
    │   ├── 📄 CharacterGLTF.jsx  # Personnage (modèle GLTF)
    │   └── 📄 Lights.jsx         # Système d'éclairage 3 points
    │
    └── styles/
        └── 📄 App.css            # Styles globaux et layout
```

## 📋 Description des Fichiers

### 🔧 Configuration

| Fichier | Description | À modifier ? |
|---------|-------------|--------------|
| `package.json` | Dépendances NPM et scripts | ❌ Sauf ajout de dépendances |
| `vite.config.js` | Config du bundler | ❌ Fonctionne out-of-the-box |
| `.gitignore` | Fichiers ignorés par Git | ❌ Déjà configuré |
| `.env.example` | Template variables d'env | ✅ Optionnel |

### 📚 Documentation

| Fichier | Usage | Quand le lire ? |
|---------|-------|-----------------|
| `README.md` | Doc complète | 1️⃣ **Commencer ici** |
| `QUICKSTART.md` | Démarrage rapide | Pour démarrer en 5 min |
| `INTEGRATION_GUIDE.md` | Intégration dans projet existant | Quand vous avez déjà un site |
| `VARIANTS.md` | Exemples avancés | Pour personnalisation poussée |
| `PROJECT_STRUCTURE.md` | Arborescence | Ce fichier (référence) |

### 🎨 Code Source

#### Fichiers principaux

| Fichier | Rôle | Modifiable ? |
|---------|------|--------------|
| `src/main.jsx` | Bootstrap React | ❌ Ne pas modifier |
| `src/App.jsx` | Layout principal | ✅ Pour changer le contenu texte |
| `index.html` | HTML de base | ✅ Pour SEO, meta tags |

#### Composants 3D

| Fichier | Rôle | Complexité | Modifiable ? |
|---------|------|------------|--------------|
| `Scene3D.jsx` | Configuration scène 3D | ⭐⭐ Moyenne | ✅ Caméra, fond, contrôles |
| `Character.jsx` | Personnage (primitives) | ⭐⭐⭐ Complexe | ✅ Couleurs, positions, animations |
| `CharacterGLTF.jsx` | Personnage (modèle GLTF) | ⭐⭐ Moyenne | ✅ Chemin modèle, scale |
| `Lights.jsx` | Éclairage 3 points | ⭐ Simple | ✅ Position, intensité lumières |

#### Styles

| Fichier | Rôle | Modifiable ? |
|---------|------|--------------|
| `src/styles/App.css` | Layout et styles | ✅ Couleurs, responsive, fonts |

## 🎯 Workflow de Personnalisation

### Niveau 1 - Modifications Simples (5-10 min)

**Fichiers à toucher :**
1. `App.css` - Couleurs et design
2. `Character.jsx` - Couleurs du personnage

**Ce que vous pouvez changer :**
- Couleurs du personnage
- Vitesse de frappe
- Couleurs du fond et de l'interface
- Texte du portfolio

### Niveau 2 - Personnalisation Avancée (30 min - 1h)

**Fichiers à toucher :**
1. `Scene3D.jsx` - Paramètres scène
2. `Lights.jsx` - Éclairage
3. `Character.jsx` - Positions, animations
4. `App.jsx` - Structure layout

**Ce que vous pouvez changer :**
- Position caméra et FOV
- Système d'éclairage complet
- Position et posture du personnage
- Ajouter des éléments 3D (bureau, décor)
- Layout de la page

### Niveau 3 - Modifications Expertes (2h+)

**Fichiers à toucher :**
1. Tous les fichiers
2. Créer de nouveaux composants

**Ce que vous pouvez changer :**
- Remplacer par un modèle GLTF
- Ajouter des interactions (clics, hover)
- Créer de nouvelles animations
- Post-processing (effets visuels)
- Optimisations avancées

## 📊 Taille des Fichiers

| Catégorie | Fichiers | Lignes de code | Poids |
|-----------|----------|----------------|-------|
| Configuration | 4 fichiers | ~100 lignes | < 5 KB |
| Documentation | 5 fichiers | ~2000 lignes | ~80 KB |
| Code source | 8 fichiers | ~800 lignes | ~35 KB |
| **Total** | **17 fichiers** | **~2900 lignes** | **~120 KB** |

## 🚀 Dossiers à Créer (Optionnels)

Ces dossiers n'existent pas par défaut mais peuvent être créés selon vos besoins :

```
public/
└── models/                   # Pour modèles GLTF
    └── character.glb         # Votre personnage 3D

src/
├── hooks/                    # Custom React hooks
│   └── useCharacterAnimation.js
│
├── utils/                    # Fonctions utilitaires
│   └── animations.js
│
└── assets/                   # Images, fonts, etc.
    ├── images/
    └── fonts/
```

## 🔍 Détail des Composants 3D

### Scene3D.jsx (60 lignes)

**Sections :**
- Configuration Canvas (lignes 15-30)
- Configuration caméra (lignes 25-28)
- Contrôles optionnels (lignes 30-36)
- Fond et brouillard (lignes 38-40)
- Import des composants enfants (lignes 42-50)

**Points d'entrée pour modifications :**
- L20 : `dpr={[1, 2]}` → Qualité du rendu
- L26 : `position={[0, 1.5, 5]}` → Position caméra
- L27 : `fov={50}` → Champ de vision
- L39 : `args={['#0f0f1e']}` → Couleur fond

### Character.jsx (350 lignes)

**Sections :**
- Animation state (lignes 15-30)
- Animation frame loop (lignes 35-55)
- Torse et tête (lignes 60-120)
- Membres (bras, jambes) (lignes 125-250)
- Ordinateur portable (lignes 255-330)
- Chaise (lignes 335-350)

**Points d'entrée pour modifications :**
- L20 : `typingSpeed: 0.8` → Vitesse frappe
- L65 : `color="#2c3e50"` → Couleur vêtements
- L85 : `color="#f4c2a5"` → Couleur peau
- L270 : Laptop design complet

### Lights.jsx (65 lignes)

**Sections :**
- Lumière ambiante (ligne 12)
- Key light (lignes 15-28)
- Fill light (lignes 31-36)
- Rim light (lignes 39-45)
- Lumière écran (lignes 48-54)

**Points d'entrée pour modifications :**
- L16 : `position={[3, 4, 5]}` → Position key light
- L17 : `intensity={1.2}` → Intensité
- Chaque bloc de lumière est indépendant

## 💡 Tips de Navigation

### Pour trouver rapidement une section :

**Recherche par mots-clés dans VSCode (Ctrl/Cmd + F) :**

| Cherchez | Pour trouver |
|----------|--------------|
| `color="#` | Toutes les couleurs |
| `position={[` | Toutes les positions 3D |
| `intensity=` | Intensité des lumières |
| `// ===` | Sections principales |
| `useFrame` | Animations |
| `mesh` | Tous les objets 3D |

### Commentaires dans le code :

Tous les fichiers utilisent des commentaires clairs :

```jsx
// ===== SECTION PRINCIPALE =====

/* Sous-section */

// Commentaire ligne par ligne
```

## 📦 Après Build (`npm run build`)

```
dist/                         # Dossier généré
├── index.html               # HTML optimisé
└── assets/
    ├── index-[hash].js      # JS bundlé et minifié
    ├── index-[hash].css     # CSS bundlé et minifié
    └── ...                  # Autres assets
```

**Taille du build (estimée) :** ~500 KB (non gzippé), ~150 KB (gzippé)

---

## 🎓 Ordre de Lecture Recommandé

### Pour démarrer rapidement :
1. **QUICKSTART.md** (5 min)
2. Modifier quelques couleurs
3. Profiter !

### Pour comprendre le projet :
1. **README.md** - Vue d'ensemble (15 min)
2. **PROJECT_STRUCTURE.md** (ce fichier) - Architecture (5 min)
3. Code source avec commentaires (30 min)

### Pour intégrer dans votre site :
1. **INTEGRATION_GUIDE.md** (15 min)
2. Suivre la méthode adaptée à votre stack

### Pour aller plus loin :
1. **VARIANTS.md** - Exemples avancés (20 min)
2. Documentation React Three Fiber
3. Expérimentation !

---

**🎯 Vous êtes maintenant prêt à explorer et personnaliser votre scène 3D !**

**Questions ?** → Consultez le README.md
**Problème ?** → Section Troubleshooting du README.md
**Idée cool ?** → Expérimentez ! Le code est bien documenté.
