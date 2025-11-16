import React from 'react'

/**
 * Composant Lights
 * Système d'éclairage à 3 points (Three-Point Lighting)
 * - Key Light: lumière principale
 * - Fill Light: lumière de remplissage (réduit les ombres)
 * - Rim/Back Light: lumière arrière (sépare le sujet du fond)
 */
function Lights() {
  return (
    <>
      {/* Lumière ambiante - illumination générale douce */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* KEY LIGHT - Lumière principale (avant-gauche, légèrement au-dessus) */}
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={15}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0001}
      />

      {/* FILL LIGHT - Lumière de remplissage (avant-droite, plus douce) */}
      <directionalLight
        position={[-2, 2, 4]}
        intensity={0.5}
        color="#a8c5ff" // Légèrement bleutée pour contraste
      />

      {/* RIM/BACK LIGHT - Lumière arrière (crée un contour lumineux) */}
      <pointLight
        position={[0, 3, -3]}
        intensity={0.8}
        color="#ffd4a3" // Légèrement chaude
        distance={10}
      />

      {/* Lumière d'accentuation sur l'écran du laptop (simulation) */}
      <pointLight
        position={[0, 1.2, 0.5]}
        intensity={0.4}
        color="#6366f1" // Bleu/violet pour effet écran
        distance={2}
      />
    </>
  )
}

export default Lights
