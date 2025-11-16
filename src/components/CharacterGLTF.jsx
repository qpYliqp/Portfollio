import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'

/**
 * Composant CharacterGLTF
 * Version alternative utilisant un modèle GLTF réaliste
 *
 * INSTRUCTIONS D'UTILISATION :
 * 1. Téléchargez un modèle GLTF de personnage humanoïde
 * 2. Placez-le dans /public/models/character.glb
 * 3. Remplacez Character.jsx par ce composant dans Scene3D.jsx
 *
 * MODÈLES RECOMMANDÉS (gratuits) :
 * - Mixamo Characters: https://www.mixamo.com/
 *   • Créez un compte gratuit Adobe
 *   • Choisissez un personnage réaliste
 *   • Téléchargez avec l'animation "Typing"
 *   • Format: GLB, pose: T-pose
 *
 * - Sketchfab: https://sketchfab.com/
 *   • Recherchez "office worker" ou "business character"
 *   • Filtrez par: Licence "Download", format "GLTF"
 *   • Exemples:
 *     - "Office Worker" par Quaternius
 *     - "Stylized Character" par Kenney
 *
 * - Ready Player Me: https://readyplayer.me/
 *   • Créez votre avatar personnalisé gratuitement
 *   • Export en GLB
 *
 * STRUCTURE DU MODÈLE :
 * Le modèle doit contenir :
 * - Un rig (squelette) avec os pour les mains
 * - Idéalement une animation de typing/typing
 * - Échelle appropriée (environ 1 unité = 1 mètre)
 */
function CharacterGLTF() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/character.glb')
  const { actions, mixer } = useAnimations(animations, group)

  // Animation personnalisée de frappe si pas d'animation dans le modèle
  const leftHandRef = useRef()
  const rightHandRef = useRef()

  useEffect(() => {
    // Si le modèle contient une animation "Typing" ou similaire
    const typingAction = actions['Typing'] || actions['typing'] || actions['Type']

    if (typingAction) {
      typingAction.play()
    } else {
      console.log('Aucune animation de typing trouvée. Animation procédurale activée.')
    }

    // Trouver les os des mains pour animation procédurale
    scene.traverse((child) => {
      if (child.isBone) {
        if (child.name.toLowerCase().includes('lefthand') || child.name.toLowerCase().includes('hand.l')) {
          leftHandRef.current = child
        }
        if (child.name.toLowerCase().includes('righthand') || child.name.toLowerCase().includes('hand.r')) {
          rightHandRef.current = child
        }
      }
    })
  }, [actions, scene])

  // Animation procédurale si pas d'animation dans le modèle
  useFrame((state, delta) => {
    if (!actions['Typing'] && leftHandRef.current && rightHandRef.current) {
      const t = state.clock.elapsedTime * 0.8

      // Animation des mains
      leftHandRef.current.rotation.x = Math.sin(t * 4) * 0.15 + 0.2
      rightHandRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.15 + 0.2
    }
  })

  return (
    <group ref={group} position={[0.5, 0, 0]} dispose={null}>
      <primitive
        object={scene}
        scale={1}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Ordinateur portable (même que Character.jsx) */}
      <group position={[0, 0.55, 0.7]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.03, 0.6]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.3} metalness={0.7} />
        </mesh>

        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.75, 0.01, 0.55]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>

        {Array.from({ length: 20 }).map((_, i) => {
          const row = Math.floor(i / 5)
          const col = i % 5
          return (
            <mesh key={i} position={[-0.3 + col * 0.15, 0.025, -0.2 + row * 0.12]}>
              <boxGeometry args={[0.12, 0.01, 0.1]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
          )
        })}

        <mesh position={[0, 0.025, 0.25]}>
          <boxGeometry args={[0.3, 0.005, 0.2]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.5} />
        </mesh>

        <group position={[0, 0.35, -0.28]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
          </mesh>

          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.75, 0.45, 0.005]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.3}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// Préchargement du modèle
useGLTF.preload('/models/character.glb')

export default CharacterGLTF
