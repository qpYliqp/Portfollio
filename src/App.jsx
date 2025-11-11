import React, { Suspense, useEffect, useRef, useState } from "https://esm.sh/react@18.2.0";
import { Canvas } from "https://esm.sh/@react-three/fiber@8.15.16?deps=three@0.156.1&bundle";
import Lenis from "https://esm.sh/@studio-freight/lenis@1.0.26?bundle";
import gsap from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";
import Experience from "./Experience.jsx";
import Overlay from "./Overlay.jsx";
import SceneText from "./SceneText.jsx";

gsap.registerPlugin(ScrollTrigger);

const screenWords = ["Java", "Angular", "Docker"];

export default function App() {
  const [screenWordIndex, setScreenWordIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });

    const updateScroll = () => ScrollTrigger.update();
    lenis.on("scroll", updateScroll);

    const gsapRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScroll);
      gsap.ticker.remove(gsapRaf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, {
      opacity: overlayVisible ? 1 : 0,
      pointerEvents: overlayVisible ? "auto" : "none",
      duration: 0.8,
      ease: "power2.out",
    });
  }, [overlayVisible]);

  return (
    <div className="app-shell">
      <div className="canvas-wrapper" id="canvas-wrapper">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [6, 3, 8], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: false }}
        >
          <color attach="background" args={["#0a0f24"]} />
          <fog attach="fog" args={["#0a0f24", 10, 40]} />
          <Suspense fallback={null}>
            <Experience
              onScreenWordChange={(index) => setScreenWordIndex(index)}
              onOverlayToggle={(state) => setOverlayVisible(state)}
            />
          </Suspense>
        </Canvas>
        <div className="grain-overlay" aria-hidden="true"></div>
        <div className="vignette" aria-hidden="true"></div>
        <Overlay ref={overlayRef} activeWord={screenWords[screenWordIndex]} />
        <SceneText activeWord={screenWords[screenWordIndex]} />
      </div>
      <main id="scroll-wrapper" className="scroll-wrapper">
        <section className="panel intro">
          <h1 className="intro-name">YLIANE VILLOT</h1>
          <p>
            Développeur fullstack passionné par les expériences numériques immersives. Utilisez la
            molette pour découvrir mon univers.
          </p>
        </section>
        <section className="panel code">
          <h2>Compétences principales</h2>
          <p>
            Java, Angular, Docker – un trio qui me permet de concevoir des applications robustes et
            scalables.
          </p>
        </section>
        <section className="panel projects">
          <h2>Projets sélectionnés</h2>
          <p>
            Faites défiler pour entrer dans l&apos;interface et explorer trois projets phares.
          </p>
        </section>
      </main>
    </div>
  );
}
