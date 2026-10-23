import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = document.querySelector("#model-stage");
const canvas = document.querySelector("#product-canvas");
const status = document.querySelector("#model-status");
const colorSets = {
  graphite: { shell: "#343c3b", accent: "#aeb89d", cushion: "#171b1b" },
  sand: { shell: "#c8b598", accent: "#e6d9bf", cushion: "#786e60" },
  moss: { shell: "#4d604f", accent: "#c3d394", cushion: "#222e26" }
};

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
} catch {
  status.textContent = "3D is unavailable in this browser; the product preview is still visible.";
}

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.16, 5.05);

  scene.add(new THREE.HemisphereLight(0xf4efdf, 0x28332d, 2.1));
  const keyLight = new THREE.DirectionalLight(0xfff1d8, 3.2);
  keyLight.position.set(-3.4, 4.2, 4.4);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xd0e5cb, 1.8);
  fillLight.position.set(4, 1.4, 3.2);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0x8ea38b, 2.4);
  rimLight.position.set(1.8, 2.8, -3.5);
  scene.add(rimLight);

  const materialSets = { shell: [], accent: [], cushion: [] };
  const shellMaterial = new THREE.MeshPhysicalMaterial({ color: colorSets.graphite.shell, metalness: 0.32, roughness: 0.31, clearcoat: 0.48, clearcoatRoughness: 0.3 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: colorSets.graphite.accent, metalness: 0.66, roughness: 0.27 });
  const cushionMaterial = new THREE.MeshStandardMaterial({ color: colorSets.graphite.cushion, metalness: 0.02, roughness: 0.83 });
  const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x202624, metalness: 0.12, roughness: 0.58 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xd5d9ce, metalness: 0.84, roughness: 0.2 });
  const headphones = new THREE.Group();
  headphones.rotation.set(-0.08, -0.24, -0.06);
  scene.add(headphones);

  function mesh(geometry, material, position, rotation, collection) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    if (rotation) object.rotation.set(...rotation);
    object.castShadow = true;
    object.receiveShadow = true;
    headphones.add(object);
    if (collection) materialSets[collection].push(object);
    return object;
  }

  // The headphone body is assembled from reusable browser-side geometry.
  mesh(new THREE.TorusGeometry(0.79, 0.095, 24, 100, Math.PI), shellMaterial, [0, 0.36, 0], null, "shell");
  mesh(new THREE.TorusGeometry(0.68, 0.055, 18, 96, Math.PI), cushionMaterial, [0, 0.35, 0.025], null, "cushion");
  mesh(new THREE.TorusGeometry(0.79, 0.014, 10, 96, Math.PI), accentMaterial, [0, 0.36, 0.088], null, "accent");

  for (const side of [-1, 1]) {
    const x = side * 0.77;
    mesh(new THREE.BoxGeometry(0.085, 0.66, 0.095), shellMaterial, [x, -0.02, 0], [0, 0, side * -0.025], "shell");
    mesh(new THREE.BoxGeometry(0.11, 0.08, 0.13), accentMaterial, [x, -0.35, 0.015], null, "accent");
    mesh(new THREE.SphereGeometry(0.055, 24, 16), trimMaterial, [x, -0.4, 0.045], null, null);

    const cupPosition = [side * 0.79, -0.56, 0.06];
    mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.21, 64, 1), shellMaterial, cupPosition, [Math.PI / 2, 0, 0], "shell");
    mesh(new THREE.TorusGeometry(0.295, 0.045, 16, 64), accentMaterial, [cupPosition[0], cupPosition[1], 0.179], null, "accent");
    mesh(new THREE.CylinderGeometry(0.265, 0.265, 0.115, 56, 1), cushionMaterial, [cupPosition[0], cupPosition[1], 0.185], [Math.PI / 2, 0, 0], "cushion");
    mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.018, 56, 1), innerMaterial, [cupPosition[0], cupPosition[1], 0.248], [Math.PI / 2, 0, 0], null);
    mesh(new THREE.TorusGeometry(0.19, 0.012, 10, 48), trimMaterial, [cupPosition[0], cupPosition[1], 0.262], null, null);
    mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.01, 40, 1), accentMaterial, [cupPosition[0], cupPosition[1], 0.264], [Math.PI / 2, 0, 0], "accent");

    for (let dot = 0; dot < 6; dot += 1) {
      const angle = (dot / 6) * Math.PI * 2;
      mesh(new THREE.SphereGeometry(0.012, 8, 6), trimMaterial, [cupPosition[0] + Math.cos(angle) * 0.151, cupPosition[1] + Math.sin(angle) * 0.151, 0.272], null, null);
    }
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -0.04, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI * 0.36;
  controls.maxPolarAngle = Math.PI * 0.64;
  controls.rotateSpeed = 0.62;

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function setFinish(name) {
    const colors = colorSets[name] || colorSets.graphite;
    for (const object of materialSets.shell) object.material.color.set(colors.shell);
    for (const object of materialSets.accent) object.material.color.set(colors.accent);
    for (const object of materialSets.cushion) object.material.color.set(colors.cushion);
  }

  window.addEventListener("aura:finish", (event) => setFinish(event.detail));
  window.addEventListener("aura:rotate", (event) => {
    controls.autoRotate = false;
    headphones.rotation.y += Number(event.detail) || 0.35;
  });
  canvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("aura:rotate", { detail: event.key === "ArrowLeft" ? -0.35 : 0.35 }));
    }
  });
  setFinish(document.documentElement.dataset.finish || "graphite");
  new ResizeObserver(resize).observe(stage);
  resize();
  stage.classList.add("is-three-ready");
  status.textContent = "3D active · drag the model to rotate";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.28;
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
