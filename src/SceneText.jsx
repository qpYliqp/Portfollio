import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SceneText({ activeWord, sceneInfo }) {
  const wordRef = useRef(null);
  const [typedWord, setTypedWord] = useState(activeWord);

  useEffect(() => {
    if (!sceneInfo?.showWord) {
      setTypedWord("");
      return undefined;
    }

    let frame = 0;
    setTypedWord("");
    const letters = activeWord.split("");
    const interval = setInterval(() => {
      frame += 1;
      setTypedWord(letters.slice(0, frame).join(""));
      if (frame >= letters.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [activeWord, sceneInfo]);

  useEffect(() => {
    if (!wordRef.current) return;
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [activeWord, sceneInfo]);

  return (
    <div className="scene-text">
      <h1 className="retro-title">YLIANE VILLOT</h1>
      <p className="retro-caption">Développeur narratif en quête d&apos;expériences mémorables.</p>
      {sceneInfo?.subtitle && <p className="retro-stage">{sceneInfo.subtitle}</p>}
      {sceneInfo?.caption && <p className="retro-stage retro-stage-detail">{sceneInfo.caption}</p>}
      {sceneInfo?.showWord && (
        <div className="screen-readout" ref={wordRef}>
          {typedWord}
        </div>
      )}
    </div>
  );
}
