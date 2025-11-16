import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Character
 * Personnage humanoïde réaliste (niveau PS3) assis devant un ordinateur portable
 * Avec animation de frappe au clavier
 *
 * NOTE: Ce composant utilise des primitives Three.js pour la démo.
 * Pour un résultat optimal, remplacez par un modèle GLTF réaliste.
 * Voir README.md pour les recommandations de modèles.
 */
function Character() {
  // Références pour les animations
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  const headRef = useRef()

  // État de l'animation
  const animationState = useRef({
    time: 0,
    typingSpeed: 0.8, // Vitesse de frappe
    headBobbing: 0.05 // Intensité du mouvement de tête
  })

  // Animation de frappe au clavier
  useFrame((state, delta) => {
    animationState.current.time += delta

    // Animation des mains - mouvement de frappe alternée
    if (leftHandRef.current && rightHandRef.current) {
      const t = animationState.current.time * animationState.current.typingSpeed

      // Main gauche
      leftHandRef.current.rotation.x = Math.sin(t * 4) * 0.15 + 0.2
      leftHandRef.current.position.y = Math.sin(t * 4) * 0.03 - 0.3

      // Main droite (déphasée)
      rightHandRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.15 + 0.2
      rightHandRef.current.position.y = Math.sin(t * 4 + Math.PI) * 0.03 - 0.3
    }

    // Animation subtile de la tête (léger mouvement)
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(animationState.current.time * 0.5) * animationState.current.headBobbing
      headRef.current.rotation.y = Math.sin(animationState.current.time * 0.3) * animationState.current.headBobbing * 2
    }
  })

  return (
    <group position={[0.5, 0, 0]}> {/* Positionné légèrement à droite */}

      {/* ===== PERSONNAGE HUMANOÏDE ===== */}
      <group position={[0, 0.5, 0]}> {/* Position assise */}

        {/* TORSE */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[0.6, 0.8, 0.4]} />
          <meshStandardMaterial
            color="#2c3e50"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* TÊTE */}
        <group ref={headRef} position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.4, 0.35]} />
            <meshStandardMaterial
              color="#f4c2a5"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Yeux */}
          <mesh castShadow position={[-0.1, 0.05, 0.18]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh castShadow position={[0.1, 0.05, 0.18]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>

          {/* Cheveux */}
          <mesh castShadow position={[0, 0.25, 0]}>
            <boxGeometry args={[0.38, 0.2, 0.38]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
          </mesh>
        </group>

        {/* COU */}
        <mesh castShadow position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
          <meshStandardMaterial color="#f4c2a5" />
        </mesh>

        {/* ÉPAULE GAUCHE */}
        <mesh castShadow position={[-0.35, 1.1, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* BRAS GAUCHE */}
        <mesh castShadow position={[-0.45, 0.7, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* AVANT-BRAS GAUCHE */}
        <mesh castShadow position={[-0.55, 0.3, 0.2]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.5, 16]} />
          <meshStandardMaterial color="#f4c2a5" />
        </mesh>

        {/* MAIN GAUCHE */}
        <group ref={leftHandRef} position={[-0.55, -0.1, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.05, 0.15]} />
            <meshStandardMaterial color="#f4c2a5" />
          </mesh>
        </group>

        {/* ÉPAULE DROITE */}
        <mesh castShadow position={[0.35, 1.1, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* BRAS DROIT */}
        <mesh castShadow position={[0.45, 0.7, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>

        {/* AVANT-BRAS DROIT */}
        <mesh castShadow position={[0.55, 0.3, 0.2]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.5, 16]} />
          <meshStandardMaterial color="#f4c2a5" />
        </mesh>

        {/* MAIN DROITE */}
        <group ref={rightHandRef} position={[0.55, -0.1, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.05, 0.15]} />
            <meshStandardMaterial color="#f4c2a5" />
          </mesh>
        </group>

        {/* BASSIN */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.65, 0.3, 0.4]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* CUISSE GAUCHE */}
        <mesh castShadow position={[-0.2, -0.1, 0]} rotation={[1.5, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.11, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* JAMBE GAUCHE */}
        <mesh castShadow position={[-0.2, -0.5, -0.5]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* PIED GAUCHE */}
        <mesh castShadow position={[-0.2, -0.85, -0.35]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* CUISSE DROITE */}
        <mesh castShadow position={[0.2, -0.1, 0]} rotation={[1.5, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.11, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* JAMBE DROITE */}
        <mesh castShadow position={[0.2, -0.5, -0.5]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* PIED DROIT */}
        <mesh castShadow position={[0.2, -0.85, -0.35]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* ===== ORDINATEUR PORTABLE ===== */}
      <group position={[0, 0.55, 0.7]}>
        {/* Base du laptop */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.03, 0.6]} />
          <meshStandardMaterial
            color="#2c3e50"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Clavier */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.75, 0.01, 0.55]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>

        {/* Touches du clavier (simulation) */}
        {Array.from({ length: 20 }).map((_, i) => {
          const row = Math.floor(i / 5)
          const col = i % 5
          return (
            <mesh
              key={i}
              position={[-0.3 + col * 0.15, 0.025, -0.2 + row * 0.12]}
            >
              <boxGeometry args={[0.12, 0.01, 0.1]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
          )
        })}

        {/* Trackpad */}
        <mesh position={[0, 0.025, 0.25]}>
          <boxGeometry args={[0.3, 0.005, 0.2]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.5} />
        </mesh>

        {/* Écran */}
        <group position={[0, 0.35, -0.28]} rotation={[-0.2, 0, 0]}>
          {/* Cadre écran */}
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Écran actif (avec luminosité) */}
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.75, 0.45, 0.005]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.3}
              roughness={0.1}
            />
          </mesh>

          {/* Logo ou détails écran */}
          <mesh position={[0, -0.27, -0.012]}>
            <cylinderGeometry args={[0.02, 0.02, 0.001, 16]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ===== CHAISE (optionnel) ===== */}
      <group position={[0, -0.3, -0.3]}>
        {/* Assise */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.35, 0.1, 32]} />
          <meshStandardMaterial color="#3d3d3d" roughness={0.7} />
        </mesh>

        {/* Pied central */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

export default Character
