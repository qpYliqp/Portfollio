# Variantes et Exemples Avancés

Ce document présente des variantes du personnage et des exemples d'utilisation avancés.

## 🎨 Variantes de Style

### 1. Mode Sombre / Clair

Créez `src/components/Scene3DThemed.jsx` :

```jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import Character from './Character'
import Lights from './Lights'

function Scene3DThemed({ theme = 'dark' }) {
  const isDark = theme === 'dark'

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />

      {/* Couleur de fond selon le thème */}
      <color attach="background" args={[isDark ? '#0f0f1e' : '#e8eef5']} />
      <fog attach="fog" args={[isDark ? '#0f0f1e' : '#e8eef5', 5, 15]} />

      {/* Éclairage ajusté */}
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={isDark ? 1.2 : 0.8}
        color={isDark ? '#ffffff' : '#ffeaa7'}
        castShadow
      />

      <Character />
    </Canvas>
  )
}

export default Scene3DThemed
```

Usage :

```jsx
// Mode sombre
<Scene3DThemed theme="dark" />

// Mode clair
<Scene3DThemed theme="light" />

// Avec toggle
const [theme, setTheme] = useState('dark')
<Scene3DThemed theme={theme} />
```

### 2. Variante avec Particules

Ajoutez un système de particules dans `Scene3D.jsx` :

```jsx
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo } from 'react'

function ParticleField() {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = Math.random() * 10
      const z = (Math.random() - 0.5) * 10
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  return (
    <Points positions={particles}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  )
}

// Dans Scene3D
<ParticleField />
```

### 3. Variante avec Environnement Complet

Bureau avec décoration :

```jsx
function Office() {
  return (
    <group>
      {/* Bureau */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Lampe de bureau */}
      <group position={[-0.7, 0.35, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.4]} />
          <meshStandardMaterial color="#2c3e50" metalness={0.8} />
        </mesh>
        <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#ffd4a3" distance={2} />
      </group>

      {/* Tasse de café */}
      <group position={[0.6, 0.35, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      </group>

      {/* Pot de plante */}
      <group position={[0.8, 0.35, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#d35400" />
        </mesh>
        {/* Feuilles */}
        {[0, 1, 2, 3].map(i => (
          <mesh
            key={i}
            position={[
              Math.cos(i * Math.PI / 2) * 0.08,
              0.12,
              Math.sin(i * Math.PI / 2) * 0.08
            ]}
            rotation={[0, i * Math.PI / 2, 0.5]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.15, 0.08]} />
            <meshStandardMaterial color="#27ae60" />
          </mesh>
        ))}
      </group>

      {/* Cadre photo */}
      <mesh position={[-0.5, 0.5, -0.48]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial color="#34495e" metalness={0.6} />
      </mesh>
    </group>
  )
}

// Dans Scene3D
<Office />
```

## 🎬 Animations Avancées

### 1. Rotation de tête interactive (suit la souris)

Dans `Character.jsx`, ajoutez :

```jsx
import { useThree } from '@react-three/fiber'

function Character() {
  const headRef = useRef()
  const { mouse } = useThree()

  useFrame(() => {
    if (headRef.current) {
      // La tête suit la souris
      headRef.current.rotation.y = mouse.x * 0.3
      headRef.current.rotation.x = -mouse.y * 0.2
    }
  })

  return (
    <group>
      {/* ... */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        {/* Tête */}
      </group>
    </group>
  )
}
```

### 2. Animation de clignement des yeux

```jsx
function Character() {
  const eyeLeftRef = useRef()
  const eyeRightRef = useRef()
  const blinkState = useRef({ nextBlink: 2, blinkDuration: 0 })

  useFrame((state, delta) => {
    // Clignement aléatoire
    blinkState.current.nextBlink -= delta

    if (blinkState.current.nextBlink <= 0) {
      blinkState.current.blinkDuration = 0.15
      blinkState.current.nextBlink = 2 + Math.random() * 3
    }

    if (blinkState.current.blinkDuration > 0) {
      blinkState.current.blinkDuration -= delta
      const scale = Math.abs(Math.sin(blinkState.current.blinkDuration * 20))

      if (eyeLeftRef.current) eyeLeftRef.current.scale.y = scale
      if (eyeRightRef.current) eyeRightRef.current.scale.y = scale
    } else {
      if (eyeLeftRef.current) eyeLeftRef.current.scale.y = 1
      if (eyeRightRef.current) eyeRightRef.current.scale.y = 1
    }
  })

  return (
    <group>
      {/* ... */}
      <mesh ref={eyeLeftRef} position={[-0.1, 0.05, 0.18]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.1, 0.05, 0.18]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  )
}
```

### 3. Respiration réaliste

```jsx
function Character() {
  const torsoRef = useRef()

  useFrame((state) => {
    if (torsoRef.current) {
      // Mouvement de respiration
      const breath = Math.sin(state.clock.elapsedTime * 0.5) * 0.02 + 1
      torsoRef.current.scale.set(1, breath, 1)
    }
  })

  return (
    <group>
      <mesh ref={torsoRef} castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  )
}
```

## 🎮 Interactivité

### 1. Personnage cliquable

```jsx
function Character() {
  const [isWaving, setIsWaving] = useState(false)
  const rightArmRef = useRef()

  const handleClick = () => {
    setIsWaving(true)
    setTimeout(() => setIsWaving(false), 2000)
  }

  useFrame(() => {
    if (isWaving && rightArmRef.current) {
      const wave = Math.sin(Date.now() * 0.01) * 0.5
      rightArmRef.current.rotation.z = wave
    } else if (rightArmRef.current) {
      rightArmRef.current.rotation.z = 0
    }
  })

  return (
    <group onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* ... */}
      <mesh ref={rightArmRef} position={[0.45, 0.7, 0.1]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  )
}
```

### 2. Hover effect

```jsx
function Character() {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
      style={{ cursor: hovered ? 'pointer' : 'auto' }}
    >
      {/* Personnage avec transition smooth */}
    </group>
  )
}
```

## 🌟 Effets Visuels

### 1. Post-processing (effets visuels)

Installez d'abord :

```bash
npm install @react-three/postprocessing
```

Dans `Scene3D.jsx` :

```jsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

function Scene3D() {
  return (
    <Canvas>
      {/* ... scène ... */}

      <EffectComposer>
        {/* Effet de bloom (lueur) */}
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />

        {/* Aberration chromatique subtile */}
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </Canvas>
  )
}
```

### 2. Ombres douces (PCSS)

```jsx
<Canvas shadows={{ type: 'PCFSoftShadowMap' }}>
  {/* Ombres plus douces et réalistes */}
</Canvas>
```

### 3. Reflets et matériaux avancés

```jsx
import { Environment } from '@react-three/drei'

function Scene3D() {
  return (
    <Canvas>
      {/* HDRI pour reflets réalistes */}
      <Environment preset="sunset" />

      {/* ... reste de la scène ... */}
    </Canvas>
  )
}
```

## 📊 Performance Monitoring

### Afficher les FPS en développement

```jsx
import { Perf } from 'r3f-perf'

function Scene3D() {
  const isDev = import.meta.env.DEV

  return (
    <Canvas>
      {isDev && <Perf position="top-left" />}
      {/* ... */}
    </Canvas>
  )
}
```

### Adaptive Performance

```jsx
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'

function Scene3D() {
  return (
    <Canvas>
      {/* Réduit automatiquement le DPR si FPS < 60 */}
      <AdaptiveDpr pixelated />

      {/* Réduit la fréquence des events si performances faibles */}
      <AdaptiveEvents />

      {/* ... */}
    </Canvas>
  )
}
```

## 🎯 Cas d'Usage Spécifiques

### 1. Avatar pour un chat en direct

```jsx
function LiveChatCharacter({ message, isTalking }) {
  const mouthRef = useRef()

  useFrame(() => {
    if (isTalking && mouthRef.current) {
      // Animation de la bouche quand l'utilisateur parle
      mouthRef.current.scale.y = Math.abs(Math.sin(Date.now() * 0.02)) * 0.5 + 0.5
    }
  })

  return (
    <group>
      {/* Personnage */}
      {/* ... */}

      {/* Bulle de message */}
      {message && (
        <Html position={[0, 2, 0]}>
          <div style={{
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            maxWidth: '200px'
          }}>
            {message}
          </div>
        </Html>
      )}
    </group>
  )
}
```

### 2. Vitrine de produit (remplacer laptop par un produit)

```jsx
function ProductShowcase({ productModel }) {
  return (
    <group position={[0, 0.55, 0.7]}>
      {/* Remplacer l'ordinateur par votre produit */}
      <primitive object={productModel} />

      {/* Socle rotatif */}
      <mesh position={[0, -0.1, 0]} rotation={[0, Date.now() * 0.0005, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.8} />
      </mesh>
    </group>
  )
}
```

### 3. Présentation d'équipe (plusieurs personnages)

```jsx
function TeamScene() {
  const teamMembers = [
    { name: 'Alice', position: [-2, 0, 0], color: '#e74c3c' },
    { name: 'Bob', position: [0, 0, 0], color: '#3498db' },
    { name: 'Charlie', position: [2, 0, 0], color: '#2ecc71' }
  ]

  return (
    <>
      {teamMembers.map((member, i) => (
        <Character
          key={i}
          position={member.position}
          shirtColor={member.color}
        />
      ))}
    </>
  )
}
```

## 🔊 Audio Réactif

### Personnage réagit à la musique

```jsx
import { useEffect, useRef } from 'react'

function AudioReactiveCharacter() {
  const audioRef = useRef()
  const analyserRef = useRef()
  const headRef = useRef()

  useEffect(() => {
    const audio = new Audio('/music.mp3')
    const context = new AudioContext()
    const analyser = context.createAnalyser()
    const source = context.createMediaElementSource(audio)

    source.connect(analyser)
    analyser.connect(context.destination)

    audioRef.current = audio
    analyserRef.current = analyser

    audio.play()

    return () => audio.pause()
  }, [])

  useFrame(() => {
    if (analyserRef.current && headRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(data)

      const avg = data.reduce((a, b) => a + b) / data.length
      headRef.current.rotation.z = (avg / 255) * 0.2
    }
  })

  return (
    <group>
      <group ref={headRef}>
        {/* Tête */}
      </group>
    </group>
  )
}
```

## 📱 Mobile-Specific Optimizations

```jsx
function Scene3DMobile() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <Canvas
      dpr={isMobile ? [1, 1] : [1, 2]}
      gl={{
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      }}
    >
      {/* Réduire la qualité des ombres sur mobile */}
      <directionalLight
        castShadow
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
      />

      {/* Désactiver les contrôles sur mobile */}
      {!isMobile && <OrbitControls />}

      <Character />
    </Canvas>
  )
}
```

## 🌍 Multi-Language Support

```jsx
const languages = {
  en: {
    greeting: "Hello! I'm working on your project.",
    typing: "Typing..."
  },
  fr: {
    greeting: "Bonjour ! Je travaille sur votre projet.",
    typing: "En train d'écrire..."
  },
  es: {
    greeting: "¡Hola! Estoy trabajando en tu proyecto.",
    typing: "Escribiendo..."
  }
}

function CharacterWithText({ language = 'en' }) {
  const text = languages[language]

  return (
    <group>
      <Character />
      <Html position={[0, 2.5, 0]}>
        <div className="character-speech-bubble">
          {text.greeting}
        </div>
      </Html>
    </group>
  )
}
```

---

Ces variantes vous permettent d'adapter le personnage à de nombreux cas d'usage. N'hésitez pas à les combiner pour créer votre propre version unique !

**Astuce** : Utilisez les DevTools de React (`react-devtools`) et Three.js (`drei/useHelper`) pour débugger et optimiser vos scènes.
