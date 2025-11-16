import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Character from './Character'
import Lights from './Lights'

/**
 * Composant Scene3D
 * Gère la scène 3D principale avec le personnage et l'éclairage
 * Optimisé pour les performances web et mobile
 */
function Scene3D() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Indicateur de chargement */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      <Canvas
        shadows
        // Configuration des performances
        dpr={[1, 2]} // Limite le pixel ratio pour les performances
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={() => setLoading(false)}
      >
        {/* Caméra principale */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1.5, 5]} // Position face au personnage
          fov={50} // Field of view
        />

        {/* Contrôles de caméra (optionnels, à désactiver en production si non souhaité) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          target={[0, 1, 0]} // Centré sur le personnage
        />

        {/* Fond dégradé sombre */}
        <color attach="background" args={['#0f0f1e']} />
        <fog attach="fog" args={['#0f0f1e', 5, 15]} />

        {/* Système d'éclairage 3 points */}
        <Lights />

        {/* Personnage et environnement */}
        <Suspense fallback={null}>
          <Character />
        </Suspense>

        {/* Sol simple (optionnel) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  )
}

export default Scene3D
