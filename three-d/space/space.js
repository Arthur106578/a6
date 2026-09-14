// space.js —— 星球宇宙（Three.js）

// ===== 场景、相机、渲染器 =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 6, 13);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 鼠标拖拽环视、滚轮缩放
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// ===== 光源：太阳位置放点点光源 + 微弱环境光 =====
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const sunLight = new THREE.PointLight(0xffffff, 1.4, 100);
scene.add(sunLight);

// ===== 星空：Points 粒子构成第三类对象 =====
const starCount = 800;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  // 均匀撒在半径 30~60 的球壳内
  const r = 30 + Math.random() * 30;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.cos(phi);
  starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18 })));

// ===== 太阳：球体 + 自发光材质（MeshBasicMaterial 不受光，看起来自己发光） =====
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc33 })
);
scene.add(sun);

// ===== 地球：公转组内放地球，地球上挂月球公转组 =====
const earthOrbit = new THREE.Group();
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x2196f3 })
);
earth.position.x = 4;
earthOrbit.add(earth);

const moonOrbit = new THREE.Group();
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.13, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
moon.position.x = 0.9;
moonOrbit.add(moon);
earth.add(moonOrbit);
scene.add(earthOrbit);

// ===== 土星：球体 + 圆环（TorusGeometry 环带，与球体不同的几何体） =====
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
ring.rotation.x = Math.PI / 2.3;   // 把立着的环扳平并倾斜一点
saturn.add(ring);
saturnOrbit.add(saturn);
scene.add(saturnOrbit);

// ===== 动画循环：太阳自转、行星公转 + 自转、月球绕地 =====
const animate = () => {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.003;
  earth.rotation.y += 0.02;
  earthOrbit.rotation.y += 0.008;
  moonOrbit.rotation.y += 0.03;
  saturn.rotation.y += 0.01;
  saturnOrbit.rotation.y += 0.004;
  controls.update();
  renderer.render(scene, camera);
};
animate();

// ===== 窗口自适应 =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
