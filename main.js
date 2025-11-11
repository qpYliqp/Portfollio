import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/shaders/RGBShiftShader.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;

gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('three-container');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04050c);
scene.fog = new THREE.FogExp2(0x0a1126, 0.06);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 60);
const cameraState = { x: -5.4, y: 2.9, z: 7.4 };
const cameraTarget = { x: 0.2, y: 2.1, z: 0 };
camera.position.set(cameraState.x, cameraState.y, cameraState.z);

const ambient = new THREE.HemisphereLight(0x6ad3ff, 0x101215, 0.65);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xaad4ff, 1.3);
keyLight.position.set(3, 6, 4);
keyLight.castShadow = true;
keyLight.shadow.bias = -0.0006;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x8c74ff, 0.6);
rimLight.position.set(-4, 5, -6);
scene.add(rimLight);

function createPixelTexture(colors, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const step = size / colors.length;
  colors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * step, size, step);
  });
  const noiseDensity = size * size * 0.08;
  for (let i = 0; i < noiseDensity; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const shade = Math.random() > 0.5 ? 255 : 180;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.1)`;
    ctx.fillRect(x, y, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

const floorTexture = createPixelTexture(['#090d1c', '#0b1327', '#101a34', '#0b1327']);
floorTexture.repeat.set(12, 12);
const floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
  color: 0xffffff,
  emissive: 0x09122a,
  emissiveIntensity: 0.1,
  flatShading: true,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

function createChair() {
  const chair = new THREE.Group();
  const baseMat = new THREE.MeshLambertMaterial({ color: 0x151b2e, flatShading: true });
  const cushionMat = new THREE.MeshLambertMaterial({ color: 0x283b63, flatShading: true });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.4), cushionMat);
  seat.position.y = 0.8;
  seat.castShadow = true;
  chair.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.25), cushionMat);
  back.position.set(0, 1.6, -0.55);
  back.castShadow = true;
  chair.add(back);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 6);
  const legPositions = [
    [-0.6, 0.4, -0.6],
    [0.6, 0.4, -0.6],
    [-0.6, 0.4, 0.6],
    [0.6, 0.4, 0.6],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, baseMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    chair.add(leg);
  });

  return chair;
}

function createComputer(screenTexture) {
  const computer = new THREE.Group();
  const plasticMat = new THREE.MeshLambertMaterial({ color: 0x1f2c44, flatShading: true });
  const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.15), plasticMat);
  screenFrame.position.set(0, 2.1, -0.4);
  screenFrame.castShadow = true;
  computer.add(screenFrame);

  const screenGeo = new THREE.PlaneGeometry(2.1, 1.3, 2, 2);
  const screenMaterial = new THREE.MeshLambertMaterial({
    map: screenTexture,
    emissive: 0x1c5ca1,
    emissiveIntensity: 0.25,
    toneMapped: true,
    flatShading: true,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
  screenMesh.position.set(0, 2.1, -0.32);
  screenMesh.castShadow = false;
  computer.add(screenMesh);

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 1.2, 8), plasticMat);
  stand.position.set(0, 1.3, -0.4);
  stand.castShadow = true;
  computer.add(stand);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 0.25, 10), plasticMat);
  base.position.set(0, 0.6, -0.4);
  base.castShadow = true;
  computer.add(base);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.8), plasticMat.clone());
  keyboard.material.color.set(0x202c3f);
  keyboard.position.set(0.1, 0.85, 0.1);
  keyboard.castShadow = true;
  computer.add(keyboard);

  const keyRows = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.05, 0.6), plasticMat.clone());
  keyRows.material.color.set(0x2b3f5e);
  keyRows.position.set(0.1, 0.92, 0.12);
  computer.add(keyRows);

  return { computer, screenMesh, screenMaterial };
}

function createDesk() {
  const desk = new THREE.Group();
  const deskTexture = createPixelTexture(['#1e2a42', '#1a2438', '#253559']);
  deskTexture.repeat.set(2, 2);
  const deskMat = new THREE.MeshLambertMaterial({
    map: deskTexture,
    color: 0xffffff,
    flatShading: true,
    emissive: 0x0c1020,
    emissiveIntensity: 0.1,
  });
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 2.8), deskMat);
  top.position.set(0, 1.1, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  desk.add(top);

  const supportGeo = new THREE.BoxGeometry(0.35, 1.8, 2.6);
  const supportOffsets = [-2.2, 2.2];
  supportOffsets.forEach((x) => {
    const support = new THREE.Mesh(supportGeo, deskMat.clone());
    support.position.set(x, 0.4, 0);
    support.castShadow = true;
    support.receiveShadow = true;
    desk.add(support);
  });

  return desk;
}

function createCharacter() {
  const group = new THREE.Group();
  const shirtTexture = createPixelTexture(['#1d2a44', '#22345b', '#1d2a44']);
  shirtTexture.repeat.set(1, 1);
  const pantsTexture = createPixelTexture(['#111829', '#0d1422', '#111829']);
  pantsTexture.repeat.set(1, 1);
  const skinTexture = createPixelTexture(['#f0cbb5', '#e4bba3']);

  const shirtMat = new THREE.MeshLambertMaterial({ map: shirtTexture, flatShading: true });
  const pantsMat = new THREE.MeshLambertMaterial({ map: pantsTexture, flatShading: true });
  const skinMat = new THREE.MeshLambertMaterial({ map: skinTexture, flatShading: true });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.9), shirtMat);
  torso.position.set(0, 1.7, 0);
  torso.castShadow = true;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.1, 0.9), skinMat);
  head.position.set(0, 2.9, 0);
  head.castShadow = true;
  group.add(head);

  const eyeGeo = new THREE.BoxGeometry(0.12, 0.16, 0.01);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0b1228 });
  const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
  eyeLeft.position.set(-0.18, 3.0, 0.47);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = 0.18;
  group.add(eyeLeft, eyeRight);

  const hair = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.0), new THREE.MeshLambertMaterial({ color: 0x2b2030, flatShading: true }));
  hair.position.set(0, 3.35, -0.1);
  hair.castShadow = true;
  group.add(hair);

  const legGeo = new THREE.BoxGeometry(0.65, 1.4, 0.65);
  const legLeft = new THREE.Mesh(legGeo, pantsMat);
  legLeft.position.set(-0.35, 0.7, 0);
  const legRight = legLeft.clone();
  legRight.position.x = 0.35;
  legLeft.castShadow = legRight.castShadow = true;
  group.add(legLeft, legRight);

  const shoeMat = new THREE.MeshLambertMaterial({ color: 0x141926, flatShading: true });
  const shoeGeo = new THREE.BoxGeometry(0.7, 0.3, 1.0);
  const shoeLeft = new THREE.Mesh(shoeGeo, shoeMat);
  shoeLeft.position.set(-0.35, 0.15, 0.15);
  const shoeRight = shoeLeft.clone();
  shoeRight.position.x = 0.35;
  group.add(shoeLeft, shoeRight);

  const upperArmGeo = new THREE.BoxGeometry(0.4, 0.9, 0.4);
  const foreArmGeo = new THREE.BoxGeometry(0.32, 0.8, 0.32);
  const handGeo = new THREE.BoxGeometry(0.32, 0.22, 0.5);

  const leftUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
  leftUpperArm.position.set(-1, 2.3, 0.1);
  leftUpperArm.rotation.z = Math.PI / 5;
  const leftForearm = new THREE.Mesh(foreArmGeo, skinMat);
  leftForearm.position.set(-1.25, 1.7, 0.4);
  leftForearm.rotation.x = -Math.PI / 5;
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(-1.25, 1.3, 0.6);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
  rightUpperArm.position.set(1, 2.3, 0.1);
  rightUpperArm.rotation.z = -Math.PI / 5;
  const rightForearm = new THREE.Mesh(foreArmGeo, skinMat);
  rightForearm.position.set(1.25, 1.7, 0.3);
  rightForearm.rotation.x = -Math.PI / 5;
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(1.25, 1.35, 0.55);

  [leftUpperArm, leftForearm, leftHand, rightUpperArm, rightForearm, rightHand].forEach((part) => {
    part.castShadow = true;
    group.add(part);
  });

  const fingerGeo = new THREE.BoxGeometry(0.08, 0.08, 0.28);
  const fingers = [];
  [-0.05, 0.05].forEach((offset) => {
    const fingerLeft = new THREE.Mesh(fingerGeo, skinMat);
    fingerLeft.position.set(-1.25 + offset, 1.24, 0.75);
    fingerLeft.castShadow = true;
    group.add(fingerLeft);
    fingers.push(fingerLeft);

    const fingerRight = new THREE.Mesh(fingerGeo, skinMat);
    fingerRight.position.set(1.25 + offset, 1.28, 0.7);
    fingerRight.castShadow = true;
    group.add(fingerRight);
    fingers.push(fingerRight);
  });

  const glowPlaneGeo = new THREE.PlaneGeometry(2.6, 2.6);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x1a3d66,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowPlane = new THREE.Mesh(glowPlaneGeo, glowMat);
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.set(0, 0.02, -0.7);
  group.add(glowPlane);

  return { group, leftForearm, rightForearm, fingers };
}

const chair = createChair();
chair.position.set(0.2, 0, 0.2);
scene.add(chair);

const desk = createDesk();
desk.position.set(0, 0, -1.2);
scene.add(desk);

const screenCanvas = document.createElement('canvas');
screenCanvas.width = 256;
screenCanvas.height = 256;
const screenCtx = screenCanvas.getContext('2d');

function drawScreenText(text, intensity = 0.3) {
  screenCtx.fillStyle = '#060c1c';
  screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
  screenCtx.fillStyle = `rgba(38, 124, 226, ${0.5 + intensity * 0.5})`;
  screenCtx.fillRect(24, 24, screenCanvas.width - 48, screenCanvas.height - 48);
  screenCtx.fillStyle = '#071026';
  screenCtx.fillRect(36, 36, screenCanvas.width - 72, screenCanvas.height - 72);
  screenCtx.font = 'bold 34px "Press Start 2P", monospace';
  screenCtx.fillStyle = '#7ee8ff';
  screenCtx.textAlign = 'center';
  screenCtx.textBaseline = 'middle';
  screenCtx.fillText(text, screenCanvas.width / 2, screenCanvas.height / 2);
  for (let y = 0; y < screenCanvas.height; y += 6) {
    screenCtx.fillStyle = 'rgba(12, 44, 86, 0.2)';
    screenCtx.fillRect(36, y, screenCanvas.width - 72, 2);
  }
}

drawScreenText('HELLO', 0.2);
const screenTexture = new THREE.CanvasTexture(screenCanvas);
screenTexture.magFilter = THREE.NearestFilter;
screenTexture.minFilter = THREE.NearestFilter;

const { computer, screenMesh, screenMaterial } = createComputer(screenTexture);
computer.position.set(-0.6, 0, -0.4);
scene.add(computer);

const character = createCharacter();
character.group.position.set(0.5, 0, 0.4);
scene.add(character.group);

const deskLamp = new THREE.SpotLight(0x5f9dff, 1.2, 12, Math.PI / 4, 0.4, 1.2);
deskLamp.position.set(-1.2, 3.4, 1.2);
deskLamp.castShadow = true;
const lampTarget = new THREE.Object3D();
lampTarget.position.set(-0.4, 2.1, -0.6);
scene.add(lampTarget);
deskLamp.target = lampTarget;
scene.add(deskLamp);

const particlesGeo = new THREE.BufferGeometry();
const particleCount = 450;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const idx = i * 3;
  positions[idx] = (Math.random() - 0.5) * 12;
  positions[idx + 1] = Math.random() * 5 + 1;
  positions[idx + 2] = (Math.random() - 0.5) * 12;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial({
  color: 0x7ac9ff,
  size: 0.08,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.6, 0.4);
composer.addPass(bloomPass);

const filmPass = new FilmPass(0.45, 0.3, 648, false);
composer.addPass(filmPass);

const aberrationPass = new ShaderPass(RGBShiftShader);
aberrationPass.uniforms['amount'].value = 0.0025;
composer.addPass(aberrationPass);

const dustPlanes = [];
for (let i = 0; i < 6; i++) {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({
      color: 0x0f1a33,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  plane.position.set((Math.random() - 0.5) * 6, 1.6 + Math.random() * 2, -1.8 + Math.random() * 1.4);
  plane.rotation.z = Math.random() * Math.PI;
  scene.add(plane);
  dustPlanes.push(plane);
}

const tempVec = new THREE.Vector3();

function updateCamera() {
  camera.position.set(cameraState.x, cameraState.y, cameraState.z);
  tempVec.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
  camera.lookAt(tempVec);
}

const projectOverlay = document.getElementById('project-overlay');

const typingWords = ['Java', 'Angular', 'Docker'];

function cycleTypingWord(word) {
  drawScreenText(word, 0.6);
  screenTexture.needsUpdate = true;
  screenMaterial.needsUpdate = true;
}

function setupScrollAnimations() {
  const lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 1.6),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  ScrollTrigger.addEventListener('refresh', () => lenis.update());
  ScrollTrigger.refresh();

  const timeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  });

  timeline.to(cameraState, { x: -1.2, y: 2.9, z: 5.4, duration: 1.4 }, 0);
  timeline.to(cameraTarget, { x: -0.2, y: 2.1, z: -0.2, duration: 1.4 }, 0);

  timeline.to(cameraState, { x: 1.9, y: 2.7, z: 2.4, duration: 1.6 }, 1.05);
  timeline.to(cameraTarget, { x: -0.6, y: 1.95, z: -1.8, duration: 1.6 }, 1.05);
  timeline.to(screenMaterial, { emissiveIntensity: 1.2, duration: 1.6 }, 1.05);
  timeline.call(() => cycleTypingWord(typingWords[0]), null, 1.05);
  timeline.call(() => cycleTypingWord(typingWords[1]), null, 1.45);
  timeline.call(() => cycleTypingWord(typingWords[2]), null, 1.85);

  timeline.to(cameraState, { x: 0.08, y: 2.4, z: 0.48, duration: 1.6 }, 2.7);
  timeline.to(cameraTarget, { x: -0.05, y: 2.15, z: -2.8, duration: 1.6 }, 2.7);
  timeline.to(screenMaterial, { emissiveIntensity: 0.9, duration: 1.6 }, 2.7);

  timeline.to(projectOverlay, {
    autoAlpha: 1,
    duration: 0.8,
    ease: 'power1.out',
    onStart: () => {
      projectOverlay.style.pointerEvents = 'auto';
    },
  }, 3.1);
}

function setupMobileLoop() {
  projectOverlay.style.opacity = 0;
  projectOverlay.style.pointerEvents = 'none';

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  tl.to(cameraState, { x: -1.2, y: 2.7, z: 5.6, duration: 1.6 }, 0);
  tl.to(cameraTarget, { x: -0.15, y: 2.1, z: -0.4, duration: 1.6 }, 0);
  tl.to(cameraState, { x: 1.8, y: 2.6, z: 2.5, duration: 1.6 }, '+=1.2');
  tl.to(cameraTarget, { x: -0.6, y: 2.0, z: -1.8, duration: 1.6 }, '-=1.6');
  tl.to(screenMaterial, { emissiveIntensity: 1.15, duration: 1.4 }, '<');
  tl.call(() => cycleTypingWord('Java'));
  tl.call(() => cycleTypingWord('Angular'), null, '+=0.6');
  tl.call(() => cycleTypingWord('Docker'), null, '+=0.6');
  tl.to(cameraState, { x: 0.12, y: 2.35, z: 0.52, duration: 1.6 }, '+=1');
  tl.to(cameraTarget, { x: 0, y: 2.1, z: -2.6, duration: 1.6 }, '-=1.6');
  tl.to(screenMaterial, { emissiveIntensity: 0.92, duration: 1.2 }, '<');
  tl.to(projectOverlay, {
    autoAlpha: 1,
    duration: 1,
    onStart: () => (projectOverlay.style.pointerEvents = 'auto'),
  }, '>-0.4');
}

const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) {
  setupMobileLoop();
} else {
  setupScrollAnimations();
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  updateCamera();

  const typingSpeed = 6;
  const leftForearm = character.leftForearm;
  const rightForearm = character.rightForearm;
  const fingers = character.fingers;
  if (leftForearm && rightForearm) {
    leftForearm.rotation.x = -Math.PI / 5 + Math.sin(elapsed * typingSpeed) * 0.08;
    rightForearm.rotation.x = -Math.PI / 5 + Math.cos(elapsed * typingSpeed * 0.9) * 0.08;
  }
  fingers.forEach((finger, idx) => {
    finger.position.y = 1.24 + Math.sin(elapsed * typingSpeed + idx) * 0.03;
  });

  particles.rotation.y += 0.0008;
  dustPlanes.forEach((plane, idx) => {
    plane.material.opacity = 0.18 + Math.sin(elapsed * 0.4 + idx) * 0.05;
  });

  screenMaterial.emissiveIntensity += Math.sin(elapsed * 5) * 0.004;
  screenMaterial.emissiveIntensity = THREE.MathUtils.clamp(screenMaterial.emissiveIntensity, 0.2, 1.4);

  bloomPass.strength = 0.6 + Math.sin(elapsed * 0.6) * 0.08;
  aberrationPass.uniforms['amount'].value = 0.002 + Math.sin(elapsed * 0.2) * 0.0006;

  screenTexture.needsUpdate = true;
  composer.render();
}

animate();

window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloomPass.setSize(innerWidth, innerHeight);
});

// Hover parallax for cards
const cards = document.querySelectorAll('.project-card');
cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
    card.style.setProperty('--tiltX', `${y}`);
    card.style.setProperty('--tiltY', `${x}`);
    card.style.transform = `perspective(600px) rotateX(${y * 0.4}deg) rotateY(${x * -0.4}deg) translateY(-8px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});
