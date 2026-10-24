// VOLT: la mascota 3D del portafolio.
// Un robot flotante con cara de pantalla. La cara es un canvas que se redibuja
// cada cuadro (ojos que siguen al puntero, parpadeo, expresiones, boca al hablar)
// y el cuerpo se mueve con resortes para que todo tenga inercia y rebote.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('volt');
const hit = document.getElementById('voltHit');
const burbuja = document.getElementById('voltBurbuja');
const chatPanel = document.getElementById('chat');
const MENOS_MOVIMIENTO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esEN = () => document.documentElement.lang === 'en';

let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'high-performance'});
}catch(e){
  canvas.remove(); hit.remove();
  throw e;
}
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const escena = new THREE.Scene();
// El reflejo ambiental hace que el plástico brille, pero generarlo cuesta. En equipos
// modestos y celulares se omite y las luces de la escena bastan.
const MODESTO = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || matchMedia('(pointer: coarse)').matches;
if(!MODESTO){
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  pmrem.dispose();
}

const camara = new THREE.PerspectiveCamera(30, 1, .1, 50);
camara.position.set(0, 0, 10);

escena.add(new THREE.HemisphereLight(0xdfe8ff, 0x0b1020, .9));
const clave = new THREE.DirectionalLight(0xffffff, 1.6);
clave.position.set(3, 4, 5);
escena.add(clave);
const contra = new THREE.DirectionalLight(0x3FD0FF, 2.4);
contra.position.set(-4, 2, -3);
escena.add(contra);

// ------------------------------------------------------------------ resortes
// Cada valor animado persigue su objetivo con un resorte amortiguado.
class Resorte{
  constructor(v = 0, k = 140, d = 16){ this.x = v; this.v = 0; this.meta = v; this.k = k; this.d = d; }
  paso(dt){
    const a = (this.meta - this.x) * this.k - this.v * this.d;
    this.v += a * dt; this.x += this.v * dt;
    return this.x;
  }
  empujar(f){ this.v += f; }
}

// ------------------------------------------------------------------ materiales
const blanco = new THREE.MeshPhysicalMaterial({color: 0xF1F4FA, roughness: .28, metalness: .05, clearcoat: 1, clearcoatRoughness: .12});
const oscuro = new THREE.MeshPhysicalMaterial({color: 0x0A0F1A, roughness: .18, metalness: .3, clearcoat: 1, clearcoatRoughness: .05});
const metal = new THREE.MeshStandardMaterial({color: 0x8E99B0, roughness: .3, metalness: .9});
const luzCian = new THREE.MeshBasicMaterial({color: new THREE.Color(0x3FD0FF).multiplyScalar(1.6), toneMapped: false});
const luzSenal = new THREE.MeshBasicMaterial({color: new THREE.Color(0xF5C542).multiplyScalar(1.5), toneMapped: false});

// ------------------------------------------------------------------ cuerpo
const raiz = new THREE.Group();
escena.add(raiz);
const flota = new THREE.Group();     // balanceo y giros
raiz.add(flota);

const torso = new THREE.Mesh(new RoundedBoxGeometry(.66, .52, .52, 5, .2), blanco);
torso.position.y = -.66;
flota.add(torso);

const pechoAro = new THREE.Mesh(new THREE.TorusGeometry(.1, .022, 12, 40), luzCian);
pechoAro.position.set(0, -.64, .265);
flota.add(pechoAro);
const pechoNucleo = new THREE.Mesh(new THREE.CircleGeometry(.06, 24), luzCian.clone());
pechoNucleo.position.set(0, -.64, .262);
flota.add(pechoNucleo);

// Propulsor con llama y chispas.
const propulsor = new THREE.Mesh(new THREE.CylinderGeometry(.16, .11, .14, 24), metal);
propulsor.position.y = -.98;
flota.add(propulsor);
const llama = new THREE.Mesh(new THREE.ConeGeometry(.1, .36, 20, 1, true),
  new THREE.MeshBasicMaterial({color: new THREE.Color(0x3FD0FF).multiplyScalar(2), transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide}));
llama.rotation.x = Math.PI;
llama.position.y = -1.22;
flota.add(llama);

const CHISPAS = 36;
const chispaPos = new Float32Array(CHISPAS * 3), chispaVida = new Float32Array(CHISPAS), chispaVel = new Float32Array(CHISPAS * 3);
const chispaGeo = new THREE.BufferGeometry();
chispaGeo.setAttribute('position', new THREE.BufferAttribute(chispaPos, 3));
const chispas = new THREE.Points(chispaGeo, new THREE.PointsMaterial({
  color: new THREE.Color(0x7FE3FF).multiplyScalar(1.5), size: .05, transparent: true, opacity: .9,
  blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
}));
escena.add(chispas); // en el mundo, para que queden atrás cuando Volt se mueve

// Brazos: un pivote en el hombro, un antebrazo y una mano.
function brazo(lado){
  const hombro = new THREE.Group();
  hombro.position.set(lado * .4, -.56, 0);
  const tubo = new THREE.Mesh(new THREE.CapsuleGeometry(.065, .22, 6, 14), blanco);
  tubo.position.y = -.17;
  const mano = new THREE.Mesh(new THREE.SphereGeometry(.095, 20, 16), oscuro);
  mano.position.y = -.36;
  hombro.add(tubo, mano);
  flota.add(hombro);
  return hombro;
}
const brazoIzq = brazo(-1), brazoDer = brazo(1);

const cuello = new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, .14, 20), metal);
cuello.position.y = -.34;
flota.add(cuello);

// ------------------------------------------------------------------ cabeza
const cabeza = new THREE.Group();
cabeza.position.y = -.28;                     // pivote en el cuello
flota.add(cabeza);
const casco = new THREE.Mesh(new RoundedBoxGeometry(1.04, .84, .84, 6, .28), blanco);
casco.position.y = .42;
cabeza.add(casco);

const visera = new THREE.Mesh(new RoundedBoxGeometry(.86, .62, .08, 5, .14), oscuro);
visera.position.set(0, .43, .4);
cabeza.add(visera);

// Pantalla de la cara.
const caraCanvas = document.createElement('canvas');
// Se dibuja en coordenadas de 512 × 368 pero el canvas real es más pequeño: la cara
// se ve igual de nítida en la pantalla del robot y cuesta casi la mitad redibujarla.
caraCanvas.width = 384; caraCanvas.height = 276;
const cx = caraCanvas.getContext('2d');
const caraTex = new THREE.CanvasTexture(caraCanvas);
caraTex.colorSpace = THREE.SRGBColorSpace;
const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(.78, .56),
  new THREE.MeshBasicMaterial({map: caraTex, transparent: true, toneMapped: false}));
pantalla.position.set(0, .43, .445);
cabeza.add(pantalla);

// Orejas con aro de luz.
[-1, 1].forEach(lado => {
  const oreja = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .1, 24), oscuro);
  oreja.rotation.z = Math.PI / 2;
  oreja.position.set(lado * .55, .42, 0);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(.085, .014, 10, 30), luzCian);
  aro.rotation.y = Math.PI / 2;
  aro.position.set(lado * .605, .42, 0);
  cabeza.add(oreja, aro);
});

// Antena con resorte propio.
const antena = new THREE.Group();
antena.position.set(.18, .84, 0);
cabeza.add(antena);
const varilla = new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, .3, 10), metal);
varilla.position.y = .15;
const bombillo = new THREE.Mesh(new THREE.SphereGeometry(.07, 20, 16), luzSenal);
bombillo.position.y = .33;
antena.add(varilla, bombillo);
const luzBombillo = new THREE.PointLight(0xF5C542, 1.5, 2.5);
luzBombillo.position.y = .33;
antena.add(luzBombillo);

// Birrete de graduación: lo lleva en el horario de clase de Riwi (jornada noche).
const birrete = new THREE.Group();
birrete.position.set(0, .86, 0);
const telaBirrete = new THREE.MeshPhysicalMaterial({color: 0x1B2236, roughness: .55, clearcoat: .4});
const tapa = new THREE.Mesh(new THREE.BoxGeometry(.95, .04, .95), telaBirrete);
tapa.rotation.y = Math.PI / 4;
tapa.position.y = .14;
const copa = new THREE.Mesh(new THREE.CylinderGeometry(.3, .34, .16, 24), telaBirrete);
copa.position.y = .05;
const boton = new THREE.Mesh(new THREE.SphereGeometry(.04, 12, 10), luzSenal);
boton.position.y = .17;
const cordonArriba = new THREE.Mesh(new THREE.BoxGeometry(.44, .014, .014), luzSenal);
cordonArriba.position.set(.22, .17, 0);
const borla = new THREE.Group();            // cuelga del borde y se balancea como la antena
borla.position.set(.44, .17, 0);
const cordon = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .26, 8), luzSenal);
cordon.position.y = -.13;
const punta = new THREE.Mesh(new THREE.ConeGeometry(.045, .1, 10), luzSenal);
punta.position.y = -.3;
punta.rotation.x = Math.PI;
borla.add(cordon, punta);
birrete.add(tapa, copa, boton, cordonArriba, borla);
birrete.visible = false;
cabeza.add(birrete);

// ------------------------------------------------------------------ facetas
// Volt es el administrador del sitio y no se ve siempre igual. Según lo que dice se pone
// algo (casco, gafas, audífonos, traje de administrador…), su pantalla muestra código o
// íconos, y de vez en cuando cambia de ropa por arte de magia. Todo entra con un "puf".
const mat = (color, extra = {}) => new THREE.MeshPhysicalMaterial({color, roughness: .4, clearcoat: .6, ...extra});
const amarilloCasco = mat(0xF2B200, {roughness: .32, clearcoat: .8, emissive: 0x3A2600});
const telaFiesta = mat(0xFF6FB5);
const telaMago = mat(0x3B2A8C, {emissive: 0x140C3A});
const telaCapa = mat(0xD7263D, {side: THREE.DoubleSide, emissive: 0x2A0508});
const telaCorbata = mat(0x1F6FEB);
const vidrioGafas = new THREE.MeshPhysicalMaterial({color: 0x0A0F1A, roughness: .05, transparent: true, opacity: .35, clearcoat: 1});
const vidrioSol = new THREE.MeshPhysicalMaterial({color: 0x05070C, roughness: .05, metalness: .6, clearcoat: 1});
const estrellaMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0xF5C542).multiplyScalar(1.8), toneMapped: false});

// Gafete con el texto «ADMIN», dibujado en un canvas pequeño.
function texturaTexto(texto, fondo, color){
  const c = document.createElement('canvas'); c.width = 256; c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = fondo; g.beginPath(); g.roundRect(0, 0, 256, 96, 22); g.fill();
  g.fillStyle = color; g.font = '800 54px "Unbounded", "Geist", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(texto, 128, 52);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function crearVestuario(){
  const piezas = {};
  const poner = (nombre, padre, ...objs) => { objs.forEach(o => { o.visible = false; padre.add(o); }); piezas[nombre] = objs; };

  const casco = new THREE.Group();
  const domo = new THREE.Mesh(new THREE.SphereGeometry(.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), amarilloCasco);
  domo.scale.set(1, .62, 1);
  const ala = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, .05, 40), amarilloCasco);
  const cresta = new THREE.Mesh(new THREE.TorusGeometry(.58, .045, 8, 40, Math.PI), amarilloCasco);
  cresta.rotation.y = Math.PI / 2; cresta.scale.set(1, .62, 1);
  casco.add(domo, ala, cresta);
  casco.position.y = .82;
  poner('casco', cabeza, casco);

  const gafas = new THREE.Group();
  [-1, 1].forEach(l => {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(.12, .018, 10, 32), oscuro);
    aro.position.x = l * .145;
    const lente = new THREE.Mesh(new THREE.CircleGeometry(.115, 28), vidrioGafas);
    lente.position.set(l * .145, 0, -.005);
    gafas.add(aro, lente);
  });
  gafas.add(new THREE.Mesh(new THREE.TorusGeometry(.04, .014, 8, 16, Math.PI), oscuro));
  gafas.position.set(0, .47, .5);
  poner('gafas', cabeza, gafas);

  // Gafas de sol: una sola franja oscura y brillante sobre los ojos.
  const sol = new THREE.Group();
  const franjaSol = new THREE.Mesh(new RoundedBoxGeometry(.62, .17, .04, 3, .06), vidrioSol);
  const reflejo = new THREE.Mesh(new THREE.PlaneGeometry(.12, .025), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .7}));
  reflejo.position.set(-.16, .04, .025); reflejo.rotation.z = .3;
  sol.add(franjaSol, reflejo);
  sol.position.set(0, .47, .5);
  poner('sol', cabeza, sol);

  const audifonos = new THREE.Group();
  const diadema = new THREE.Mesh(new THREE.TorusGeometry(.6, .035, 10, 48, Math.PI), oscuro);
  diadema.position.y = .42;
  const desde = new THREE.Vector3(.6, .36, .04), hasta = new THREE.Vector3(.2, .24, .52);
  const microBrazo = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, desde.distanceTo(hasta), 8), metal);
  microBrazo.position.copy(desde).add(hasta).multiplyScalar(.5);
  microBrazo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hasta.clone().sub(desde).normalize());
  const micro = new THREE.Mesh(new THREE.SphereGeometry(.05, 14, 10), luzCian);
  micro.position.copy(hasta);
  audifonos.add(diadema, microBrazo, micro);
  poner('audifonos', cabeza, audifonos);

  const fiesta = new THREE.Group();
  fiesta.add(new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 28), telaFiesta));
  const franja = new THREE.Mesh(new THREE.TorusGeometry(.15, .02, 8, 28), luzSenal);
  franja.rotation.x = Math.PI / 2; franja.position.y = -.08;
  const pompon = new THREE.Mesh(new THREE.SphereGeometry(.07, 14, 10), luzSenal);
  pompon.position.y = .28;
  fiesta.add(franja, pompon);
  fiesta.position.set(-.18, 1.08, 0); fiesta.rotation.z = .25;
  poner('fiesta', cabeza, fiesta);

  // Mago: sombrero alto con estrellas y una varita en la mano derecha.
  const sombrero = new THREE.Group();
  const copa = new THREE.Mesh(new THREE.ConeGeometry(.38, .95, 32, 1), telaMago);
  copa.position.y = .45; copa.rotation.z = -.12;
  const alaMago = new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, .04, 40), telaMago);
  const cinta = new THREE.Mesh(new THREE.TorusGeometry(.355, .03, 8, 36), estrellaMat);
  cinta.rotation.x = Math.PI / 2; cinta.position.y = .06;
  sombrero.add(copa, alaMago, cinta);
  for(let i = 0; i < 6; i++){
    const e = new THREE.Mesh(new THREE.OctahedronGeometry(.04), estrellaMat);
    const a = i * 1.7, h = .15 + (i % 3) * .22;
    e.position.set(Math.cos(a) * (.33 - h * .3), h + .1, Math.sin(a) * (.33 - h * .3));
    sombrero.add(e);
  }
  sombrero.position.y = .84;
  const varita = new THREE.Group();
  const palo = new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, .5, 8), oscuro);
  palo.position.y = -.22;
  const punta = new THREE.Mesh(new THREE.OctahedronGeometry(.07), estrellaMat);
  punta.position.y = -.5;
  varita.add(palo, punta);
  varita.position.set(0, -.36, .05); varita.rotation.x = 2.5;
  poner('mago', cabeza, sombrero);
  brazoDer.add(varita); varita.visible = false; piezas.mago.push(varita);

  // Capa de superhéroe a la espalda, que ondea sola.
  const capa = new THREE.Mesh(new THREE.CylinderGeometry(.38, .6, .95, 28, 1, true, Math.PI * .58, Math.PI * .84), telaCapa);
  capa.position.set(0, -.8, -.02);
  const broche = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 10), estrellaMat);
  broche.position.set(0, -.42, .28);
  poner('capa', flota, capa, broche);

  // Traje de administrador del sitio: corbata y gafete «ADMIN».
  const corbata = new THREE.Group();
  const nudo = new THREE.Mesh(new RoundedBoxGeometry(.1, .08, .05, 2, .02), telaCorbata);
  const tira = new THREE.Mesh(new THREE.ConeGeometry(.075, .3, 4), telaCorbata);
  tira.rotation.set(Math.PI, Math.PI / 4, 0); tira.scale.z = .3; tira.position.y = -.18;
  corbata.add(nudo, tira);
  corbata.position.set(0, -.43, .27);
  const gafete = new THREE.Mesh(new THREE.PlaneGeometry(.26, .1), new THREE.MeshBasicMaterial({map: texturaTexto('ADMIN', '#F5C542', '#0A0F1A'), toneMapped: false, transparent: true}));
  gafete.position.set(.19, -.55, .266);
  poner('admin', flota, corbata, gafete);

  piezas.birrete = [birrete];
  return {piezas, capa, punta};
}
const vestuario = crearVestuario();
const SOMBREROS = new Set(['casco', 'fiesta', 'birrete', 'mago']);

let accesorio = null, accesorioHasta = 0, ultimaMagia = 0, proximoCambio = performance.now() + 22000;
let modoPantalla = null, modoHasta = 0, iconoPantalla = '';
const lluvia = Array.from({length: 18}, (_, i) => ({x: 10 + i * 28, y: Math.random() * 368, v: 70 + Math.random() * 110}));

function puf(n = 26){
  explotarChispas(n);
  r.salto.empujar(-5);
}
function vestir(nombre, segundos = 6){
  if(!vestuario.piezas[nombre]) return;
  accesorioHasta = performance.now() + segundos * 1000;
  if(accesorio === nombre) return;
  quitarAccesorio(false);
  accesorio = nombre;
  vestuario.piezas[nombre].forEach(o => {
    o.visible = true;
    o.scale.setScalar(.01);
    gsap.to(o.scale, {x: 1, y: 1, z: 1, duration: .55, ease: 'back.out(2.4)'});
  });
  // Los sombreros reemplazan la antena (y el birrete de la noche) mientras están puestos.
  if(SOMBREROS.has(nombre)){ antena.visible = false; if(nombre !== 'birrete') birrete.visible = false; }
  if(!MENOS_MOVIMIENTO) r.giro.meta += Math.PI * 2;
  puf();
}
function quitarAccesorio(restaurar = true){
  if(!accesorio) return;
  const era = accesorio;
  accesorio = null;
  vestuario.piezas[era].forEach(o => gsap.to(o.scale, {x: .01, y: .01, z: .01, duration: .3, ease: 'back.in(2)', onComplete: () => {
    if(accesorio !== era) o.visible = era === 'birrete' && momento === 'noche';
    o.scale.setScalar(1);
    if(!accesorio) aplicarMomento();
  }}));
  if(restaurar) explotarChispas(12);
}
function pantallaModo(modo, segundos = 4, icono = ''){
  modoPantalla = modo; iconoPantalla = icono;
  modoHasta = performance.now() + segundos * 1000;
}
function magia(){
  if(MENOS_MOVIMIENTO || performance.now() - ultimaMagia < 7000) return;
  ultimaMagia = performance.now();
  r.giro.meta += Math.PI * 2;
  r.salto.empujar(-10);
  explotarChispas(36);
}

// Lee lo que va a decir y decide cómo se presenta.
const FACETAS = [
  {re: /codig|program|github|repo|\bapi\b|stack|tecnolog|javascript|typescript|node|python|sql|backend|frontend|terminal|software|code/, hacer: () => { vestir('gafas', 7); pantallaModo('codigo', 7); }},
  {re: /proyect|sistema|automatiz|empresa|ingenier|cotizador|nomina|payroll|factura|invoice|alerta|tornillo|mantenimiento|maintenance|repar|production|produccion/, hacer: () => vestir('casco', 6)},
  {re: /equipo|team|jefe|boss|orden|order|sitio|site|portafolio|portfolio|bienvenid|welcome|asistente|assistant/, hacer: () => vestir('admin', 7)},
  {re: /riwi|estudi|study|aprend|learn|formaci|training|universi|carrera|clase|class/, hacer: () => { vestir('birrete', 6); pantallaModo('icono', 2.5, '🎓'); }},
  {re: /contact|correo|email|escrib|write|linkedin|contrat|hire|whatsapp|llam|call|reach/, hacer: () => { vestir('audifonos', 6); pantallaModo('icono', 2.5, '✉'); }},
  {re: /magia|magic|abracadabra|secreto|secret|truco|trick/, hacer: () => { vestir('mago', 7); magia(); }},
  {re: /chever|cool|genial|awesome|increible|amazing|wow/, hacer: () => vestir('sol', 6)},
  {re: /gracias|thank|baila|dance|fiesta|party|celebr|excelente|excellent|bonito/, hacer: () => { vestir('fiesta', 5); magia(); }},
  {re: /rapid|fast|poder|power|super|heroe|hero|salv|rescue/, hacer: () => vestir('capa', 6)}
];
function reaccionar(texto){
  const q = String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const f = FACETAS.find(x => x.re.test(q));
  if(f){ f.hacer(); return; }
  // Sin tema claro: a veces una vueltica, a veces la pantalla cambia un momento.
  const azar = Math.random();
  if(azar < .25) magia();
  else if(azar < .45) pantallaModo('icono', 1.8, ['⚡', '♥', '✓', '</>', '★'][Math.floor(Math.random() * 5)]);
}

// Cada tanto, sin que nadie se lo pida, Volt se cambia de ropa por arte de magia.
const CAMBIOS = ['mago', 'capa', 'admin', 'sol', 'gafas', 'audifonos', 'casco'];
const FRASES_CAMBIO = {
  mago: ['¡Abracadabra!', 'Abracadabra!'], capa: ['¡Súper Volt al rescate!', 'Super Volt to the rescue!'],
  admin: ['Modo administrador: revisando el sitio.', 'Admin mode: checking the site.'], sol: ['Hoy amanecí con estilo.', 'Feeling stylish today.']
};
function cambioDeRopa(){
  const ahora = performance.now();
  if(ahora < proximoCambio) return;
  proximoCambio = ahora + 25000 + Math.random() * 20000;
  if(hablando || accesorio || !chatPanel.hidden || window.Equipo?.ocupado || momento === 'madrugada') return;
  despertar();
  const nombre = CAMBIOS[Math.floor(Math.random() * CAMBIOS.length)];
  if(!MENOS_MOVIMIENTO){ ultimaMagia = 0; magia(); }
  setTimeout(() => {
    vestir(nombre, 10);
    const f = FRASES_CAMBIO[nombre];
    if(f && Math.random() < .6) setTimeout(() => decir(esEN() ? f[1] : f[0], {expresion: 'feliz', segundos: 2.5}), 500);
  }, 350);
}

const puntaMundo = new THREE.Vector3();
function actualizarFacetas(t){
  const ahora = performance.now();
  if(accesorio && ahora > accesorioHasta) quitarAccesorio();
  if(modoPantalla && ahora > modoHasta) modoPantalla = null;
  if(accesorio === 'capa') vestuario.capa.rotation.x = Math.sin(t * 3) * .08 - Math.min(Math.abs(r.x.v) * .02, .35);
  // La varita del mago suelta brillitos.
  if(accesorio === 'mago' && Math.random() < .3){
    vestuario.punta.getWorldPosition(puntaMundo);
    const k = Math.floor(Math.random() * CHISPAS);
    chispaVida[k] = .7;
    chispaPos[k * 3] = puntaMundo.x; chispaPos[k * 3 + 1] = puntaMundo.y; chispaPos[k * 3 + 2] = 0;
    chispaVel[k * 3] = (Math.random() - .5) * 1.2; chispaVel[k * 3 + 1] = Math.random() * 1.2; chispaVel[k * 3 + 2] = 0;
  }
  cambioDeRopa();
}

// ------------------------------------------------------------------ hora de Colombia
// Igual que en el perfil de GitHub: de mañana saluda, de noche va a clase, de madrugada duerme.
// ?hora=23 en la URL permite ver cada momento sin esperar.
const horaForzada = new URLSearchParams(location.search).get('hora');
function horaColombia(){
  return horaForzada !== null ? +horaForzada : +new Intl.DateTimeFormat('en-US', {timeZone: 'America/Bogota', hour: 'numeric', hour12: false}).format(new Date()) % 24;
}
function momentoColombia(){
  const h = horaColombia();
  return h >= 5 && h < 12 ? 'manana' : h >= 12 && h < 18 ? 'tarde' : h >= 18 && h < 22 ? 'noche' : 'madrugada';
}
function horaTexto(){
  if(horaForzada !== null) return `${horaForzada}:00`;
  return new Intl.DateTimeFormat(esEN() ? 'en-US' : 'es-CO', {timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit'}).format(new Date());
}
let momento = momentoColombia();
function aplicarMomento(){
  birrete.visible = momento === 'noche' || accesorio === 'birrete';
  antena.visible = !birrete.visible && !SOMBREROS.has(accesorio);
}
aplicarMomento();
setInterval(() => { momento = momentoColombia(); aplicarMomento(); }, 60000);

// Sombra suave proyectada debajo.
const sombraTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(63,208,255,.55)'); gr.addColorStop(1, 'rgba(63,208,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const sombra = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .5), new THREE.MeshBasicMaterial({map: sombraTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending}));
sombra.position.y = -1.55;
raiz.add(sombra);

// ------------------------------------------------------------------ estado
const r = {
  x: new Resorte(0, 60, 13), y: new Resorte(0, 60, 13), escala: new Resorte(.001, 90, 12),
  yaw: new Resorte(0, 120, 14), pitch: new Resorte(0, 120, 14), roll: new Resorte(0, 100, 10),
  giro: new Resorte(0, 40, 9), salto: new Resorte(0, 160, 10),
  antX: new Resorte(0, 60, 3.5), antZ: new Resorte(0, 60, 3.5),
  bIzqZ: new Resorte(.15, 120, 12), bIzqX: new Resorte(0, 120, 12),
  bDerZ: new Resorte(-.15, 120, 12), bDerX: new Resorte(0, 120, 12),
  mirarX: new Resorte(0, 200, 20), mirarY: new Resorte(0, 200, 20)
};
let expresion = 'normal', expresionHasta = 0;
let gesto = null, gestoInicio = 0;
let hablando = 0, parpadeo = 0, proximoParpadeo = 1.5;
let ultimoMovimiento = performance.now();
let encima = false, clicsRapidos = [];
let visibleIntro = false;

const puntero = {x: innerWidth * .5, y: innerHeight * .5};
addEventListener('pointermove', e => {
  puntero.x = e.clientX; puntero.y = e.clientY;
  if(expresion === 'dormido') ponerExpresion('sorpresa', 1.2);
  ultimoMovimiento = performance.now();
}, {passive: true});

function ponerExpresion(nombre, segundos = 2){
  expresion = nombre;
  expresionHasta = segundos ? performance.now() + segundos * 1000 : Infinity;
}
function hacerGesto(nombre){ gesto = nombre; gestoInicio = performance.now(); }
// Por un rato mira hacia un punto de la pantalla en vez de seguir el puntero.
let mirada = null, miradaHasta = 0;
function mirarA(x, y, segundos = 2.5){ mirada = {x, y}; miradaHasta = performance.now() + segundos * 1000; despertar(); }

// ------------------------------------------------------------------ cara
function rr(x, y, w, h, rad){
  cx.beginPath(); cx.roundRect(x - w / 2, y - h / 2, w, h, rad); cx.fill();
}
function corazon(x, y, s){
  cx.beginPath();
  cx.moveTo(x, y + s * .35);
  cx.bezierCurveTo(x - s, y - s * .35, x - s * .45, y - s * 1.05, x, y - s * .45);
  cx.bezierCurveTo(x + s * .45, y - s * 1.05, x + s, y - s * .35, x, y + s * .35);
  cx.fill();
}
function dibujarCara(t){
  const W = 512, H = 368;
  cx.setTransform(caraCanvas.width / W, 0, 0, caraCanvas.height / H, 0, 0);
  cx.clearRect(0, 0, W, H);
  // Fondo de la pantalla con brillo y líneas de barrido.
  cx.save();
  cx.beginPath(); cx.roundRect(0, 0, W, H, 70); cx.clip();
  const fondo = cx.createRadialGradient(W / 2, H * .45, 10, W / 2, H / 2, W * .7);
  fondo.addColorStop(0, '#0C2033'); fondo.addColorStop(1, '#03070D');
  cx.fillStyle = fondo; cx.fillRect(0, 0, W, H);
  cx.fillStyle = 'rgba(63,208,255,.05)';
  for(let y = (t * 40) % 8; y < H; y += 8) cx.fillRect(0, y, W, 2);

  const c = '#62EEFF';
  cx.fillStyle = c; cx.strokeStyle = c;
  cx.shadowColor = '#3FD0FF'; cx.shadowBlur = 16;
  cx.lineCap = 'round'; cx.lineJoin = 'round';

  const mx = r.mirarX.x * 34, my = r.mirarY.x * 22;
  const ox = W / 2 + mx, oy = H * .44 + my, sep = 92;
  const abierto = 1 - parpadeo;

  if(modoPantalla === 'codigo'){
    // Lluvia de ceros y unos detrás de los ojos: Volt está programando.
    const dtc = Math.min(t - (dibujarCara.t ?? t), .1); dibujarCara.t = t;
    cx.save(); cx.shadowBlur = 0; cx.font = '700 25px "Geist Mono", monospace';
    lluvia.forEach((g, i) => {
      g.y = (g.y + g.v * dtc) % (H + 120);
      for(let k = 0; k < 5; k++){ cx.globalAlpha = .2 + k * .17; cx.fillText((i * 7 + k + Math.floor(t * 6)) % 3 ? '1' : '0', g.x, g.y - (4 - k) * 28); }
    });
    cx.restore();
  }
  if(modoPantalla === 'icono'){
    cx.font = '700 150px "Geist", sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(iconoPantalla, W / 2, H * .44 + Math.sin(t * 4) * 6);
    cx.textAlign = 'start'; cx.textBaseline = 'alphabetic';
  }else switch(expresion){
    case 'feliz':
      cx.lineWidth = 20;
      [-1, 1].forEach(s => { cx.beginPath(); cx.arc(ox + s * sep, oy + 16, 36, Math.PI * 1.1, Math.PI * 1.9); cx.stroke(); });
      break;
    case 'sorpresa':
      cx.lineWidth = 14;
      [-1, 1].forEach(s => { cx.beginPath(); cx.arc(ox + s * sep, oy, 40, 0, Math.PI * 2); cx.stroke(); rr(ox + s * sep, oy, 22, 22, 11); });
      break;
    case 'amor':
      [-1, 1].forEach(s => corazon(ox + s * sep, oy + 6, 46 + Math.sin(t * 8) * 5));
      break;
    case 'mareado':
      cx.lineWidth = 9;
      [-1, 1].forEach(s => {
        cx.beginPath();
        for(let a = 0; a < 14; a += .2){ const rad = a * 3; const ang = a + t * 6 * s; cx.lineTo(ox + s * sep + Math.cos(ang) * rad, oy + Math.sin(ang) * rad); }
        cx.stroke();
      });
      break;
    case 'dormido':
      cx.lineWidth = 14;
      [-1, 1].forEach(s => { cx.beginPath(); cx.moveTo(ox + s * sep - 34, oy + 8); cx.lineTo(ox + s * sep + 34, oy + 8); cx.stroke(); });
      cx.font = '700 46px "Geist Mono", monospace';
      cx.fillText('z', W * .78, H * .28 - (t * 10 % 20));
      cx.font = '700 30px "Geist Mono", monospace';
      cx.fillText('z', W * .86, H * .16 - (t * 10 % 20));
      break;
    case 'guino':
      rr(ox - sep, oy, 62, 86 * abierto + 8, 26);
      cx.lineWidth = 16; cx.beginPath(); cx.arc(ox + sep, oy + 16, 34, Math.PI * 1.1, Math.PI * 1.9); cx.stroke();
      break;
    case 'pensando':
      rr(ox - sep + 14, oy - 14, 56, 70 * abierto + 8, 24);
      rr(ox + sep + 14, oy - 14, 56, 70 * abierto + 8, 24);
      [0, 1, 2].forEach(i => { cx.globalAlpha = .35 + .65 * ((Math.sin(t * 5 - i) + 1) / 2); rr(W * .7 + i * 28, H * .2, 14, 14, 7); });
      cx.globalAlpha = 1;
      break;
    default: // normal
      rr(ox - sep, oy, 64, 92 * abierto + 8, 28);
      rr(ox + sep, oy, 64, 92 * abierto + 8, 28);
      // Brillo en el ojo.
      cx.shadowBlur = 0; cx.fillStyle = 'rgba(255,255,255,.75)';
      if(abierto > .5){ rr(ox - sep - 14, oy - 22, 14, 18, 7); rr(ox + sep - 14, oy - 22, 14, 18, 7); }
      cx.fillStyle = c; cx.shadowBlur = 16;
  }

  // Mejillas.
  if(expresion === 'feliz' || expresion === 'amor' || encima){
    cx.shadowBlur = 0; cx.fillStyle = 'rgba(255,110,170,.35)';
    [-1, 1].forEach(s => { cx.beginPath(); cx.ellipse(ox + s * (sep + 52), oy + 52, 34, 16, 0, 0, Math.PI * 2); cx.fill(); });
    cx.fillStyle = c; cx.shadowBlur = 16;
  }

  // Boca.
  const by = H * .78 + my * .5, bx = W / 2 + mx * .5;
  if(hablando > 0){
    const abre = 10 + Math.abs(Math.sin(t * 22) * Math.sin(t * 9)) * 34;
    rr(bx, by, 70, abre, 14);
  }else if(expresion === 'sorpresa'){
    cx.lineWidth = 10; cx.beginPath(); cx.arc(bx, by, 16, 0, Math.PI * 2); cx.stroke();
  }else if(expresion === 'mareado'){
    cx.lineWidth = 9; cx.beginPath();
    for(let x = -40; x <= 40; x += 4) cx.lineTo(bx + x, by + Math.sin(x * .25 + t * 10) * 7);
    cx.stroke();
  }else if(expresion !== 'dormido'){
    cx.lineWidth = 10; cx.beginPath(); cx.arc(bx, by - 26, 30, Math.PI * .2, Math.PI * .8); cx.stroke();
  }
  cx.restore();
  caraTex.needsUpdate = true;
}

// ------------------------------------------------------------------ sonido
// Pitidos sintetizados al hablar. Usa el audio que main.js abre con la primera interacción.
function pitar(){
  const audio = window.__audio;
  if(!audio) return;
  try{
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = 'square';
    const f = 520 + Math.random() * 900;
    o.frequency.setValueAtTime(f, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(f * (Math.random() < .5 ? 1.6 : .6), audio.currentTime + .07);
    g.gain.setValueAtTime(.035, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .09);
    o.connect(g).connect(audio.destination);
    o.start(); o.stop(audio.currentTime + .1);
  }catch(e){}
}

// ------------------------------------------------------------------ burbuja de diálogo
let escribiendo = null, ocultarBurbuja = null, tamBurbuja = {w: 260, h: 60};
function decir(texto, {expresion: ex = null, segundos = 4.5, gesto: ge = null} = {}){
  if(!texto) return;
  if(expresion === 'dormido') expresion = 'normal';   // hablar lo despierta
  clearInterval(escribiendo); clearTimeout(ocultarBurbuja);
  if(ex) ponerExpresion(ex, segundos);
  if(ge) hacerGesto(ge);
  reaccionar(texto);
  // Se mide el globo con el texto completo una sola vez; así el bucle no fuerza
  // al navegador a recalcular el diseño en cada cuadro.
  burbuja.textContent = texto;
  tamBurbuja = {w: burbuja.offsetWidth || 260, h: burbuja.offsetHeight || 60};
  burbuja.textContent = '';
  burbuja.classList.add('visible');
  let i = 0;
  hablando = 1;
  escribiendo = setInterval(() => {
    burbuja.textContent = texto.slice(0, ++i);
    if(i % 3 === 0) pitar();
    if(i >= texto.length){
      clearInterval(escribiendo);
      hablando = 0;
      ocultarBurbuja = setTimeout(() => burbuja.classList.remove('visible'), segundos * 1000);
    }
  }, 24);
}
function callar(){ clearInterval(escribiendo); clearTimeout(ocultarBurbuja); hablando = 0; burbuja.classList.remove('visible'); }

// Hablar en el chat también mueve la boca.
let finHabla = null;
function hablarPor(ms){
  hablando = 1;
  clearTimeout(finHabla);
  finHabla = setTimeout(() => { hablando = 0; }, ms);
  const pitidos = setInterval(pitar, 90);
  setTimeout(() => clearInterval(pitidos), ms);
}

// ------------------------------------------------------------------ reacciones
function alClic(){
  const ahora = performance.now();
  clicsRapidos = clicsRapidos.filter(t => ahora - t < 2500);
  clicsRapidos.push(ahora);
  r.salto.empujar(-9);
  r.giro.meta += Math.PI * 2;
  explotarChispas(28);
  if(clicsRapidos.length >= 5){
    clicsRapidos = [];
    decir(esEN() ? 'Whoa… everything is spinning.' : 'Uy… todo me da vueltas.', {expresion: 'mareado', segundos: 3});
    return false;
  }
  return true;
}

function explotarChispas(n){
  for(let i = 0; i < n; i++){
    const k = Math.floor(Math.random() * CHISPAS);
    chispaVida[k] = 1;
    chispaPos[k * 3] = raiz.position.x; chispaPos[k * 3 + 1] = raiz.position.y; chispaPos[k * 3 + 2] = 0;
    const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 2.5;
    chispaVel[k * 3] = Math.cos(a) * v; chispaVel[k * 3 + 1] = Math.sin(a) * v; chispaVel[k * 3 + 2] = 0;
  }
}

// ------------------------------------------------------------------ posición en pantalla
const ndc = new THREE.Vector3(), dir = new THREE.Vector3();
function mundoDesdePantalla(px, py, out){
  ndc.set(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1, .5).unproject(camara);
  dir.copy(ndc).sub(camara.position).normalize();
  const d = -camara.position.z / dir.z;
  return out.copy(camara.position).addScaledVector(dir, d);
}
const altoVisible = () => 2 * camara.position.z * Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
const ALTO_VOLT = 2.25; // unidades de mundo de la punta de la antena a la llama

// Dónde vive Volt: grande en el hero, pequeño en la esquina al bajar.
function puestos(){
  const movil = innerWidth < 760;
  return {
    hero: movil ? {x: innerWidth * .5, y: innerHeight * .25, alto: Math.min(220, innerHeight * .28)}
                : {x: innerWidth * .73, y: innerHeight * .44, alto: Math.min(360, innerHeight * .46)},
    esquina: movil ? {x: innerWidth - 58, y: innerHeight - 84, alto: 104}
                   : {x: innerWidth - 104, y: innerHeight - 128, alto: 150}
  };
}
const suave = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
const objetivoMundo = new THREE.Vector3();
let pantallaVolt = {x: 0, y: 0, alto: 0};

function ajustar(){
  // En equipos modestos Volt se dibuja a menor resolución; casi no se nota y libera la tarjeta gráfica.
  renderer.setPixelRatio(Math.min(devicePixelRatio, MODESTO ? 1.25 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  camara.aspect = innerWidth / innerHeight;
  camara.updateProjectionMatrix();
}
addEventListener('resize', ajustar);
ajustar();

// ------------------------------------------------------------------ paseos
// Volt no se queda siempre en el mismo sitio: cada tanto vuela a otro lugar un rato y vuelve.
const paseo = {x: 0, y: 0, esquina: false}, paseoSuave = {x: 0, y: 0};
let proximoPaseo = performance.now() + 28000;
function decidirPaseo(enEsquina){
  const ahora = performance.now();
  if(paseo.esquina !== enEsquina){ paseo.x = paseo.y = 0; paseo.esquina = enEsquina; }
  if(ahora < proximoPaseo || window.Equipo?.ocupado || hablando || !chatPanel.hidden) return;
  const fuera = paseo.x || paseo.y;
  proximoPaseo = ahora + (fuera ? 16000 + Math.random() * 18000 : 9000 + Math.random() * 5000);
  if(fuera){ paseo.x = paseo.y = 0; return; }
  const movil = innerWidth < 760;
  const opciones = enEsquina
    ? [{x: -(innerWidth - (movil ? 116 : 208)), y: 0}, {x: 0, y: -innerHeight * .34}, {x: -innerWidth * .4, y: -innerHeight * .1}]
    : [{x: -innerWidth * .05, y: innerHeight * .05}, {x: innerWidth * .04, y: -innerHeight * .05}];
  Object.assign(paseo, opciones[Math.floor(Math.random() * opciones.length)]);
  // Si estaba dormido, se despierta para ir a dar la vuelta.
  despertar();
}
function despertar(){
  ultimoMovimiento = performance.now();
  if(expresion === 'dormido') ponerExpresion('feliz', 1.5);
}

// ------------------------------------------------------------------ bucle
const reloj = new THREE.Clock();
let velScroll = 0, scrollPrevio = scrollY;

function cuadro(){
  requestAnimationFrame(cuadro);
  const dt = Math.min(reloj.getDelta(), .05);
  const t = reloj.elapsedTime;
  const ahora = performance.now();

  // Scroll: posición entre hero y esquina, y velocidad para inclinarse.
  const s = scrollY / innerHeight;
  velScroll = THREE.MathUtils.lerp(velScroll, (scrollY - scrollPrevio) / Math.max(dt, .001), .15);
  scrollPrevio = scrollY;
  const p = suave(.12, .75, s);
  const {hero, esquina} = puestos();
  pantallaVolt = {
    x: hero.x + (esquina.x - hero.x) * p,
    y: hero.y + (esquina.y - hero.y) * p,
    alto: hero.alto + (esquina.alto - hero.alto) * p
  };
  decidirPaseo(p > .5);
  paseoSuave.x += (paseo.x - paseoSuave.x) * Math.min(dt * 1.4, 1);
  paseoSuave.y += (paseo.y - paseoSuave.y) * Math.min(dt * 1.4, 1);
  pantallaVolt.x += paseoSuave.x; pantallaVolt.y += paseoSuave.y;
  // Con el chat abierto, Volt se acomoda al lado (o encima en celular) para seguir a la vista.
  if(!chatPanel.hidden){
    const c = chatPanel.getBoundingClientRect();
    pantallaVolt = c.left > 200
      ? {x: c.left - 80, y: c.bottom - 110, alto: 170}
      : {x: c.right - 60, y: Math.max(c.top - 50, 70), alto: 96};
  }
  mundoDesdePantalla(pantallaVolt.x, pantallaVolt.y, objetivoMundo);
  r.x.meta = objetivoMundo.x; r.y.meta = objetivoMundo.y;
  r.escala.meta = visibleIntro ? pantallaVolt.alto / innerHeight * altoVisible() / ALTO_VOLT : .001;

  // Puntero: hacia dónde mira la cabeza y los ojos.
  const foco = ahora < miradaHasta ? mirada : puntero;
  const dx = (foco.x - pantallaVolt.x) / innerWidth, dy = (foco.y - pantallaVolt.y) / innerHeight;
  r.yaw.meta = THREE.MathUtils.clamp(dx * 1.6, -.7, .7);
  r.pitch.meta = THREE.MathUtils.clamp(dy * 1.2, -.45, .5);
  r.mirarX.meta = THREE.MathUtils.clamp(dx * 3, -1, 1);
  r.mirarY.meta = THREE.MathUtils.clamp(dy * 3, -1, 1);
  r.roll.meta = THREE.MathUtils.clamp(-velScroll / 4000 - r.x.v * .04, -.4, .4);
  if(Math.abs(velScroll) > 2600 && expresion === 'normal') ponerExpresion('sorpresa', .8);

  // Encima del puntero.
  const dist = Math.hypot(puntero.x - pantallaVolt.x, puntero.y - (pantallaVolt.y - pantallaVolt.alto * .15));
  encima = dist < pantallaVolt.alto * .42;

  // Inactividad: se duerme. De madrugada se duerme casi enseguida.
  const limiteSueno = momento === 'madrugada' ? 4000 : 14000;
  if(ahora - ultimoMovimiento > limiteSueno && expresion === 'normal' && !hablando && !window.Equipo?.ocupado) ponerExpresion('dormido', 0);
  if(expresion !== 'normal' && ahora > expresionHasta) expresion = 'normal';

  // Parpadeo natural.
  proximoParpadeo -= dt;
  if(proximoParpadeo <= 0){ parpadeo = 1; proximoParpadeo = 2 + Math.random() * 3.5; }
  parpadeo = Math.max(parpadeo - dt * 9, 0);

  // Gestos con los brazos.
  const g = (ahora - gestoInicio) / 1000;
  let bIz = .15 + Math.sin(t * 1.6) * .06, bDz = -.15 - Math.sin(t * 1.6 + 1) * .06, bIx = 0, bDx = 0;
  if(gesto === 'saludar'){ bDz = -2.5 + Math.sin(g * 14) * .45; if(g > 2.2) gesto = null; }
  else if(gesto === 'celebrar'){ bIz = 2.6 + Math.sin(g * 16) * .25; bDz = -2.6 - Math.sin(g * 16) * .25; if(g > 2) gesto = null; }
  else if(gesto === 'senalar'){ bDz = -1.5; bDx = -.5; if(g > 2.4) gesto = null; }
  else if(gesto === 'pensar'){ bDz = -.6; bDx = -1.9; if(g > 3) gesto = null; }
  else if(gesto === 'bailar'){
    bIz = 1.2 + Math.sin(g * 10) * 1.1; bDz = -1.2 - Math.cos(g * 10) * 1.1;
    r.roll.meta = Math.sin(g * 5) * .35; r.giro.meta = Math.sin(g * 2.5) * .8;
    if(g > 4){ gesto = null; r.giro.meta = 0; }
  }
  if(encima && !gesto){ bDz = -.5 + Math.sin(t * 9) * .2; }
  r.bIzqZ.meta = bIz; r.bDerZ.meta = bDz; r.bIzqX.meta = bIx; r.bDerX.meta = bDx;

  // Pasos de resortes.
  for(const k in r) r[k].paso(dt);

  // Aplicar.
  const bob = MENOS_MOVIMIENTO ? 0 : Math.sin(t * 2) * .08;
  raiz.position.set(r.x.x, r.y.x, 0);
  raiz.scale.setScalar(Math.max(r.escala.x, .001));
  flota.position.y = bob + r.salto.x * .04;
  flota.rotation.set(Math.sin(t * 1.3) * .03, r.giro.x, r.roll.x + Math.sin(t * 1.1) * .03);
  cabeza.rotation.set(r.pitch.x, r.yaw.x, -r.roll.x * .5);
  brazoIzq.rotation.set(r.bIzqX.x, 0, r.bIzqZ.x);
  brazoDer.rotation.set(r.bDerX.x, 0, r.bDerZ.x);

  // La antena se queda atrás del movimiento de la cabeza (inercia).
  r.antZ.empujar(-r.yaw.v * .02 - r.x.v * .03);
  r.antX.empujar(r.pitch.v * .02 + r.y.v * .02);
  antena.rotation.set(r.antX.x, 0, r.antZ.x);
  borla.rotation.set(r.antX.x * 1.4, 0, r.antZ.x * 1.4);

  // Luces vivas. Dormido, todo brilla menos y late más despacio.
  const dormido = expresion === 'dormido';
  const latido = .5 + .5 * Math.sin(t * (dormido ? 1.2 : 3));
  const brillo = dormido ? .35 : 1;
  pechoNucleo.material.color.setHex(0x3FD0FF).multiplyScalar((.8 + latido * 1.4 + (hablando ? 1 : 0)) * brillo);
  bombillo.material.color.setHex(0xF5C542).multiplyScalar((1.2 + latido * .8) * brillo);
  luzBombillo.intensity = (1 + latido) * brillo;
  llama.scale.set(1 + Math.random() * .15, .8 + Math.random() * .5 + Math.abs(r.salto.v) * .02, 1);
  llama.material.opacity = .6 + Math.random() * .3;
  sombra.material.opacity = .5 + bob;

  // Chispas del propulsor y de los clics.
  for(let i = 0; i < CHISPAS; i++){
    if(chispaVida[i] <= 0){
      if(Math.random() < .25){
        chispaVida[i] = .6 + Math.random() * .4;
        const base = new THREE.Vector3(0, -1.32, 0).applyMatrix4(flota.matrixWorld);
        chispaPos[i * 3] = base.x + (Math.random() - .5) * .1 * raiz.scale.x;
        chispaPos[i * 3 + 1] = base.y; chispaPos[i * 3 + 2] = 0;
        chispaVel[i * 3] = (Math.random() - .5) * .4; chispaVel[i * 3 + 1] = -1.4 - Math.random(); chispaVel[i * 3 + 2] = 0;
      }
      continue;
    }
    chispaVida[i] -= dt * 1.6;
    chispaPos[i * 3] += chispaVel[i * 3] * dt * raiz.scale.x;
    chispaPos[i * 3 + 1] += chispaVel[i * 3 + 1] * dt * raiz.scale.x;
    if(chispaVida[i] <= 0) chispaPos[i * 3 + 1] = 999;
  }
  chispaGeo.attributes.position.needsUpdate = true;
  chispas.material.size = .05 * Math.max(raiz.scale.x, .3);

  // La cara se redibuja a 30 cuadros por segundo: a simple vista es igual y cuesta la mitad.
  actualizarFacetas(t);
  if(++cuadrosCara % 2 === 0) dibujarCara(t);
  renderer.render(escena, camara);

  // Zona clicable y burbuja siguen a Volt. Solo se tocan los estilos que cambian.
  const alto = pantallaVolt.alto;
  poner(hit, 'transform', `translate(${Math.round(pantallaVolt.x - alto * .36)}px, ${Math.round(pantallaVolt.y - alto * .55)}px)`);
  const lado = `${Math.round(alto * .72)}px`;
  poner(hit, 'width', lado); poner(hit, 'height', lado);
  // El globo va a la derecha si cabe; si no, a la izquierda. Nunca se sale de la pantalla.
  // En el hero el globo va centrado sobre la cabeza, donde no tapa el texto.
  const enHero = p < .5 && chatPanel.hidden;
  const izquierda = !enHero && innerWidth - (pantallaVolt.x + alto * .3) < tamBurbuja.w + 16;
  const bx = enHero ? pantallaVolt.x - tamBurbuja.w / 2 : izquierda ? pantallaVolt.x - alto * .3 - tamBurbuja.w : pantallaVolt.x + alto * .3;
  const by = enHero ? pantallaVolt.y - alto * .62 : pantallaVolt.y - alto * .3;
  burbuja.classList.toggle('a-la-izquierda', izquierda);
  burbuja.classList.toggle('arriba', enHero);
  poner(burbuja, '--bx', `${Math.round(Math.min(Math.max(bx, 12), innerWidth - tamBurbuja.w - 12))}px`);
  poner(burbuja, '--by', `${Math.round(Math.max(by, tamBurbuja.h + 76))}px`);
  hit.classList.toggle('encima', encima);
}
let cuadrosCara = 0;
function poner(el, prop, valor){
  el._ultimo = el._ultimo || {};
  if(el._ultimo[prop] === valor) return;
  el._ultimo[prop] = valor;
  el.style.setProperty(prop, valor);
}
cuadro();

// ------------------------------------------------------------------ eventos
hit.addEventListener('click', () => {
  const sigue = alClic();
  dispatchEvent(new CustomEvent('volt-clic', {detail: {abrirChat: sigue}}));
});
hit.addEventListener('pointerenter', () => { if(expresion === 'normal') ponerExpresion('feliz', 1.5); });

// Entrada: vuela desde abajo, gira y saluda. Este módulo se carga cuando termina la
// intro de la página, así que casi siempre la intro ya ocurrió al llegar aquí.
function entrar(){
  r.y.x = r.y.meta - 6;
  r.giro.meta = Math.PI * 2;
  if(momento === 'madrugada') ponerExpresion('dormido', 0);
  setTimeout(() => {
    visibleIntro = true;
    setTimeout(saludarSegunLaHora, 700);
  }, 600);
}
if(window.__introHecha) entrar(); else addEventListener('intro', entrar, {once: true});

function saludarSegunLaHora(){
  const en = esEN(), h = horaTexto();
  const saludos = {
    manana: [en ? 'Good morning! I’m Volt, Leonardo’s assistant. Click me to chat.' : '¡Buenos días! Soy Volt, el asistente de Leonardo. Haz clic en mí para hablar.', 'feliz', 'saludar'],
    tarde: [en ? 'Hi! I’m Volt, Leonardo’s assistant. Click me to chat.' : '¡Hola! Soy Volt, el asistente de Leonardo. Haz clic en mí para hablar.', 'feliz', 'saludar'],
    noche: [en ? `Good evening! It’s ${h} in Colombia and Leonardo is in class at Riwi. I’ve got you covered.` : `¡Buenas noches! Son las ${h} en Colombia y Leonardo está en clase en Riwi. Yo te atiendo.`, 'guino', 'saludar'],
    madrugada: [en ? `Zzz… oh, hi! It’s ${h} in Colombia and Leonardo is asleep. I can still help you.` : `Zzz… ¡ah, hola! Son las ${h} en Colombia y Leonardo duerme. Igual yo te atiendo.`, 'sorpresa', null]
  };
  const [texto, ex, ge] = saludos[momento];
  decir(texto, {expresion: ex, gesto: ge, segundos: 6});
}

// Código Konami: baile.
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konami = 0;
addEventListener('keydown', e => {
  konami = e.key === KONAMI[konami] ? konami + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if(konami === KONAMI.length){
    konami = 0;
    hacerGesto('bailar'); explotarChispas(36);
    decir(esEN() ? 'Secret code unlocked!' : '¡Código secreto desbloqueado!', {expresion: 'amor', segundos: 4});
  }
});

// API para el resto de la página.
window.Volt = {
  decir, callar, hacerGesto, ponerExpresion, hablarPor, reaccionar, vestir, pantallaModo, magia, mirarA,
  posicion: () => ({...pantallaVolt}),
  get momento(){ return momento; }, horaTexto,
  celebrar(){ hacerGesto('celebrar'); explotarChispas(36); r.salto.empujar(-8); },
  bailar(){ hacerGesto('bailar'); explotarChispas(20); }
};
dispatchEvent(new Event('volt-listo'));
