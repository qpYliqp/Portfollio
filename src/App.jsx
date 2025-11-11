import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./Experience.jsx";
import Overlay from "./Overlay.jsx";
import SceneText from "./SceneText.jsx";

gsap.registerPlugin(ScrollTrigger);

const screenWords = ["Java", "Angular", "Docker"];

export default function App() {
  const [screenWordIndex, setScreenWordIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [sceneStage, setSceneStage] = useState(0);
  const overlayRef = useRef(null);

  const sceneCopy = useMemo(
    () => [
      {
        subtitle: "Scène 1 — Présentation",
        caption: "Le personnage se concentre sur son ordinateur dans une brume bleutée.",
        showWord: false,
      },
      {
        subtitle: "Scène 2 — Atelier de code",
        caption: "La caméra contourne le bureau pour révéler l'écran et son flow de code rétro.",
        showWord: true,
      },
      {
        subtitle: "Scène 3 — Interface portfolio",
        caption: "Entrez dans l'écran et explorez trois projets emblématiques.",
        showWord: true,
      },
    ],
    []
  );
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });

    const updateScroll = () => ScrollTrigger.update();
    lenis.on("scroll", updateScroll);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        let scrollValue = window.scrollY;
        if (typeof lenis.scroll === "number") {
          scrollValue = lenis.scroll;
        } else if (lenis.scroll && typeof lenis.scroll.value === "number") {
          scrollValue = lenis.scroll.value;
        }
        return scrollValue;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
      fixedMarkers: true,
    });

    ScrollTrigger.defaults({ scroller: document.body });

    const gsapRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapRaf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", updateScroll);
      gsap.ticker.remove(gsapRaf);
      lenis.destroy();
      ScrollTrigger.defaults({ scroller: window });
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
              onSceneStageChange={(stage) => setSceneStage(stage)}
            />
          </Suspense>
        </Canvas>
        <div className="grain-overlay" aria-hidden="true"></div>
        <div className="vignette" aria-hidden="true"></div>
        <Overlay ref={overlayRef} activeWord={screenWords[screenWordIndex]} />
        <SceneText
          activeWord={screenWords[sceneStage === 0 ? 0 : screenWordIndex]}
          sceneInfo={sceneCopy[sceneStage]}
        />
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
