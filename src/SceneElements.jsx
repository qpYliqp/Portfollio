import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function usePixelTexture(baseColor = "#9ab0ff") {
  return useMemo(() => {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, "#314075");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipMapNearestFilter;
    texture.anisotropy = 2;
    texture.repeat.set(2, 2);
    return texture;
  }, [baseColor]);
}

function Character() {
  const bodyTex = usePixelTexture("#9fb3ff");
  const pantsTex = usePixelTexture("#30385a");
  const faceTex = usePixelTexture("#f6c9a2");
  const handsRef = useRef();
  const headRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (handsRef.current) {
      handsRef.current.rotation.z = Math.sin(t * 2) * 0.08;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group position={[0, 1, 0]} rotation={[0, Math.PI / 8, 0]}>
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.4, 6]} />
        <meshLambertMaterial map={pantsTex} color="#5f6689" />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.7]} />
        <meshLambertMaterial map={bodyTex} color="#8fa0e8" />
      </mesh>
      <group ref={handsRef}>
        <mesh position={[0.6, -0.8, 0.4]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.18, 0.6, 5]} />
          <meshLambertMaterial map={faceTex} color="#f3b88c" />
        </mesh>
        <mesh position={[-0.6, -0.8, 0.4]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.18, 0.6, 5]} />
          <meshLambertMaterial map={faceTex} color="#f3b88c" />
        </mesh>
      </group>
      <mesh position={[0, 0.65, 0]} ref={headRef}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshLambertMaterial map={faceTex} color="#f9c8a2" />
      </mesh>
      <mesh position={[0, -1.25, 0.2]}>
        <boxGeometry args={[0.5, 0.25, 1.2]} />
        <meshLambertMaterial map={pantsTex} color="#252d4b" />
      </mesh>
    </group>
  );
}

function Desk({ screenMaterialRef, screenLightRef }) {
  const deskTex = usePixelTexture("#394063");
  const screenTex = usePixelTexture("#1d2240");

  return (
    <group>
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshLambertMaterial map={deskTex} color="#2a314f" />
      </mesh>
      <mesh position={[0.7, 0.5, 0]}>
        <boxGeometry args={[0.25, 0.9, 0.6]} />
        <meshLambertMaterial map={deskTex} color="#3a4162" />
      </mesh>
      <mesh position={[0.7, 1.05, -0.05]}>
        <boxGeometry args={[0.05, 0.6, 0.2]} />
        <meshLambertMaterial color="#1e243f" />
      </mesh>
      <mesh position={[0.7, 1.25, -0.05]}>
        <planeGeometry args={[0.7, 0.45]} />
        <meshLambertMaterial
          ref={screenMaterialRef}
          color="#1b2447"
          emissive="#8fb6ff"
          emissiveIntensity={0.6}
          map={screenTex}
        />
      </mesh>
      <mesh position={[0.2, 0.65, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshLambertMaterial color="#3f4a6f" />
      </mesh>
      <mesh position={[0.2, 0.65, 0.35]}>
        <boxGeometry args={[0.5, 0.04, 0.25]} />
        <meshLambertMaterial color="#1c223e" />
      </mesh>
      <mesh position={[0.2, 0.62, 0.15]}>
        <boxGeometry args={[0.6, 0.04, 0.18]} />
        <meshLambertMaterial color="#1c223e" />
      </mesh>
      <pointLight
        ref={screenLightRef}
        position={[0.7, 1.25, -0.1]}
        intensity={1.2}
        distance={4}
        color="#9ec5ff"
      />
    </group>
  );
}

function Environment() {
  const floorTex = usePixelTexture("#1e223d");

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
        <planeGeometry args={[30, 30, 1, 1]} />
        <meshLambertMaterial map={floorTex} color="#11152a" />
      </mesh>
      <mesh position={[-3.5, 1.5, -3]}>
        <boxGeometry args={[0.1, 3, 6]} />
        <meshLambertMaterial color="#161b32" />
      </mesh>
      <mesh position={[4, 1.5, -3]}>
        <boxGeometry args={[0.1, 3, 6]} />
        <meshLambertMaterial color="#161b32" />
      </mesh>
      <mesh position={[0, 3, -5]}>
        <planeGeometry args={[12, 5]} />
        <meshLambertMaterial color="#0d1326" />
      </mesh>
    </group>
  );
}

export default function SceneElements({ screenMaterialRef, screenLightRef }) {
  return (
    <group>
      <Environment />
      <Character />
      <Desk screenMaterialRef={screenMaterialRef} screenLightRef={screenLightRef} />
      <mesh position={[-1.5, 0.6, -0.8]} rotation={[0, Math.PI / 5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color="#242a48" />
      </mesh>
      <mesh position={[-1.6, 0.2, -0.9]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshLambertMaterial color="#1b2039" />
      </mesh>
    </group>
  );
}
