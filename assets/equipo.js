// EL EQUIPO DE VOLT: cinco ayudantes 3D que viven en el portafolio.
// Cada cierto tiempo aparece uno (o dos) y hace algo sobre la página: Tuerca aprieta
// tornillos, Brisa sopla el polvo, Foco pinta, Holo cuelga fotos y Chispa juega.
// Solo se dibujan mientras actúan: entre escena y escena no gastan nada.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const MOVIL = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
const esEN = () => document.documentElement.lang === 'en';
const L = (es, en) => esEN() ? en : es;
const chat = document.getElementById('chat');

const canvas = document.createElement('canvas');
canvas.id = 'equipo';
canvas.setAttribute('aria-hidden', 'true');
document.body.appendChild(canvas);

let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
}catch(e){
  canvas.remove();
  throw e;
}
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// Cámara ortográfica en píxeles de pantalla: x a la derecha, y hacia abajo (negativa en el
// mundo). Así un ayudante se pone sobre una tarjeta con las mismas medidas del DOM.
const escena = new THREE.Scene();
const camara = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
camara.position.z = 1000;
function ajustar(){
  renderer.setPixelRatio(Math.min(devicePixelRatio, MOVIL ? 1.25 : 1.5));
  renderer.setSize(innerWidth, innerHeight);
  camara.right = innerWidth; camara.bottom = -innerHeight;
  camara.updateProjectionMatrix();
}
addEventListener('resize', ajustar);
ajustar();

escena.add(new THREE.HemisphereLight(0xdfe8ff, 0x0b1020, 1.1));
const clave = new THREE.DirectionalLight(0xffffff, 1.8);
clave.position.set(300, 500, 800);
escena.add(clave);
const contra = new THREE.DirectionalLight(0x3FD0FF, 2);
contra.position.set(-500, 200, -400);
escena.add(contra);

// ------------------------------------------------------------------ materiales
// Los mismos acabados de Volt, para que se vean del mismo mundo.
const brillo = c => new THREE.Color(c).multiplyScalar(1.6);
const blanco = new THREE.MeshPhysicalMaterial({color: 0xF1F4FA, roughness: .28, metalness: .05, clearcoat: 1, clearcoatRoughness: .12});
const oscuro = new THREE.MeshPhysicalMaterial({color: 0x0A0F1A, roughness: .18, metalness: .3, clearcoat: 1, clearcoatRoughness: .05});
const metal = new THREE.MeshStandardMaterial({color: 0x8E99B0, roughness: .3, metalness: .9});
const luzCian = new THREE.MeshBasicMaterial({color: brillo(0x3FD0FF), toneMapped: false});
const luzSenal = new THREE.MeshBasicMaterial({color: brillo(0xF5C542), toneMapped: false});
const amarillo = new THREE.MeshPhysicalMaterial({color: 0xF5C542, roughness: .35, clearcoat: .8});
const amarilloOscuro = new THREE.MeshStandardMaterial({color: 0xD9A21E, roughness: .45});
const chaleco = new THREE.MeshPhysicalMaterial({color: 0xFF7A1A, roughness: .5, clearcoat: .3});
const reflectivo = new THREE.MeshStandardMaterial({color: 0xE8EDF3, emissive: 0x6B7280, roughness: .2, metalness: .6});
const madera = new THREE.MeshStandardMaterial({color: 0x9A6634, roughness: .7});
const geoOjo = new THREE.CapsuleGeometry(.045, .07, 4, 10);

// ------------------------------------------------------------------ modelos
function brazoMini(lado, y, largo = .16){
  const hombro = new THREE.Group();
  hombro.position.set(lado * .34, y, 0);
  const tubo = new THREE.Mesh(new THREE.CapsuleGeometry(.05, largo, 4, 10), blanco);
  tubo.position.y = -largo * .8;
  const mano = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), oscuro);
  mano.position.y = -largo * 1.7;
  hombro.add(tubo, mano);
  hombro.rotation.z = lado * .2;
  return {hombro, mano};
}

// Tuerca: el ingeniero de mantenimiento, con casco, chaleco reflectivo y llave.
function crearTuerca(){
  const g = new THREE.Group();
  const torso = new THREE.Mesh(new RoundedBoxGeometry(.56, .42, .42, 4, .14), chaleco);
  torso.position.y = -.28;
  const franja = new THREE.Mesh(new THREE.BoxGeometry(.575, .045, .435), reflectivo);
  franja.position.y = -.23;
  const franja2 = franja.clone();
  franja2.position.y = -.36;
  const cabeza = new THREE.Group();
  cabeza.position.y = .2;
  const craneo = new THREE.Mesh(new RoundedBoxGeometry(.74, .58, .58, 5, .2), blanco);
  const visor = new THREE.Mesh(new RoundedBoxGeometry(.6, .4, .06, 4, .1), oscuro);
  visor.position.z = .28;
  const ojos = [-1, 1].map(l => { const o = new THREE.Mesh(geoOjo, luzCian); o.position.set(l * .13, .02, .32); return o; });
  const domo = new THREE.Mesh(new THREE.SphereGeometry(.4, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), amarillo);
  domo.position.y = .26; domo.scale.set(1, .78, 1);
  const ala = new THREE.Mesh(new THREE.CylinderGeometry(.47, .47, .035, 32), amarilloOscuro);
  ala.position.y = .27;
  const lampara = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, .07, 16), luzSenal);
  lampara.rotation.x = Math.PI / 2;
  lampara.position.set(0, .42, .3);
  cabeza.add(craneo, visor, ...ojos, domo, ala, lampara);
  const izq = brazoMini(-1, -.16), der = brazoMini(1, -.16);
  // La llave cuelga de la mano derecha.
  const llave = new THREE.Group();
  const mango = new THREE.Mesh(new THREE.BoxGeometry(.035, .24, .025), metal);
  mango.position.y = -.1;
  const boca = new THREE.Mesh(new THREE.TorusGeometry(.055, .02, 8, 16, Math.PI * 1.4), metal);
  boca.position.y = -.25; boca.rotation.z = Math.PI * .3;
  llave.add(mango, boca);
  llave.position.copy(der.mano.position);
  der.hombro.add(llave);
  const botas = [-1, 1].map(l => { const b = new THREE.Mesh(new RoundedBoxGeometry(.17, .1, .22, 3, .04), oscuro); b.position.set(l * .13, -.56, .02); return b; });
  g.add(torso, franja, franja2, cabeza, izq.hombro, der.hombro, ...botas);
  return {g, ojos, cabeza, brazoIzq: izq.hombro, brazoDer: der.hombro, llave, alto: 1.2,
    anim(t){ lampara.material = Math.sin(t * 6) > 0 ? luzSenal : amarilloOscuro; }};
}

// Brisa: el dron de limpieza, con un solo ojo de cámara y dos hélices.
function crearBrisa(){
  const g = new THREE.Group();
  const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(.36, 28, 20), blanco);
  cuerpo.scale.set(1.35, .62, 1.05);
  const camaraOjo = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .08, 24), oscuro);
  camaraOjo.rotation.x = Math.PI / 2;
  camaraOjo.position.z = .34;
  const iris = new THREE.Mesh(new THREE.SphereGeometry(.075, 18, 14), luzCian);
  iris.position.z = .38;
  const destello = new THREE.Mesh(new THREE.SphereGeometry(.022, 8, 6), new THREE.MeshBasicMaterial({color: 0xffffff}));
  destello.position.set(.03, .03, .45);
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(.2, .015, 8, 36), luzCian);
  anillo.rotation.x = Math.PI / 2;
  anillo.position.y = -.22;
  g.add(cuerpo, camaraOjo, iris, destello, anillo);
  const aspas = [];
  [-1, 1].forEach(l => {
    const brazo = new THREE.Mesh(new THREE.BoxGeometry(.42, .04, .06), metal);
    brazo.position.set(l * .55, .1, 0);
    const eje = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .07, 12), metal);
    eje.position.set(l * .78, .16, 0);
    const helice = new THREE.Group();
    helice.position.set(l * .78, .2, 0);
    for(let i = 0; i < 2; i++){
      const a = new THREE.Mesh(new THREE.BoxGeometry(.42, .012, .05), oscuro);
      a.rotation.y = i * Math.PI / 2;
      helice.add(a);
    }
    const guarda = new THREE.Mesh(new THREE.TorusGeometry(.24, .012, 6, 36), luzCian);
    guarda.rotation.x = Math.PI / 2;
    guarda.position.copy(helice.position);
    const led = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), new THREE.MeshBasicMaterial({color: l < 0 ? brillo(0x49CC90) : brillo(0xFF5F57), toneMapped: false}));
    led.position.set(l * .44, 0, .16);
    g.add(brazo, eje, helice, guarda, led);
    aspas.push(helice);
  });
  return {g, ojos: [iris], alto: .75,
    anim(t, dt){ aspas[0].rotation.y += dt * 38; aspas[1].rotation.y -= dt * 38; }};
}

// Foco: el bombillo pintor, con filamento encendido y una brocha.
function crearFoco(){
  const g = new THREE.Group();
  const vidrio = new THREE.MeshPhysicalMaterial({color: 0xFFF6D6, roughness: .08, clearcoat: 1, transparent: true, opacity: .62,
    emissive: 0xF5C542, emissiveIntensity: .35, depthWrite: false});
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(.4, 32, 24), vidrio);
  bulbo.position.y = .18;
  const cuello = new THREE.Mesh(new THREE.CylinderGeometry(.2, .26, .26, 28, 1, true), vidrio);
  cuello.position.y = -.2;
  const filamento = new THREE.Mesh(new THREE.TorusGeometry(.11, .014, 8, 30), luzSenal.clone());
  filamento.position.y = .1;
  const soportes = [-1, 1].map(l => { const s = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .32, 6), metal); s.position.set(l * .08, -.1, 0); return s; });
  const rosca = [0, 1, 2].map(i => { const r = new THREE.Mesh(new THREE.CylinderGeometry(.21, .21, .065, 28), metal); r.position.y = -.38 - i * .08; return r; });
  const punta = new THREE.Mesh(new THREE.CylinderGeometry(.13, .06, .08, 20), oscuro);
  punta.position.y = -.64;
  const ojos = [-1, 1].map(l => { const o = new THREE.Mesh(new THREE.SphereGeometry(.05, 14, 10), oscuro); o.scale.set(1, 1.35, 1); o.position.set(l * .13, .25, .37); return o; });
  const sonrisa = new THREE.Mesh(new THREE.TorusGeometry(.06, .012, 6, 16, Math.PI), oscuro);
  sonrisa.rotation.z = Math.PI;
  sonrisa.position.set(0, .13, .385);
  const izq = brazoMini(-1, -.08, .14), der = brazoMini(1, -.08, .14);
  izq.hombro.position.x = -.36; der.hombro.position.x = .36;
  const pintura = new THREE.MeshStandardMaterial({color: 0x3FD0FF, roughness: .4});
  const brocha = new THREE.Group();
  const mango = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .26, 8), madera);
  mango.position.y = -.08;
  const virola = new THREE.Mesh(new THREE.BoxGeometry(.08, .04, .04), metal);
  virola.position.y = -.22;
  const cerdas = new THREE.Mesh(new RoundedBoxGeometry(.08, .1, .04, 2, .015), pintura);
  cerdas.position.y = -.29;
  brocha.add(mango, virola, cerdas);
  brocha.position.copy(der.mano.position);
  der.hombro.add(brocha);
  g.add(filamento, ...soportes, ...rosca, punta, ...ojos, sonrisa, izq.hombro, der.hombro, cuello, bulbo);
  return {g, ojos, brazoDer: der.hombro, brazoIzq: izq.hombro, pintura, alto: 1.2,
    anim(t){ filamento.material.color.setHex(0xF5C542).multiplyScalar(1.4 + Math.sin(t * 5) * .3); }};
}

// Chispa: una bola de energía juguetona con rayitos alrededor.
function crearChispa(){
  const g = new THREE.Group();
  const nucleo = new THREE.Mesh(new THREE.SphereGeometry(.26, 24, 18), new THREE.MeshBasicMaterial({color: new THREE.Color(0x3FD0FF).multiplyScalar(1.7), toneMapped: false}));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(.36, 24, 18), new THREE.MeshBasicMaterial({color: 0x3FD0FF, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false}));
  const ojos = [-1, 1].map(l => { const o = new THREE.Mesh(new THREE.SphereGeometry(.045, 12, 10), oscuro); o.scale.set(1, 1.4, 1); o.position.set(l * .09, .04, .25); return o; });
  const boca = new THREE.Mesh(new THREE.TorusGeometry(.04, .01, 6, 14, Math.PI), oscuro);
  boca.rotation.z = Math.PI;
  boca.position.set(0, -.05, .26);
  const satelites = [0, 1, 2].map(() => new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), luzSenal));
  const rayos = [0, 1].map(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(7 * 3), 3));
    return new THREE.Line(geo, new THREE.LineBasicMaterial({color: brillo(0xF5C542), toneMapped: false, transparent: true}));
  });
  g.add(halo, nucleo, ...ojos, boca, ...satelites, ...rayos);
  return {g, ojos, alto: .8,
    anim(t){
      satelites.forEach((s, i) => { const a = t * 3 + i * 2.1; s.position.set(Math.cos(a) * .5, Math.sin(a * 1.3) * .2, Math.sin(a) * .5); });
      halo.scale.setScalar(1 + Math.sin(t * 8) * .06);
      // Rayitos en zigzag que cambian de forma cada cuadro.
      rayos.forEach((r, i) => {
        const p = r.geometry.attributes.position.array, ang = t * 2 + i * Math.PI + Math.sin(t * 7) * .4;
        for(let k = 0; k < 7; k++){
          const d = .3 + k * .07, j = k ? (Math.random() - .5) * .08 : 0;
          p[k * 3] = Math.cos(ang) * d + j; p[k * 3 + 1] = Math.sin(ang) * d + j; p[k * 3 + 2] = .1;
        }
        r.geometry.attributes.position.needsUpdate = true;
        r.material.opacity = Math.random() < .3 ? 0 : 1;
      });
    }};
}

// Holo: un Volt hecho de luz que proyecta y cuelga las fotos.
function crearHolo(){
  const g = new THREE.Group();
  const linea = new THREE.LineBasicMaterial({color: brillo(0x3FD0FF), toneMapped: false, transparent: true});
  const relleno = new THREE.MeshBasicMaterial({color: 0x3FD0FF, transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false});
  const pieza = (geo, y) => {
    const m = new THREE.Mesh(geo, relleno);
    const l = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), linea);
    m.position.y = l.position.y = y;
    g.add(m, l);
  };
  pieza(new RoundedBoxGeometry(1.04, .84, .84, 2, .28), .42);
  pieza(new RoundedBoxGeometry(.86, .62, .08, 2, .14), .43);
  pieza(new RoundedBoxGeometry(.66, .52, .52, 2, .2), -.66);
  const ojos = [-1, 1].map(l => { const o = new THREE.Mesh(geoOjo, luzCian); o.scale.setScalar(1.6); o.position.set(l * .17, .45, .5); g.add(o); return o; });
  const antena = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.02, .02, .3, 4)), linea);
  antena.position.set(.18, .99, 0);
  const punta = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 8), luzCian);
  punta.position.set(.18, 1.17, 0);
  const base = [.42, .26].map(r => { const b = new THREE.Mesh(new THREE.TorusGeometry(r, .012, 6, 40), luzCian); b.rotation.x = Math.PI / 2; b.position.y = -1.08; return b; });
  const barrido = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .035), new THREE.MeshBasicMaterial({color: 0x3FD0FF, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false}));
  barrido.position.z = .45;
  g.add(antena, punta, ...base, barrido);
  return {g, ojos, alto: 2.25,
    anim(t){
      linea.opacity = .7 + Math.random() * .3;
      barrido.position.y = (t * .9 % 1) * 2.1 - 1.05;
    }};
}

// ------------------------------------------------------------------ actores
// Cada actor tiene su posición en píxeles. Si tiene un ancla (un elemento de la página),
// la posición es relativa a ese elemento y lo sigue aunque la página se mueva.
const rects = new Map();
function rect(el){
  if(!rects.has(el)) rects.set(el, el.getBoundingClientRect());
  return rects.get(el);
}
const ALTO = MOVIL ? 60 : 86;

class Actor{
  constructor(id, nombre, rol, modelo){
    this.id = id; this.nombre = nombre; this.rol = rol; this.m = modelo;
    this.g = new THREE.Group();
    this.g.add(modelo.g);
    this.g.visible = false;
    escena.add(this.g);
    this.p = {x: 0, y: 0, alto: ALTO, vis: 0, giro: 0, inclina: 0, salto: 0, aplasta: 0};
    this.ancla = null;
    this.fase = Math.random() * 6;
    this.parpadeo = 0; this.proxParpadeo = 1 + Math.random() * 3;
    this.prevX = null; this.vx = 0;
    this.hit = document.createElement('button');
    this.hit.type = 'button';
    this.hit.className = 'equipo-hit';
    this.hit.tabIndex = -1;
    this.hit.hidden = true;
    this.hit.addEventListener('click', () => tocar(this));
    document.body.appendChild(this.hit);
  }
  get visible(){ return this.g.visible; }
  pantalla(){
    if(this.ancla){ const r = rect(this.ancla); return {x: r.left + this.p.x, y: r.top + this.p.y}; }
    return {x: this.p.x, y: this.p.y};
  }
  mostrar(){
    this.g.visible = true; this.hit.hidden = false; this.prevX = null;
    this.hit.setAttribute('aria-label', L(`${this.nombre}, ${this.rol[0]}`, `${this.nombre}, ${this.rol[1]}`));
    encender();
  }
  ocultar(){ this.g.visible = false; this.hit.hidden = true; this.ancla = null; gsap.killTweensOf(this.p); }
  cuadro(t, dt){
    const s = this.pantalla();
    if(this.prevX === null) this.prevX = s.x;
    this.vx += ((s.x - this.prevX) / Math.max(dt, .001) - this.vx) * .12;
    this.prevX = s.x;
    const escala = this.p.alto / this.m.alto * this.p.vis;
    const ap = this.p.aplasta;
    this.g.position.set(s.x, -(s.y + this.p.salto), 0);
    this.g.scale.set(escala * (1 + ap * .25), escala * (1 - ap * .3), escala);
    // Un poco girado hacia la cámara para que se note el volumen, e inclinado al moverse.
    const mov = THREE.MathUtils.clamp(this.vx / 900, -.6, .6);
    this.m.g.rotation.set(.18, -.32 + this.p.giro + mov, this.p.inclina - mov * .4);
    this.m.g.position.y = Math.sin(t * 2.4 + this.fase) * .05;
    this.proxParpadeo -= dt;
    if(this.proxParpadeo <= 0){ this.parpadeo = 1; this.proxParpadeo = 2 + Math.random() * 3; }
    this.parpadeo = Math.max(this.parpadeo - dt * 8, 0);
    const ojoY = 1 - Math.sin(this.parpadeo * Math.PI) * .9;
    this.m.ojos.forEach(o => { o.scale.y = (o.userData.sy ??= o.scale.y) * ojoY; });
    this.m.anim?.(t, dt, this);
    const lado = Math.round(this.p.alto * 1.1 * this.p.vis);
    poner(this.hit, 'transform', `translate(${Math.round(s.x - lado / 2)}px, ${Math.round(s.y + this.p.salto - lado / 2)}px)`);
    poner(this.hit, 'width', `${lado}px`); poner(this.hit, 'height', `${lado}px`);
  }
}
function poner(el, prop, valor){
  el._ultimo = el._ultimo || {};
  if(el._ultimo[prop] === valor) return;
  el._ultimo[prop] = valor;
  el.style.setProperty(prop, valor);
}

const tuerca = new Actor('tuerca', 'Tuerca', ['ingeniero de mantenimiento', 'maintenance engineer'], crearTuerca());
const brisa = new Actor('brisa', 'Brisa', ['dron de limpieza', 'cleaning drone'], crearBrisa());
const foco = new Actor('foco', 'Foco', ['el pintor del equipo', 'the team painter'], crearFoco());
const chispa = new Actor('chispa', 'Chispa', ['la más juguetona', 'the playful one'], crearChispa());
const holo = new Actor('holo', 'Holo', ['el que cuelga las fotos', 'the photo hanger'], crearHolo());
const ACTORES = [tuerca, brisa, foco, chispa, holo];
holo.p.alto = ALTO * 1.35;
chispa.p.alto = ALTO * .72;
brisa.p.alto = ALTO * .8;

// Cable del que baja Tuerca.
const cable = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x8E99B0}));
cable.visible = false;
escena.add(cable);
function actualizarCable(){
  if(!cable.visible || !tuerca.visible) return;
  const s = tuerca.pantalla();
  const arriba = s.y + tuerca.p.salto - tuerca.p.alto * .45;
  cable.position.set(s.x, -arriba / 2, -50);
  cable.scale.set(2, Math.max(arriba, 1), 2);
}

// ------------------------------------------------------------------ partículas
// Polvo, chispas y gotas de pintura en coordenadas de pantalla.
const MAX = 260;
const pPos = new Float32Array(MAX * 3).fill(99999), pCol = new Float32Array(MAX * 3), pVel = new Float32Array(MAX * 2), pVida = new Float32Array(MAX), pGrav = new Float32Array(MAX);
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
const particulas = new THREE.Points(pGeo, new THREE.PointsMaterial({size: MOVIL ? 4 : 5, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false}));
particulas.frustumCulled = false;
escena.add(particulas);
let pSig = 0, pVivas = 0;
const colorTmp = new THREE.Color();
function soltar(x, y, n, {color = 0xF5C542, vel = 220, vida = .8, gravedad = 380, angulo = -Math.PI / 2, abanico = Math.PI * 2} = {}){
  colorTmp.set(color).multiplyScalar(1.3);
  for(let i = 0; i < n; i++){
    const k = pSig = (pSig + 1) % MAX;
    const a = angulo + (Math.random() - .5) * abanico, v = vel * (.4 + Math.random() * .8);
    pPos[k * 3] = x; pPos[k * 3 + 1] = -y; pPos[k * 3 + 2] = 100;
    pVel[k * 2] = Math.cos(a) * v; pVel[k * 2 + 1] = -Math.sin(a) * v;
    pCol[k * 3] = colorTmp.r; pCol[k * 3 + 1] = colorTmp.g; pCol[k * 3 + 2] = colorTmp.b;
    pVida[k] = vida * (.6 + Math.random() * .6); pGrav[k] = gravedad;
  }
  encender();
}
function actualizarParticulas(dt){
  pVivas = 0;
  for(let k = 0; k < MAX; k++){
    if(pVida[k] <= 0) continue;
    pVida[k] -= dt;
    if(pVida[k] <= 0){ pPos[k * 3 + 1] = 99999; continue; }
    pVivas++;
    pVel[k * 2 + 1] -= pGrav[k] * dt;
    pPos[k * 3] += pVel[k * 2] * dt; pPos[k * 3 + 1] += pVel[k * 2 + 1] * dt;
  }
  pGeo.attributes.position.needsUpdate = true;
  pGeo.attributes.color.needsUpdate = true;
  return pVivas > 0;
}

// ------------------------------------------------------------------ capas sobre la página
// Efectos en HTML que siguen a un elemento: brillo de limpieza, trazos de pintura, hologramas.
const capas = new Set();
function capa(el, clase, ancla, actualizar){
  el.setAttribute('class', clase);   // sirve también para el SVG del trazo de pintura
  document.body.appendChild(el);
  const c = {el, ancla, actualizar, quitar(){ el.remove(); capas.delete(c); }};
  capas.add(c);
  encender();
  return c;
}
function cubrir(el, r){
  poner(el, 'transform', `translate(${Math.round(r.left)}px, ${Math.round(r.top)}px)`);
  poner(el, 'width', `${Math.round(r.width)}px`); poner(el, 'height', `${Math.round(r.height)}px`);
}
function brillar(ancla, ms = 1300){
  const el = document.createElement('div');
  el.style.borderRadius = getComputedStyle(ancla).borderRadius;
  const c = capa(el, 'equipo-brillo', ancla, () => cubrir(el, rect(ancla)));
  setTimeout(() => c.quitar(), ms);
}

// ------------------------------------------------------------------ bucle
const reloj = new THREE.Clock(false);
let corriendo = false, ocupado = false;
function encender(){
  if(corriendo) return;
  corriendo = true;
  reloj.start();
  requestAnimationFrame(cuadro);
}
function cuadro(){
  const dt = Math.min(reloj.getDelta(), .05), t = reloj.elapsedTime;
  rects.clear();
  let hay = false;
  for(const a of ACTORES) if(a.visible){ a.cuadro(t, dt); hay = true; }
  if(actualizarParticulas(dt)) hay = true;
  for(const c of capas){ c.actualizar(); hay = true; }
  actualizarCable();
  renderer.render(escena, camara);
  if(hay || ocupado) requestAnimationFrame(cuadro);
  else{ corriendo = false; reloj.stop(); }
}

// ------------------------------------------------------------------ utilidades de escena
const esperar = ms => new Promise(r => setTimeout(r, ms));
const elegir = arr => arr[Math.floor(Math.random() * arr.length)];
const azar = (a, b) => a + Math.random() * (b - a);
// Elementos cuyo borde superior se ve en pantalla (ahí trabajan casi todos) y que caben a lo ancho.
function visibles(selector, {arriba = 90, minAncho = 140, hasta = .62} = {}){
  return [...document.querySelectorAll(selector)].filter(el => {
    const r = el.getBoundingClientRect();
    return r.width >= minAncho && r.top >= arriba && r.top <= innerHeight * hasta && r.left >= 8 && r.right <= innerWidth - 8;
  });
}
const TARJETAS = '.proy, .repo, .esp-card, .hito, .term, .cifra, .web-escenario';
let dichoEnEscena = false;
function voltDice(es, en, opciones = {}){
  if(dichoEnEscena || !chat.hidden || !window.Volt) return;
  dichoEnEscena = true;
  window.Volt.decir(L(es, en), {segundos: 3.2, ...opciones});
}
function sonar(tipo){
  const audio = window.__audio;
  if(!audio || audio.state !== 'running') return;
  try{
    const o = audio.createOscillator(), g = audio.createGain(), ahora = audio.currentTime;
    const [f1, f2, dur, onda] = {clic: [1400, 900, .05, 'square'], boing: [300, 900, .16, 'sine'], zap: [1800, 300, .12, 'sawtooth'], pop: [600, 1200, .08, 'triangle']}[tipo];
    o.type = onda;
    o.frequency.setValueAtTime(f1, ahora);
    o.frequency.exponentialRampToValueAtTime(f2, ahora + dur);
    g.gain.setValueAtTime(.025, ahora);
    g.gain.exponentialRampToValueAtTime(.0001, ahora + dur + .02);
    o.connect(g).connect(audio.destination);
    o.start(); o.stop(ahora + dur + .03);
  }catch(e){}
}
const aparecer = (a, d = .5) => gsap.to(a.p, {vis: 1, duration: d, ease: 'back.out(2)'});
const desaparecer = (a, d = .35) => gsap.to(a.p, {vis: 0, duration: d, ease: 'back.in(2)'});
// Animaciones del DOM con las propiedades sueltas translate/rotate: se suman al transform
// que ya usan las tarjetas (inclinación 3D) sin pisarlo.
function sacudir(el){ el.animate([{translate: '-3px 0'}, {translate: '3px 1px'}, {translate: '-2px 0'}, {translate: '0 0'}], {duration: 260, easing: 'ease-out'}); }

// ------------------------------------------------------------------ escenas
// Tuerca baja colgado de un cable, aprieta tres tornillos de una tarjeta y vuelve a subir.
async function mantenimiento(objetivo){
  const el = objetivo || elegir(visibles(TARJETAS));
  if(!el) return false;
  const r = rect(el), a = tuerca;
  a.ancla = el;
  Object.assign(a.p, {x: r.width - Math.min(70, r.width * .2), y: -r.top - 80, vis: 1, giro: 0, salto: 0});
  cable.visible = true;
  a.mostrar();
  sonar('boing');
  await gsap.to(a.p, {y: -a.p.alto * .5, duration: 1.5, ease: 'bounce.out'});
  voltDice('¡Tuerca vino a revisar los tornillos! 🔧', 'Tuerca is here to check the screws! 🔧', {expresion: 'feliz'});
  for(let i = 0; i < 3; i++){
    await gsap.to(a.m.brazoDer.rotation, {z: 1.5, x: -.6, duration: .18, ease: 'power2.out'});
    await gsap.to(a.m.llave.rotation, {y: '+=3.14', duration: .25});
    const s = a.pantalla();
    soltar(s.x + a.p.alto * .3, s.y + a.p.alto * .25, 10, {color: 0xF5C542, vel: 260, vida: .5});
    sacudir(el);
    sonar('clic');
    await gsap.to(a.m.brazoDer.rotation, {z: .2, x: 0, duration: .2});
    await esperar(150);
  }
  await gsap.to(a.p, {giro: Math.PI * 2, duration: .7, ease: 'power2.inOut'});
  a.p.giro = 0;
  await esperar(300);
  await gsap.to(a.p, {y: -rect(el).top - 120, duration: 1.1, ease: 'power2.in'});
  cable.visible = false;
  a.ocultar();
  return true;
}

// Brisa cruza volando, se queda sobre una tarjeta soplando el polvo y la deja brillando.
async function limpieza(objetivo){
  const el = objetivo || elegir(visibles(TARJETAS));
  if(!el) return false;
  const r = rect(el), a = brisa;
  a.ancla = el;
  const desdeIzq = Math.random() < .5;
  Object.assign(a.p, {x: desdeIzq ? -r.left - 60 : innerWidth - r.left + 60, y: -a.p.alto * .9, vis: 1, giro: 0, salto: 0});
  a.mostrar();
  await gsap.to(a.p, {x: r.width / 2, duration: 1.6, ease: 'power2.out'});
  voltDice('Brisa está quitando el polvo. ✨', 'Brisa is dusting things off. ✨', {expresion: 'guino'});
  brillar(el, 1500);
  const fin = performance.now() + 1500;
  while(performance.now() < fin){
    const rr = rect(el), s = a.pantalla();
    soltar(s.x + azar(-rr.width * .35, rr.width * .35), rr.top + 4, 3, {color: 0x9AA4B8, vel: 120, vida: 1.1, gravedad: -60, angulo: Math.PI / 2 + (desdeIzq ? -.6 : .6), abanico: 1.2});
    gsap.to(a.p, {x: r.width / 2 + Math.sin(performance.now() / 300) * r.width * .25, duration: .25, overwrite: 'auto'});
    await esperar(90);
  }
  sonar('pop');
  await gsap.to(a.p, {x: desdeIzq ? innerWidth - rect(el).left + 80 : -rect(el).left - 80, y: -a.p.alto * 2, duration: 1.4, ease: 'power2.in'});
  a.ocultar();
  return true;
}

// Foco recorre un título pintándole un subrayado de color, que luego se desvanece.
const COLORES = ['#3FD0FF', '#F5C542', '#49CC90', '#FF6FB5', '#9B8CFF'];
async function pintura(){
  const titulos = visibles('.titulo-sec span, .titulo-sec', {minAncho: 120});
  const el = elegir(titulos.filter(t => !titulos.some(o => o !== t && o.contains(t))));
  if(!el) return false;
  const r = rect(el), a = foco, color = elegir(COLORES);
  a.m.pintura.color.set(color);
  a.ancla = el;
  const suelo = r.height + 8 - a.p.alto * .5;
  Object.assign(a.p, {x: -40, y: suelo, vis: 0, giro: .6, salto: 0});
  a.mostrar();
  await aparecer(a);
  // El trazo es un SVG que sigue al título y crece detrás de Foco.
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const ancho = Math.round(r.width + 20);
  svg.setAttribute('viewBox', `0 0 ${ancho} 24`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const trazo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trazo.setAttribute('d', `M6 14 C ${ancho * .25} 6, ${ancho * .5} 20, ${ancho * .75} 10 S ${ancho - 6} 14, ${ancho - 6} 12`);
  trazo.setAttribute('stroke', color);
  trazo.setAttribute('pathLength', '1');
  svg.appendChild(trazo);
  const pincel = capa(svg, 'equipo-trazo', el, () => {
    const rr = rect(el);
    poner(svg, 'transform', `translate(${Math.round(rr.left - 10)}px, ${Math.round(rr.bottom - 6)}px)`);
    poner(svg, 'width', `${Math.round(rr.width + 20)}px`);
    trazo.style.strokeDashoffset = 1 - THREE.MathUtils.clamp((a.p.x + 10) / (rr.width + 20), 0, 1);
  });
  trazo.style.strokeDasharray = '1';
  const pasos = Math.max(3, Math.round(r.width / 70));
  const dur = Math.min(3.2, .45 * pasos);
  gsap.to(a.p, {x: r.width + 6, duration: dur, ease: 'none'});
  for(let i = 0; i < pasos; i++){
    gsap.to(a.m.brazoDer.rotation, {z: 1, duration: dur / pasos / 2, yoyo: true, repeat: 1});
    await gsap.to(a.p, {salto: -14, duration: dur / pasos / 2, ease: 'power2.out', yoyo: true, repeat: 1});
    const s = a.pantalla();
    soltar(s.x - 8, s.y + a.p.alto * .3, 4, {color, vel: 90, vida: .7, gravedad: 500});
  }
  sonar('pop');
  voltDice('¡Quedó bonito, Foco! 🎨', 'Looks great, Foco! 🎨', {expresion: 'amor'});
  await gsap.to(a.p, {giro: -.6, duration: .3});
  gsap.to(a.m.brazoDer.rotation, {z: 2.4, duration: .25, yoyo: true, repeat: 3});
  await gsap.to(a.p, {salto: -24, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out'});
  await desaparecer(a);
  a.ocultar();
  // El trazo se queda un rato y se desvanece: el título vuelve a estar como antes.
  setTimeout(() => { svg.style.opacity = '0'; setTimeout(() => pincel.quitar(), 1300); }, 9000);
  return true;
}

// Holo se materializa junto a una captura, la proyecta en el aire y la "cuelga" de nuevo.
async function fotos(){
  const img = elegir(visibles('.repo-foto img, .proy .navegador img', {minAncho: 160, arriba: 170, hasta: .78}));
  if(!img) return false;
  const marco = img.closest('.repo-foto, .navegador') || img;
  const a = holo;
  a.ancla = marco;
  Object.assign(a.p, {x: -a.p.alto * .1, y: -a.p.alto * .35, vis: 0, giro: .5, salto: 0});
  a.mostrar();
  sonar('zap');
  await gsap.to(a.p, {vis: 1, duration: .7, ease: 'elastic.out(1, .5)'});
  const holograma = document.createElement('div');
  const foto = new Image();
  foto.src = img.currentSrc || img.src;
  foto.alt = '';
  holograma.appendChild(foto);
  const haz = document.createElement('div');
  const est = {sube: 0, cae: 0};
  const cHaz = capa(haz, 'equipo-haz', marco, () => {});
  const cHolo = capa(holograma, 'equipo-holograma', marco, () => {
    const rr = rect(marco), s = a.pantalla();
    const w = rr.width * .62 * (1 - est.cae * .2), h = w * .6;
    const x = rr.left + rr.width / 2 - w / 2;
    const y = rr.top - h - 26 - est.sube * 10 + est.cae * (h + 40) + Math.sin(performance.now() / 500) * 4;
    poner(holograma, 'transform', `translate(${Math.round(x)}px, ${Math.round(y)}px)`);
    poner(holograma, 'width', `${Math.round(w)}px`); poner(holograma, 'height', `${Math.round(h)}px`);
    poner(holograma, 'opacity', `${Math.min(est.sube, 1 - est.cae)}`);
    // Haz de luz desde los ojos de Holo hasta las esquinas inferiores del holograma.
    const ox = s.x, oy = s.y - a.p.alto * .2;
    const minX = Math.min(ox, x), minY = Math.min(oy, y + h), maxX = Math.max(ox, x + w), maxY = Math.max(oy, y + h);
    poner(haz, 'transform', `translate(${Math.round(minX)}px, ${Math.round(minY)}px)`);
    poner(haz, 'width', `${Math.round(maxX - minX) || 1}px`); poner(haz, 'height', `${Math.round(maxY - minY) || 1}px`);
    const px = v => `${Math.round(v - minX)}px`, py = v => `${Math.round(v - minY)}px`;
    poner(haz, 'clip-path', `polygon(${px(ox)} ${py(oy)}, ${px(x)} ${py(y + h)}, ${px(x + w)} ${py(y + h)})`);
    poner(haz, 'opacity', `${Math.min(est.sube, 1 - est.cae) * .8}`);
  });
  await gsap.to(est, {sube: 1, duration: .6, ease: 'power2.out'});
  voltDice('Holo está colgando las fotos. 📸', 'Holo is hanging up the photos. 📸', {expresion: 'sorpresa'});
  await esperar(2200);
  await gsap.to(est, {cae: 1, duration: .6, ease: 'power2.in'});
  cHolo.quitar(); cHaz.quitar();
  brillar(marco, 900);
  sonar('clic');
  await esperar(400);
  await gsap.to(a.p, {vis: 0, duration: .5, ease: 'power2.in'});
  a.ocultar();
  return true;
}

// Chispa entra rebotando, Volt intenta alcanzarla y ella se escapa.
async function juego(){
  const a = chispa;
  const piso = innerHeight * (MOVIL ? .78 : .8);
  const izq = Math.random() < .5;
  Object.assign(a.p, {x: izq ? -40 : innerWidth + 40, y: piso, vis: 1, giro: 0, salto: 0, aplasta: 0});
  a.mostrar();
  window.Volt?.ponerExpresion('sorpresa', 1.5);
  const saltos = 4, paso = (innerWidth * .62) / saltos;
  for(let i = 0; i < saltos; i++){
    const alto = azar(90, 170);
    gsap.to(a.p, {x: `${izq ? '+' : '-'}=${paso}`, duration: .62, ease: 'none'});
    await gsap.to(a.p, {salto: -alto, duration: .31, ease: 'power2.out'});
    await gsap.to(a.p, {salto: 0, duration: .31, ease: 'power2.in'});
    const s = a.pantalla();
    soltar(s.x, s.y + a.p.alto * .4, 12, {color: 0x7FE3FF, vel: 200, vida: .5, angulo: -Math.PI / 2, abanico: 2});
    sonar('boing');
    await gsap.to(a.p, {aplasta: 1, duration: .07, yoyo: true, repeat: 1});
    if(i === 1) voltDice('¡Chispa, ven acá! 😄', 'Chispa, come back here! 😄', {expresion: 'feliz', gesto: 'saludar'});
  }
  await gsap.to(a.p, {x: izq ? innerWidth + 60 : -60, y: piso - innerHeight * .5, duration: .9, ease: 'power2.in'});
  a.ocultar();
  return true;
}

// Una tarjeta queda torcida; Tuerca y Foco llegan por los lados y la enderezan.
async function organizar(){
  // Lejos de la esquina de Volt, para que Foco no quede escondido detrás de él.
  const el = elegir(visibles('.repo, .esp-card, .hito, .proy', {minAncho: 220, hasta: .64}).filter(t => MOVIL || rect(t).right < innerWidth - 200));
  if(!el) return false;
  const r = rect(el);
  const torcida = el.animate([{rotate: '0deg'}, {rotate: '-2.2deg'}], {duration: 700, easing: 'cubic-bezier(.3,1.6,.6,1)', fill: 'forwards'});
  sonar('boing');
  voltDice('Uy, se torció una tarjeta… ¡equipo! 🛠️', 'Oops, a card got crooked… team! 🛠️', {expresion: 'sorpresa', gesto: 'senalar'});
  await esperar(800);
  const yBase = Math.min(r.height * .5, innerHeight - r.top - 120);
  tuerca.ancla = foco.ancla = el;
  cable.visible = false;
  Object.assign(tuerca.p, {x: -80, y: yBase, vis: 0, giro: .8, salto: 0});
  Object.assign(foco.p, {x: r.width + 80, y: yBase, vis: 0, giro: -.8, salto: 0});
  tuerca.mostrar(); foco.mostrar();
  aparecer(tuerca); await aparecer(foco);
  gsap.to(tuerca.p, {x: -tuerca.p.alto * .35, duration: .8, ease: 'power2.out'});
  await gsap.to(foco.p, {x: r.width + foco.p.alto * .35, duration: .8, ease: 'power2.out'});
  // Empujan tres veces y la tarjeta vuelve a su lugar con un rebote.
  for(let i = 0; i < 3; i++){
    gsap.to(tuerca.p, {x: '+=10', duration: .15, yoyo: true, repeat: 1});
    await gsap.to(foco.p, {x: '-=10', duration: .15, yoyo: true, repeat: 1});
    sonar('clic');
  }
  torcida.cancel();
  el.animate([{rotate: '-2.2deg'}, {rotate: '1deg'}, {rotate: '0deg'}], {duration: 600, easing: 'ease-out'});
  brillar(el, 900);
  const s1 = tuerca.pantalla(), s2 = foco.pantalla();
  soltar((s1.x + s2.x) / 2, s1.y - tuerca.p.alto, 24, {color: 0xF5C542, vel: 260, vida: .7});
  gsap.to(tuerca.p, {salto: -26, duration: .25, yoyo: true, repeat: 1});
  await gsap.to(foco.p, {salto: -26, duration: .25, yoyo: true, repeat: 1});
  window.Volt?.celebrar?.();
  await esperar(400);
  desaparecer(tuerca); await desaparecer(foco);
  tuerca.ocultar(); foco.ocultar();
  return true;
}

// ------------------------------------------------------------------ tocar a un ayudante
const PRESENTACION = {
  tuerca: ['Ese es Tuerca, nuestro ingeniero de mantenimiento. 🔧', 'That’s Tuerca, our maintenance engineer. 🔧'],
  brisa: ['Brisa mantiene todo limpio. ¡No le gusta el polvo! 🧹', 'Brisa keeps everything clean. She hates dust! 🧹'],
  foco: ['Foco es el pintor del equipo. Siempre tiene una idea. 💡', 'Foco is the team’s painter. Always full of ideas. 💡'],
  chispa: ['¡La atrapaste! Chispa es pura energía. ⚡', 'You caught her! Chispa is pure energy. ⚡'],
  holo: ['Holo es un holograma: proyecta y cuelga las fotos. 📸', 'Holo is a hologram: he projects and hangs the photos. 📸']
};
function tocar(a){
  sonar('boing');
  gsap.to(a.p, {salto: -30, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out'});
  gsap.fromTo(a.p, {giro: 0}, {giro: Math.PI * 2, duration: .6, ease: 'power2.out'});
  const s = a.pantalla();
  soltar(s.x, s.y, 18, {color: a === chispa ? 0x7FE3FF : 0xF5C542, vel: 240, vida: .6});
  if(window.Volt && chat.hidden){
    const [es, en] = PRESENTACION[a.id];
    window.Volt.decir(L(es, en), {expresion: 'feliz', segundos: 3.5});
  }
}

// El equipo saluda: tres o cuatro asoman desde el borde de abajo, saludan y se van.
async function saludo(){
  const elenco = MOVIL ? [tuerca, foco, chispa] : [tuerca, brisa, foco, chispa, holo];
  const ancho = Math.min(innerWidth - 60, elenco.length * (MOVIL ? 90 : 120));
  const x0 = (innerWidth - ancho) / 2 - (MOVIL ? 0 : 60);
  elenco.forEach((a, i) => {
    Object.assign(a.p, {x: x0 + ancho * (i + .5) / elenco.length, y: innerHeight + a.p.alto, vis: 1, giro: 0, salto: 0, aplasta: 0});
    a.mostrar();
  });
  voltDice('¡Te presento a mi equipo! Tuerca, Brisa, Foco, Chispa y Holo. 👋', 'Meet my team! Tuerca, Brisa, Foco, Chispa and Holo. 👋', {expresion: 'amor', gesto: 'saludar'});
  await Promise.all(elenco.map((a, i) => gsap.to(a.p, {y: innerHeight - a.p.alto * (a === holo ? .7 : .58), duration: .7, delay: i * .12, ease: 'back.out(1.8)'})));
  sonar('pop');
  // Cada uno saluda a su manera.
  for(const a of elenco){
    if(a.m.brazoDer) gsap.to(a.m.brazoDer.rotation, {z: 2.4, duration: .18, yoyo: true, repeat: 5});
    gsap.to(a.p, {salto: -22, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out'});
    await esperar(160);
  }
  await esperar(1800);
  await Promise.all(elenco.map((a, i) => gsap.to(a.p, {y: innerHeight + a.p.alto, duration: .5, delay: i * .08, ease: 'back.in(1.6)'})));
  elenco.forEach(a => a.ocultar());
  return true;
}

// ------------------------------------------------------------------ agenda
// No salen por reloj: reaccionan a lo que hace el visitante. Llegar a una sección, quedarse
// leyendo, detenerse sobre una tarjeta. Nunca de madrugada, con el chat o un caso abiertos.
const ESCENAS = {mantenimiento, limpieza, pintura, fotos, juego, organizar, saludo};
const CALMA = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAUSA_MIN = (MOVIL ? 16000 : 11000) * (CALMA ? 1.25 : 1);   // descanso mínimo entre escenas
let ultima = null, finUltima = 0;
const registro = [];   // escenas que ya pasaron en esta visita (útil para revisar)
function puedeActuar(){
  return !ocupado && !document.hidden && chat.hidden && document.getElementById('caso')?.hidden !== false
    && window.Volt?.momento !== 'madrugada' && performance.now() - finUltima > PAUSA_MIN;
}
async function correr(nombre, objetivo){
  if(ocupado || !ESCENAS[nombre]) return false;
  ocupado = true; dichoEnEscena = false;
  encender();
  let hecho = false;
  try{ hecho = await ESCENAS[nombre](objetivo); }
  catch(e){ console.warn('equipo:', e); }
  finally{
    ocupado = false;
    ACTORES.forEach(a => a.visible && a.ocultar());
    cable.visible = false;
    if(hecho){ ultima = nombre; finUltima = performance.now(); registro.push(nombre); }
  }
  return hecho;
}
async function alguna(preferidas = Object.keys(ESCENAS).filter(n => n !== 'saludo')){
  const orden = [...preferidas].sort(() => Math.random() - .5).sort((a, b) => (a === ultima) - (b === ultima));
  for(const n of orden) if(await correr(n)) return n;
  return null;
}

// Qué hace el equipo en cada sección: lo que tiene sentido con lo que hay en pantalla.
const POR_SECCION = {
  sobre: ['pintura'], hago: ['limpieza', 'organizar'], trayectoria: ['mantenimiento', 'organizar'],
  proyectos: ['limpieza', 'fotos', 'mantenimiento'], web: ['limpieza', 'juego'],
  github: ['fotos', 'organizar', 'mantenimiento'], terminal: ['juego'],
  herramientas: ['pintura', 'juego'], contacto: ['saludo', 'juego']
};
const visitadas = new Set();
let seccionActual = null, desdeSeccion = 0;
const observador = new IntersectionObserver(entradas => {
  for(const e of entradas) if(e.isIntersecting){ seccionActual = e.target.dataset.seccion; desdeSeccion = performance.now(); }
}, {rootMargin: '-35% 0px -35% 0px'});
document.querySelectorAll('[data-seccion]').forEach(s => observador.observe(s));

// Quién está quieto leyendo, y sobre qué tarjeta descansa el puntero.
let ultimaActividad = performance.now(), tarjetaBajo = null, desdeTarjeta = 0;
const actividad = () => { ultimaActividad = performance.now(); };
addEventListener('scroll', actividad, {passive: true});
addEventListener('keydown', actividad);
addEventListener('pointermove', e => {
  actividad();
  const t = e.target.closest?.(TARJETAS) || null;
  if(t !== tarjetaBajo){ tarjetaBajo = t; desdeTarjeta = performance.now(); }
}, {passive: true});

let presentados = false;
try{ presentados = sessionStorage.getItem('equipo-presentado') === '1'; }catch(e){}
const inicio = performance.now();

function vigilar(){
  if(!puedeActuar()) return;
  const ahora = performance.now();
  // 1. La primera vez, el equipo se presenta después del saludo de Volt.
  if(!presentados && ahora - inicio > 6000){
    presentados = true;
    try{ sessionStorage.setItem('equipo-presentado', '1'); }catch(e){}
    correr('saludo');
    return;
  }
  // 2. El puntero lleva un rato sobre una tarjeta: Tuerca viene a revisarla.
  if(tarjetaBajo && ahora - desdeTarjeta > 2200 && visibles(TARJETAS).includes(tarjetaBajo)){
    const t = tarjetaBajo;
    tarjetaBajo = null;
    correr(Math.random() < .6 ? 'mantenimiento' : 'limpieza', t);
    return;
  }
  // 3. Llegó a una sección nueva y se quedó: la escena que va con esa sección.
  if(seccionActual && !visitadas.has(seccionActual) && ahora - desdeSeccion > 1400 && POR_SECCION[seccionActual]){
    visitadas.add(seccionActual);
    alguna(POR_SECCION[seccionActual]);
    return;
  }
  // 4. Lleva un rato quieto leyendo: algo pasa cerca de lo que está mirando.
  if(ahora - ultimaActividad > (MOVIL ? 9000 : 7000) && ahora - finUltima > PAUSA_MIN * 2){
    alguna(POR_SECCION[seccionActual] || undefined);
    return;
  }
  // 5. Si nada de lo anterior pasa en un buen rato, igual aparece alguien.
  if(ahora - finUltima > (MOVIL ? 45000 : 30000) && ahora - inicio > 20000) alguna();
}

// ?escena=pintura muestra una escena enseguida; ?escena=todas las pasa una tras otra.
const forzada = new URLSearchParams(location.search).get('escena');
if(forzada === 'todas'){
  (async () => { await esperar(2500); for(const n of Object.keys(ESCENAS)){ await correr(n); await esperar(1200); } })();
}else if(forzada){
  setTimeout(() => correr(forzada), 2500);
}
setInterval(vigilar, 700);

window.Equipo = {
  escena: correr, alguna,
  get ocupado(){ return ocupado; }, registro,
  diagnostico: () => ({seccion: seccionActual, visitadas: [...visitadas], tarjeta: tarjetaBajo?.className || null, puede: puedeActuar(), desdeFin: Math.round(performance.now() - finUltima)}),
  miembros: ACTORES.map(a => ({id: a.id, nombre: a.nombre, rol: a.rol}))
};
