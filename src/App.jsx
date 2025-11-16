import React from 'react'
import Scene3D from './components/Scene3D'

function App() {
  return (
    <div className="app-container">
      {/* Section gauche - Contenu portfolio (texte, projets, etc.) */}
      <div className="content-section">
        <div className="content-wrapper">
          <h1>Bienvenue sur mon Portfolio</h1>
          <p className="intro">
            Développeur passionné par les technologies 3D et le web interactif.
          </p>

          <div className="skills">
            <h2>Compétences</h2>
            <ul>
              <li>React & Three.js</li>
              <li>Développement 3D</li>
              <li>Optimisation Web</li>
              <li>Design Interactif</li>
            </ul>
          </div>

          <div className="cta">
            <button className="btn-primary">Voir mes projets</button>
            <button className="btn-secondary">Me contacter</button>
          </div>
        </div>
      </div>

      {/* Section droite - Scène 3D (1/3 de l'écran) */}
      <div className="scene-section">
        <Scene3D />
      </div>
    </div>
  )
}

export default App
