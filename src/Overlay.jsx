import React, { forwardRef } from "react";

const Overlay = forwardRef(function Overlay({ activeWord }, ref) {
  return (
    <div className="project-overlay" ref={ref}>
      <h2>Interface Portfolio</h2>
      <p className="screen-word">{activeWord}</p>
      <div className="projects-grid">
        <article className="project-card">
          <span className="emoji">🧱</span>
          <h3>Project 1</h3>
          <p>Simulation architecturale low-poly.</p>
        </article>
        <article className="project-card">
          <span className="emoji">⚙️</span>
          <h3>Project 2</h3>
          <p>Plateforme industrielle réactive.</p>
        </article>
        <article className="project-card">
          <span className="emoji">💡</span>
          <h3>Project 3</h3>
          <p>Prototype créatif expérimental.</p>
        </article>
      </div>
    </div>
  );
});

export default Overlay;
