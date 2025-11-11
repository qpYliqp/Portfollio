import React, { useEffect, useRef, useState } from "https://esm.sh/react@18.2.0";
import gsap from "https://esm.sh/gsap@3.12.5";

export default function SceneText({ activeWord }) {
  const wordRef = useRef(null);
  const [typedWord, setTypedWord] = useState(activeWord);

  useEffect(() => {
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
  }, [activeWord]);

  useEffect(() => {
    if (!wordRef.current) return;
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [activeWord]);

  return (
    <div className="scene-text">
      <h1 className="retro-title">YLIANE VILLOT</h1>
      <p className="retro-caption">Développeur narratif en quête d&apos;expériences mémorables.</p>
      <div className="screen-readout" ref={wordRef}>
        {typedWord}
      </div>
    </div>
  );
}
