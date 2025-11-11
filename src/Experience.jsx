import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";

import SceneElements from "./SceneElements.jsx";

const targetProxy = { x: 0, y: 1.4, z: 0 };

export default function Experience({ onScreenWordChange, onOverlayToggle, onSceneStageChange }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const screenMaterialRef = useRef();
  const screenLightRef = useRef();
  const neonRef = useRef();
  const stageRef = useRef(0);

  useFrame(() => {
    target.set(targetProxy.x, targetProxy.y, targetProxy.z);
    camera.lookAt(target);
  });

  useEffect(() => {
    camera.position.set(6, 3, 8);
    targetProxy.x = 0;
    targetProxy.y = 1.4;
    targetProxy.z = 0;
    onOverlayToggle(false);
    onScreenWordChange(0);
    onSceneStageChange(0);
    stageRef.current = 0;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 540px)", () => {
      onOverlayToggle(true);
    });

    mm.add("(min-width: 541px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#scroll-wrapper",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: "#canvas-wrapper",
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              let stage = 0;
              if (progress >= 0.25 && progress < 0.75) {
                stage = 1;
              } else if (progress >= 0.75) {
                stage = 2;
              }
              if (stageRef.current !== stage) {
                stageRef.current = stage;
                onSceneStageChange(stage);
              }
            },
          },
        });

        tl.to(camera.position, { x: 3, y: 2.5, z: 6, duration: 1, ease: "none" }, 0)
          .to(targetProxy, { x: 0.5, y: 1.4, z: 0, duration: 1, ease: "none" }, 0)
          .to(camera.position, { x: -2.5, y: 2.3, z: 4.2, duration: 1, ease: "none" }, 1)
          .to(targetProxy, { x: -0.5, y: 1.3, z: 0, duration: 1, ease: "none" }, 1)
          .call(() => onScreenWordChange(1), null, 1.1)
          .to(camera.position, { x: -0.2, y: 2, z: 1.3, duration: 1.2, ease: "none" }, 2.2)
          .to(targetProxy, { x: 0, y: 1.6, z: -1.5, duration: 1.2, ease: "none" }, 2.2)
          .to(screenMaterialRef.current, { emissiveIntensity: 2.5, duration: 1.2, ease: "none" }, 2)
          .to(screenLightRef.current, { intensity: 2.3, duration: 1.2, ease: "none" }, 2)
          .to(neonRef.current, { intensity: 1.5, duration: 1.2, ease: "none" }, 2)
          .call(() => onScreenWordChange(2), null, 2.4)
          .call(() => onOverlayToggle(true), null, 2.8);
      });

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
    };
  }, [camera, onOverlayToggle, onSceneStageChange, onScreenWordChange]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.8}
        color={new THREE.Color("#9eb8ff")}
        castShadow
      />
      <spotLight
        position={[-2, 5, 5]}
        angle={0.6}
        penumbra={0.4}
        intensity={1}
        color={new THREE.Color("#8fa2ff")}
      />
      <pointLight ref={neonRef} position={[0, 2.4, -1]} intensity={0.8} color="#7c8bff" />
      <SceneElements screenMaterialRef={screenMaterialRef} screenLightRef={screenLightRef} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.4} />
        <ChromaticAberration offset={[0.0015, 0.001]} radialModulation strength={0.1} />
        <Noise premultiply opacity={0.2} />
        <Vignette eskil={false} offset={0.25} darkness={0.8} />
      </EffectComposer>
    </>
  );
}
