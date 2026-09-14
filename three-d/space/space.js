// space.js —— 星球宇宙（Three.js）
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 6, 13);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// 光源：太阳处放点点光 + 微弱环境光
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
scene.add(new THREE.PointLight(0xffffff, 1.4, 100));

// 星空：粒子点（与球体、圆环构成三类不同对象）
const starPos = new Float32Array(600 * 3);
for (let i = 0; i < 600; i++) {
  const r = 30 + Math.random() * 30;
  const t = Math.random() * Math.PI * 2;
  const p = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(p) * Math.cos(t);
  starPos[i * 3 + 1] = r * Math.cos(p);
  starPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 })));

// 太阳：自发光黄球（MeshBasicMaterial 不受光）
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc33 })
);
scene.add(sun);

// 地球：放在公转组里，转组即公转
const earthOrbit = new THREE.Group();
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x2196f3 })
);
earth.position.x = 4;
earthOrbit.add(earth);
scene.add(earthOrbit);

// 土星：球体 + 倾斜圆环（不同几何体）
const saturnOrbit = new THREE.Group();
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xe0c08a })
);
saturn.position.x = 7.5;
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.1, 0.07, 16, 64),
  new THREE.MeshStandardMaterial({ color: 0xc9a86a })
);
ring.rotation.x = Math.PI / 2.3;
saturn.add(ring);
saturnOrbit.add(saturn);
scene.add(saturnOrbit);

// 动画：自转 + 公转
const animate = () => {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.003;
  earth.rotation.y += 0.02;
  earthOrbit.rotation.y += 0.008;
  saturnOrbit.rotation.y += 0.004;
  controls.update();
  renderer.render(scene, camera);
};
animate();

// 窗口自适应
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
