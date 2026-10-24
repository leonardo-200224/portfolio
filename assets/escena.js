// Escena 3D del hero: un chip sobre una placa de circuito, con pulsos de
// corriente que viajan por las pistas. Reacciona al puntero y al scroll.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const canvas = document.getElementById('escena');
const avisarLista = () => { window.__escenaLista = true; dispatchEvent(new Event('escena-lista')); };
const MENOS_MOVIMIENTO = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
}catch(e){
  // Sin WebGL la página sigue funcionando, solo sin la escena.
  canvas.remove();
  avisarLista();
  throw e;
}

const COLORES = {fondo: 0x06080D, azul: 0x4D7CFF, cian: 0x3FD0FF, senal: 0xF5C542, pista: 0x1A2A52, pistaViva: 0x2C4A9A};
const movil = () => innerWidth / innerHeight < 0.8;

// Calidad adaptable: los equipos modestos arrancan sin brillo y con menos resolución,
// y cualquier equipo que no sostenga ~35 cuadros por segundo baja la calidad solo.
const GAMA_BAJA = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || matchMedia('(pointer: coarse)').matches;
let usarBloom = !GAMA_BAJA;
let topeDpr = GAMA_BAJA ? 1 : 1.5;
const dpr = () => Math.min(devicePixelRatio, movil() ? Math.min(topeDpr, 1.25) : topeDpr);

renderer.setPixelRatio(dpr());
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const escena = new THREE.Scene();
escena.background = new THREE.Color(COLORES.fondo);
escena.fog = new THREE.Fog(COLORES.fondo, 14, 30);

const camara = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .1, 100);
const objetivo = new THREE.Vector3();

// ---------- luces ----------
escena.add(new THREE.AmbientLight(0x8aa0ff, .45));
const clave = new THREE.DirectionalLight(0xb8c8ff, 1.3);
clave.position.set(4, 9, 4);
escena.add(clave);
const luzChip = new THREE.PointLight(COLORES.cian, 8, 9, 1.6);
luzChip.position.set(0, 1.4, 0);
escena.add(luzChip);
const luzSenal = new THREE.PointLight(COLORES.senal, 1, 9, 1.8);
luzSenal.position.set(-3.5, 1.2, 3);
escena.add(luzSenal);

const placa = new THREE.Group();
escena.add(placa);

// Textura de brillo redondo para pulsos y partículas.
function texturaBrillo(){
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(.25, 'rgba(255,255,255,.8)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
}
const BRILLO = texturaBrillo();

// ---------- chip ----------
const LADO = 2.6, ALTO = .34, MITAD = LADO / 2;
const chip = new THREE.Group();
placa.add(chip);

const cuerpo = new THREE.Mesh(
  new THREE.BoxGeometry(LADO, ALTO, LADO),
  new THREE.MeshStandardMaterial({color: 0x0B1020, metalness: .75, roughness: .32})
);
cuerpo.position.y = ALTO / 2;
chip.add(cuerpo);

const dado = new THREE.Mesh(
  new THREE.BoxGeometry(LADO * .74, .05, LADO * .74),
  new THREE.MeshStandardMaterial({color: 0x121B30, metalness: .55, roughness: .38})
);
dado.position.y = ALTO + .025;
chip.add(dado);

// Marca grabada en el chip.
function texturaMarca(){
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.strokeStyle = 'rgba(120,150,255,.55)';
  g.lineWidth = 3;
  g.strokeRect(28, 28, 456, 456);
  g.fillStyle = '#A9BEFF';
  g.font = '900 230px Archivo, "Arial Narrow", Arial, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('LA', 256, 238);
  g.font = '600 34px Archivo, Arial, sans-serif';
  g.fillStyle = 'rgba(169,190,255,.6)';
  g.fillText('AUTOMATION · 2026', 256, 400);
  g.beginPath(); g.arc(70, 70, 12, 0, Math.PI * 2); g.fill();
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 4;
  return tx;
}
const marca = new THREE.Mesh(
  new THREE.PlaneGeometry(LADO * .7, LADO * .7),
  new THREE.MeshBasicMaterial({map: texturaMarca(), transparent: true, toneMapped: false, color: new THREE.Color(1.4, 1.4, 1.6)})
);
marca.rotation.x = -Math.PI / 2;
marca.position.y = ALTO + .052;
chip.add(marca);
document.fonts?.ready.then(() => { marca.material.map = texturaMarca(); marca.material.needsUpdate = true; });

// Borde encendido del chip (el bloom lo hace brillar).
const borde = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(LADO, ALTO, LADO)),
  new THREE.LineBasicMaterial({color: new THREE.Color(COLORES.azul).multiplyScalar(2.2), toneMapped: false, transparent: true})
);
borde.position.y = ALTO / 2;
chip.add(borde);

// Patas del chip.
const PATAS = 7;
const patas = new THREE.InstancedMesh(
  new THREE.BoxGeometry(.13, .07, .42),
  new THREE.MeshStandardMaterial({color: 0x8C97AE, metalness: .95, roughness: .25}),
  PATAS * 4
);
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eje = new THREE.Vector3(0, 1, 0);
const LADOS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
let k = 0;
LADOS.forEach(([dx, dz]) => {
  for(let i = 0; i < PATAS; i++){
    const off = ((i / (PATAS - 1)) - .5) * LADO * .78;
    const x = dx ? dx * (MITAD + .19) : off;
    const z = dz ? dz * (MITAD + .19) : off;
    q.setFromAxisAngle(eje, dx ? Math.PI / 2 : 0);
    m4.compose(new THREE.Vector3(x, .06, z), q, new THREE.Vector3(1, 1, 1));
    patas.setMatrixAt(k++, m4);
  }
});
chip.add(patas);

// Halo azul debajo del chip.
const halo = new THREE.Mesh(
  new THREE.PlaneGeometry(9, 9),
  new THREE.MeshBasicMaterial({map: BRILLO, color: COLORES.azul, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false})
);
halo.rotation.x = -Math.PI / 2;
halo.position.y = .01;
placa.add(halo);

// ---------- pistas del circuito ----------
const pistas = []; // {linea, pad, puntos, largo, pulso, vel, t}
const aleat = (a, b) => a + Math.random() * (b - a);

function crearPista(puntos2d, conPulso, colorPulso){
  const puntos = puntos2d.map(([x, z]) => new THREE.Vector3(x, .012, z));
  const geo = new THREE.BufferGeometry().setFromPoints(puntos);
  const mat = new THREE.LineBasicMaterial({color: conPulso ? COLORES.pistaViva : COLORES.pista, transparent: true, opacity: 0});
  const linea = new THREE.Line(geo, mat);
  placa.add(linea);

  const fin = puntos[puntos.length - 1];
  const pad = new THREE.Mesh(
    new THREE.RingGeometry(.05, .1, 20),
    new THREE.MeshBasicMaterial({color: COLORES.pistaViva, transparent: true, opacity: 0, toneMapped: false})
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(fin.x, .013, fin.z);
  placa.add(pad);

  let largo = 0;
  const tramos = [];
  for(let i = 1; i < puntos.length; i++){
    const l = puntos[i].distanceTo(puntos[i - 1]);
    tramos.push(l); largo += l;
  }

  const p = {linea, pad, puntos, tramos, largo, distancia: Math.hypot(fin.x, fin.z)};
  if(conPulso){
    const color = new THREE.Color(colorPulso).multiplyScalar(1.25);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: BRILLO, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false}));
    sprite.scale.setScalar(.2);
    const cola = new THREE.Sprite(sprite.material.clone());
    cola.material.opacity = .25;
    cola.scale.setScalar(.12);
    placa.add(sprite, cola);
    p.pulso = sprite; p.cola = cola;
    p.vel = aleat(2.2, 4.2);
    p.t = Math.random() * largo;
    p.espera = aleat(0, 1.5);
  }
  pistas.push(p);
}

// Escribe en "destino" el punto a distancia d sobre la pista (sin crear objetos en cada cuadro).
function puntoEn(p, d, destino){
  let resto = d;
  for(let i = 0; i < p.tramos.length; i++){
    if(resto <= p.tramos[i]) return destino.lerpVectors(p.puntos[i], p.puntos[i + 1], resto / p.tramos[i]);
    resto -= p.tramos[i];
  }
  return destino.copy(p.puntos[p.puntos.length - 1]);
}

// Pistas que salen de cada pata con quiebres a 45°, como en una placa real.
const PALETA = [COLORES.cian, COLORES.azul, COLORES.azul];
const escalaMovil = movil() ? .8 : 1;
LADOS.forEach(([dx, dz]) => {
  for(let i = 0; i < PATAS; i++){
    const off = ((i / (PATAS - 1)) - .5) * LADO * .78;
    const lateral = off === 0 ? (Math.random() < .5 ? -1 : 1) : Math.sign(off);
    const u0 = MITAD + .42;
    const pts = [[u0, off]];
    let u = u0 + aleat(.3, 1.8) * escalaMovil, v = off;
    pts.push([u, v]);
    const diag = aleat(.4, 1.6) * escalaMovil;
    u += diag; v += diag * lateral * (1 + i % 2 * .3);
    pts.push([u, v]);
    u += aleat(1, 4.2) * escalaMovil;
    pts.push([u, v]);
    if(Math.random() < .5){ const d2 = aleat(.3, 1); u += d2; v -= d2 * lateral; pts.push([u, v]); u += aleat(.5, 2); pts.push([u, v]); }
    // u es "hacia afuera" y v es "a lo largo del lado"; se pasan a x/z.
    const xz = pts.map(([uu, vv]) => dx ? [dx * uu, vv] : [vv, dz * uu]);
    crearPista(xz, Math.random() < .3, PALETA[Math.floor(Math.random() * PALETA.length)]);
  }
});

// Pistas sueltas en la placa, lejos del chip, para dar profundidad.
for(let i = 0; i < (GAMA_BAJA ? 12 : 22); i++){
  const ang = Math.random() * Math.PI * 2, r = aleat(4.5, 11);
  let x = Math.cos(ang) * r, z = Math.sin(ang) * r;
  const pts = [[x, z]];
  for(let s = 0; s < 3; s++){
    if(s % 2 === 0) x += aleat(-2.5, 2.5); else z += aleat(-2.5, 2.5);
    pts.push([x, z]);
  }
  crearPista(pts, Math.random() < .08, PALETA[Math.floor(Math.random() * PALETA.length)]);
}

// Puntos de la placa (rejilla de vías).
{
  const pos = [];
  for(let x = -14; x <= 14; x += .6) for(let z = -14; z <= 14; z += .6){
    if(Math.hypot(x, z) > 2.4 && Math.random() < .55) pos.push(x, 0, z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  placa.add(new THREE.Points(geo, new THREE.PointsMaterial({color: 0x18223A, size: .03, sizeAttenuation: true})));
}

// Partículas que flotan sobre la placa.
const PART = GAMA_BAJA ? 30 : movil() ? 45 : 70;
const partGeo = new THREE.BufferGeometry();
const partPos = new Float32Array(PART * 3), partVel = new Float32Array(PART);
for(let i = 0; i < PART; i++){
  partPos[i * 3] = aleat(-11, 11); partPos[i * 3 + 1] = aleat(0, 6); partPos[i * 3 + 2] = aleat(-11, 11);
  partVel[i] = aleat(.08, .35);
}
partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
const particulas = new THREE.Points(partGeo, new THREE.PointsMaterial({
  map: BRILLO, color: new THREE.Color(COLORES.cian), size: .06, transparent: true, opacity: .25,
  blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
}));
placa.add(particulas);

// ---------- posprocesado ----------
const compositor = new EffectComposer(renderer);
compositor.addPass(new RenderPass(escena, camara));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .32, .35, .55);
compositor.addPass(bloom);
compositor.addPass(new OutputPass());

function ajustar(){
  const w = innerWidth, h = innerHeight;
  renderer.setPixelRatio(dpr());
  renderer.setSize(w, h);
  compositor.setSize(w, h);
  bloom.setSize(w, h);
  camara.aspect = w / h;
  camara.fov = movil() ? 44 : 32;
  camara.updateProjectionMatrix();
}
addEventListener('resize', ajustar);
ajustar();

// ---------- interacción ----------
const raton = new THREE.Vector2(), ratonSuave = new THREE.Vector2();
addEventListener('pointermove', e => {
  raton.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
});
const rayo = new THREE.Raycaster();
let encima = 0;

// La intro arranca cuando la pantalla de carga se va.
let introInicio = null;
addEventListener('intro', () => { introInicio = performance.now(); }, {once: true});
const suave = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

// Promedia el tiempo por cuadro durante ~2 s; si va lento, quita el brillo y luego baja la resolución.
// Solo cuenta con la pestaña visible, para no castigar al equipo mientras está en segundo plano.
let muestras = 0, sumaDt = 0;
function vigilarRendimiento(dt){
  if(document.hidden || (!usarBloom && topeDpr <= 1)) return;
  sumaDt += dt; muestras++;
  if(muestras < 120) return;
  const fps = muestras / sumaDt;
  muestras = 0; sumaDt = 0;
  if(fps >= 35) return;
  if(usarBloom) usarBloom = false;
  else{ topeDpr = 1; ajustar(); }
}

let opacidadPrevia = '';
const reloj = new THREE.Clock();
let primerCuadro = true;

function cuadro(){
  requestAnimationFrame(cuadro);
  const dt = Math.min(reloj.getDelta(), .05);
  const t = reloj.elapsedTime;

  // Progreso del scroll en alturas de pantalla.
  const s = scrollY / innerHeight;
  const visible = 1 - THREE.MathUtils.smoothstep(s, .85, 1.7);
  // Solo se escribe la opacidad si cambió: escribir estilos en cada cuadro obliga al navegador a recalcular.
  const opacidad = visible.toFixed(2);
  if(opacidad !== opacidadPrevia){ canvas.style.opacity = opacidad; opacidadPrevia = opacidad; }
  if(visible <= 0 && !primerCuadro) return;

  const ip = introInicio === null ? 0 : (performance.now() - introInicio) / 2400;
  const ei = suave(ip);

  // Cámara: se acerca e inclina con el scroll.
  const esMovil = movil();
  ratonSuave.lerp(raton, .05);
  camara.position.set(ratonSuave.x * .8, (esMovil ? 13 : 9.2) - s * 3.2, (esMovil ? 14 : 12) - s * 3 + (1 - ei) * 6);
  // En escritorio el chip queda a la derecha, debajo de Volt; en celular, arriba al centro.
  objetivo.set(esMovil ? 0 : -3.4, esMovil ? -3.2 : 0, esMovil ? 0 : -2.2);
  camara.lookAt(objetivo);

  // La placa gira despacio y sigue al puntero.
  const giro = MENOS_MOVIMIENTO ? 0 : Math.sin(t * .18) * .35;
  placa.rotation.y = THREE.MathUtils.lerp(placa.rotation.y, giro + ratonSuave.x * .35 + (1 - ei) * -1.2 + s * .9, .08);
  placa.rotation.x = THREE.MathUtils.lerp(placa.rotation.x, -ratonSuave.y * .12, .08);
  placa.position.x = esMovil ? 0 : s * 2.4;
  chip.position.y = (1 - ei) * -1.5 + Math.sin(t * 1.4) * .05;

  // ¿El puntero está sobre el chip? Acelera la corriente.
  rayo.setFromCamera(raton, camara);
  const sobreChip = rayo.intersectObject(cuerpo, false).length > 0;
  encima = THREE.MathUtils.lerp(encima, sobreChip ? 1 : 0, .08);
  const factor = 1 + encima * 1.8;

  const latido = .5 + .5 * Math.sin(t * 2.2);
  luzChip.intensity = 2 + latido * .8 + encima * 5;
  halo.material.opacity = (.08 + latido * .05 + encima * .18) * ei;
  borde.material.color.setHex(COLORES.azul).multiplyScalar(1.8 + latido * .8 + encima * 1.5);

  pistas.forEach(p => {
    // Las pistas se encienden del centro hacia afuera durante la intro.
    const encendido = suave((ip * 14 - p.distancia) / 3);
    p.linea.material.opacity = encendido * (p.pulso ? .5 : .3);
    if(!p.pulso){ p.pad.material.opacity = encendido * .3; return; }

    if(p.espera > 0){ p.espera -= dt; p.pulso.visible = p.cola.visible = false; }
    else{
      p.t += p.vel * factor * dt;
      if(p.t > p.largo){ p.t = 0; p.espera = aleat(.2, 1.6); p.flash = 1; }
      p.pulso.visible = p.cola.visible = encendido > .5;
      puntoEn(p, p.t, p.pulso.position).setY(.06);
      puntoEn(p, Math.max(p.t - .28, 0), p.cola.position).setY(.06);
    }
    // El pad del extremo destella cuando llega un pulso.
    p.flash = Math.max((p.flash || 0) - dt * 1.6, 0);
    p.pad.material.color.setHex(COLORES.pistaViva).lerp(p.pulso.material.color, p.flash);
    p.pad.material.opacity = encendido * (.35 + p.flash * .6);
  });

  // Partículas suben y reaparecen abajo.
  for(let i = 0; i < PART; i++){
    partPos[i * 3 + 1] += partVel[i] * dt * (MENOS_MOVIMIENTO ? .3 : 1);
    if(partPos[i * 3 + 1] > 6) partPos[i * 3 + 1] = 0;
  }
  partGeo.attributes.position.needsUpdate = true;
  particulas.material.opacity = .25 * ei;

  if(usarBloom) compositor.render(); else renderer.render(escena, camara);
  vigilarRendimiento(dt);
  if(primerCuadro){ primerCuadro = false; avisarLista(); }
}
cuadro();
