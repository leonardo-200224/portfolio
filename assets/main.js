// ===================================================================
// DATOS DE CONTACTO: lo que quede vacío ('') no se muestra en la página.
// ===================================================================
const CONTACTO = {
  correo:   'ayalaperezleonardo24@gmail.com',
  linkedin: 'https://www.linkedin.com/in/a-leonardo',
  github:   'https://github.com/leonardo-200224',
  whatsapp: '',   // solo números con indicativo, ej. '573001234567'
  cv:       ''    // ej. 'assets/Leonardo_Ayala_CV.pdf'
};
const USUARIO_GITHUB = 'leonardo-200224';

const $ = id => document.getElementById(id);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
const ANIMA = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const MENOS_MOVIMIENTO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PUNTERO_FINO = matchMedia('(hover: hover) and (pointer: fine)').matches;

// =================================================================== textos en inglés
const EN = {
  'saltar':'Skip to content','nav.aria':'Sections','nav.sobre':'About','nav.tray':'Journey','nav.proyectos':'Work','nav.contacto':'Contact',
  'volt.aria':'Talk to Volt, the assistant',
  'chat.sub':'Leonardo’s assistant · online','chat.cerrar':'Close chat','chat.label':'Type a question','chat.ph':'Ask me anything…','chat.enviar':'Send',
  'hero.pre':'Open to new projects','hero.rol':'Software Developer · Systems Engineering',
  'hero.lead1':'I turn manual processes into','hero.lead2':' that run on their own.',
  'hero.ver':'See my work','hero.terminal':'Open the terminal',
  'sobre.etq':'About me',
  'sobre.texto':'I’m Leonardo Iván Ayala Pérez, a software developer in Colombia. I work inside an electrical engineering company turning what the team used to do by hand into systems that run on their own, and I’m training at Riwi on the advanced Node.js track. I love mixing creativity and technology: many of my ideas come from movies or traveling.',
  'cifra.1':'public repositories on GitHub','cifra.2':'systems in production at a real company','cifra.3':'employees on the payroll my system calculates','cifra.4':'a service running on a Raspberry Pi',
  'esp.titulo':'What I do',
  'esp1.titulo':'Backend and automation',
  'esp1.texto':'APIs with Node.js, Express, NestJS, FastAPI and Flask; PostgreSQL databases; scheduled jobs and 24/7 Linux services that read, calculate and notify without anyone opening them.',
  'esp2.titulo':'Interfaces and tools',
  'esp2.texto':'SPAs in plain JavaScript and React, desktop apps with Electron, and tools the team uses every day, from a web panel to an Excel workbook with VBA.',
  'tray.etq':'Journey','tray.titulo':'My path','tray.intro':'From my first HTML and PHP pages to systems a company uses every day.',
  't1.fecha':'2023 – 2025','t1.titulo':'Systems Engineering and first projects','t1.texto':'Websites with HTML, CSS, PHP and MySQL, and a resource site for Systems Engineering students.',
  't2.fecha':'2026 · Riwi','t2.titulo':'Python and object-oriented programming','t2.texto':'Inventories, CSV file handling, Tkinter interfaces and a console ATM.',
  't3.fecha':'2026 · Riwi','t3.titulo':'Frontend, JavaScript and SPAs','t3.texto':'Sass, React, API consumption and single-page apps with their own router, roles and sessions.',
  't4.fecha':'2026 · Riwi','t4.titulo':'Databases and backend','t4.texto':'PostgreSQL, Node.js with TypeScript, Sequelize, Swagger and NestJS on the advanced Node.js track.',
  't5.fecha':'2026 – today','t5.titulo':'Developer at an electrical engineering company','t5.texto':'Cloud quoting app, AI invoice reader, biweekly payroll and staff expiration alerts.',
  'proy.etq':'In production','proy.titulo':'Real systems','proy.intro':'Four systems an electrical engineering company uses every day. The code is private; here’s what each one solved.','proy.desliza':'Keep scrolling',
  'c1.titulo':'Web quoting app','c1.texto':'Every quote used to be built in Excel and the price depended on who made it. Now there’s one catalog, salesperson and admin roles, and the official PDF in a couple of clicks.',
  'c2.titulo':'Invoice reader with supervised AI','c2.aprobada':'approved','c2.texto':'Every 15 minutes it reads new invoices and updates the expense sheet. Known suppliers are read with rules; only new formats go through AI, and nothing gets in until a person approves it.',
  'c3.titulo':'Biweekly payroll','c3.col1':'Employee','c3.col2':'Net','c3.cuadra':'match the real payroll','c3.tag':'Manual and training',
  'c3.texto':'You enter the period’s events and the system calculates salary, surcharges, overtime, health, pension and net pay. Checked against a real pay period: all 55 net amounts match, within 50 cents.',
  'c4.titulo':'Expiration alerts','c4.tag':'Scheduled tasks','c4.v1':'Medical exam','c4.v2':'Heights course','c4.v3':'Contract','c4.v4':'Work gear',
  'c4.texto':'On a job site, an expired medical exam or heights course means someone can’t work. Now the system checks every day, emails a warning before anything expires and issues employment certificates.',
  'web.etq':'Web design & development','web.titulo':'Sites for real businesses',
  'web.intro':'Designed and built from scratch for small businesses. These are real screenshots; brands are hidden to protect each client’s privacy.',
  'web.pista':'Hover to pause the scroll','real.sello':'Real screenshot · sample data','real.sello2':'Real workbook · fictional employees','real.sello3':'Real workbook · fictional staff',
  'gh.etq':'Open source','gh.titulo':'On my GitHub','gh.filtrar':'Filter projects','gh.todos':'All','gh.vertodos':'See all 48 repositories',
  'term.etq':'Interactive','term.titulo':'Ask the terminal','term.intro':'Type a command or tap one of the buttons. Try help.',
  'herr.etq':'Tools','herr.titulo':'What I build with','herr.pista':'Drag the sphere to spin it','herr.filtrar':'Filter by area',
  'cont.etq':'Contact','cont.grande':'LET’S TALK',
  'cont.texto':'Got a process that’s still done by hand, or a developer role? Write to me and I’ll tell you what I’d build and how long it would take.',
  'pie.volt':'Volt is made with Three.js. Try the Konami code.','pie.arriba':'Back to top',
  'canal.correo':'Email me','canal.linkedin':'LinkedIn','canal.github':'GitHub','canal.whatsapp':'WhatsApp','canal.cv':'Download CV',
  'caso.ver':'View case study','caso.prev':'Previous case','caso.next':'Next case','caso.cerrar':'Close case','caso.codigo':'View code',
  'sim.datos':'Data at this step','sim.log':'System log','sim.ayuda':'← → to step · space to pause'
};
const ES = {'canal.correo':'Escríbeme','canal.linkedin':'LinkedIn','canal.github':'GitHub','canal.whatsapp':'WhatsApp','canal.cv':'Descargar hoja de vida'};
const PALABRAS = {es:['sistemas','APIs','automatizaciones','apps','flujos'], en:['systems','APIs','automations','apps','workflows']};
const META = {
  es:{title:'Leonardo Ayala | Desarrollador de software', desc:document.querySelector('meta[name=description]').content},
  en:{title:'Leonardo Ayala | Software developer', desc:'Leonardo Iván Ayala Pérez, software developer in Colombia. Automates real processes with Node.js, Python and PostgreSQL, training at Riwi.'}
};

let idioma = 'es';
try{ if(localStorage.getItem('idioma') === 'en') idioma = 'en'; }catch(e){}
const t = clave => (idioma === 'en' ? EN : ES)[clave] ?? ES[clave] ?? clave;
const L = (es, en) => idioma === 'en' ? en : es;

// El español vive en el HTML; se guarda la primera vez para poder volver a él.
function original(el, tipo){
  const k = 'es' + tipo;
  if(!(k in el.dataset)){
    el.dataset[k] = tipo === 'Html' ? el.innerHTML : tipo === 'Aria' ? el.getAttribute('aria-label') : tipo === 'Ph' ? el.placeholder : el.textContent;
  }
  return el.dataset[k];
}

function aplicarIdioma(){
  document.documentElement.lang = idioma;
  $$('[data-i18n]').forEach(el => { const es = original(el, 'Txt'); el.textContent = idioma === 'en' ? (EN[el.dataset.i18n] ?? es) : es; });
  $$('[data-i18n-aria]').forEach(el => { const es = original(el, 'Aria'); el.setAttribute('aria-label', idioma === 'en' ? (EN[el.dataset.i18nAria] ?? es) : es); });
  $$('[data-i18n-ph]').forEach(el => { const es = original(el, 'Ph'); el.placeholder = idioma === 'en' ? (EN[el.dataset.i18nPh] ?? es) : es; });
  document.title = META[idioma].title;
  document.querySelector('meta[name=description]').content = META[idioma].desc;

  const b = $('idioma');
  b.textContent = idioma === 'en' ? 'ES' : 'EN';
  b.lang = idioma === 'en' ? 'es' : 'en';
  b.setAttribute('aria-label', idioma === 'en' ? 'Leer en español' : 'Read in English');
  pintarHora();

  $$('[data-split][data-i18n]').forEach(partirLetras);
  partirPalabras($('manifiesto'));
  rotadorIndice = 0;
  $('rotador').innerHTML = `<span class="palabra">${PALABRAS[idioma][0]}</span>`;
  pintarRepos();
  pintarWeb();
  pintarContacto();
  pintarAtajos();
  pintarChips();
  if(ANIMA){ animarManifiesto(); animarContacto(); ScrollTrigger.refresh(); }
  dispatchEvent(new Event('idioma-cambiado'));
}

// =================================================================== utilidades de texto
function partirLetras(el){
  const texto = el.textContent;
  el.textContent = '';
  for(const c of texto){
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
  }
}
function partirPalabras(el){
  const texto = el.textContent.trim();
  el.textContent = '';
  texto.split(/\s+/).forEach((p, i, arr) => {
    const s = document.createElement('span');
    s.className = 'pal'; s.textContent = p;
    el.appendChild(s);
    if(i < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  if(!ANIMA) $$('.pal', el).forEach(p => p.style.opacity = 1);
}

// Efecto de descifrado: el texto pasa por caracteres al azar hasta quedar fijo.
const GLIFOS = '01<>/{}[]#$%&*+=?_—ABCDEFXYZ';
function descifrar(el, duracion = 900){
  const final = el.textContent;
  if(MENOS_MOVIMIENTO || !final.trim()) return;
  const inicio = performance.now();
  cancelAnimationFrame(el._descifrado);
  const paso = ahora => {
    const p = Math.min((ahora - inicio) / duracion, 1);
    const fijos = Math.floor(final.length * p);
    let s = final.slice(0, fijos);
    for(let i = fijos; i < final.length; i++) s += final[i] === ' ' ? ' ' : GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
    el.textContent = s;
    if(p < 1) el._descifrado = requestAnimationFrame(paso); else el.textContent = final;
  };
  el._descifrado = requestAnimationFrame(paso);
}

// =================================================================== sonido
// Siempre activo. El navegador solo deja sonar audio después de la primera
// interacción del visitante, así que el contexto se crea en ese momento.
window.__audio = null;
function desbloquearAudio(){
  if(window.__audio) return;
  try{ window.__audio = new AudioContext(); window.__audio.resume(); }catch(e){}
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, desbloquearAudio, {once: true, passive: true}));
function tono(f = 880, dur = .05, tipo = 'sine', vol = .03){
  const ctxAudio = window.__audio;
  if(!ctxAudio) return;
  try{
    const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
    o.type = tipo; o.frequency.value = f;
    g.gain.setValueAtTime(vol, ctxAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ctxAudio.currentTime + dur);
    o.connect(g).connect(ctxAudio.destination);
    o.start(); o.stop(ctxAudio.currentTime + dur + .02);
  }catch(e){}
}
document.addEventListener('pointerover', e => { if(e.target.closest('a, button')) tono(1500, .025, 'sine', .012); });
document.addEventListener('click', e => { if(e.target.closest('a, button')) tono(720, .06, 'triangle', .03); });

// =================================================================== hora local
// La hora de Colombia en vivo: quien visita sabe al instante en qué zona horaria trabajas.
function pintarHora(){
  const hora = new Intl.DateTimeFormat(idioma === 'en' ? 'en-US' : 'es-CO', {timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit'}).format(new Date());
  $('hora').textContent = L(`${hora} en Colombia`, `${hora} in Colombia`);
}
setInterval(pintarHora, 20000);

// =================================================================== osciloscopio
// Un osciloscopio de verdad en miniatura: cuadrícula, traza con estela de fósforo y pulsos de
// datos que la recorren. Se agita cuando el visitante mueve el puntero o baja por la página,
// corre más rápido con el puntero encima y un clic dispara un pulso. Foco le cambia el color
// con la variable --onda.
(() => {
  const lienzo = $('osc');
  if(!lienzo) return;
  const g = lienzo.getContext('2d');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1;
  function medir(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = lienzo.clientWidth; h = lienzo.clientHeight;
    lienzo.width = Math.round(w * dpr); lienzo.height = Math.round(h * dpr);
  }
  medir();
  addEventListener('resize', medir);

  let energia = 0, fase = 0, encima = false, visible = true, ultimo = performance.now(), ultimoPulso = 0, cuadros = 0;
  let color = '#3FD0FF';
  const pulsos = [];
  addEventListener('pointermove', e => { energia = Math.min(energia + Math.hypot(e.movementX || 0, e.movementY || 0) * .004, 1); }, {passive: true});
  addEventListener('scroll', () => { energia = Math.min(energia + .04, 1); }, {passive: true});
  const pildora = lienzo.closest('.hero-pre');
  pildora.addEventListener('pointerenter', () => { encima = true; });
  pildora.addEventListener('pointerleave', () => { encima = false; });
  pildora.addEventListener('click', () => { pulsos.push({x: -4, a: 1.2}); energia = 1; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(lienzo);

  function dibujar(dt){
    if(cuadros++ % 20 === 0) color = getComputedStyle(lienzo).getPropertyValue('--onda').trim() || '#3FD0FF';
    energia = Math.max(energia - dt * .6, 0);
    const vel = (encima ? 2.4 : 1) * (1 + energia * 1.4) * (quieto ? .6 : 1);
    fase += dt * 5 * vel;
    // Un pulso de datos cada tanto; más seguido cuando hay movimiento.
    const ahora = performance.now();
    if(ahora - ultimoPulso > 2300 / vel){ ultimoPulso = ahora; pulsos.push({x: -4, a: .7 + Math.random() * .5}); }
    for(const p of pulsos) p.x += dt * w * .85 * vel;
    while(pulsos.length && pulsos[0].x > w + 12) pulsos.shift();

    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fósforo: en vez de borrar, se oscurece lo anterior y queda una estela.
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(3,8,14,.42)';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(63,208,255,.07)';
    g.lineWidth = 1;
    g.beginPath();
    for(let x = 8; x < w; x += 8){ g.moveTo(x + .5, 0); g.lineTo(x + .5, h); }
    for(let y = 5.5; y < h; y += 5.5){ g.moveTo(0, Math.round(y) + .5); g.lineTo(w, Math.round(y) + .5); }
    g.stroke();

    g.strokeStyle = color; g.lineWidth = 1.5; g.lineJoin = 'round';
    g.shadowColor = color; g.shadowBlur = 5;
    g.beginPath();
    const amp = (.2 + energia * .16) * h;
    for(let x = 0; x <= w; x++){
      const t = x / w;
      let y = Math.sin(t * Math.PI * 4 + fase) * amp + Math.sin(t * Math.PI * 10 - fase * 1.7) * energia * .1 * h;
      // Cada pulso tiene la forma de un latido: un pico arriba seguido de uno pequeño abajo.
      for(const p of pulsos){
        const d = x - p.x;
        y -= p.a * h * .42 * Math.exp(-((d / 2.2) ** 2));
        y += p.a * h * .2 * Math.exp(-(((d - 4.5) / 2.4) ** 2));
      }
      x ? g.lineTo(x, h / 2 + y) : g.moveTo(x, h / 2 + y);
    }
    g.stroke();
  }
  // Con «reducir movimiento» sigue viva, solo más tranquila (ver vel).
  (function cuadro(ahora){
    requestAnimationFrame(cuadro);
    const dt = Math.min((ahora - ultimo) / 1000, .05);
    ultimo = ahora;
    if(visible && !document.hidden) dibujar(dt);
  })(performance.now());
})();

// =================================================================== marquesina e íconos
const MARQUESINA_1 = ['Node.js','TypeScript','NestJS','Python','FastAPI','PostgreSQL','React','Three.js'];
const MARQUESINA_2 = ['Automatización','APIs REST','SPAs','Raspberry Pi','Riwi','Clean code','IA'];
function llenarMarquesina(id, palabras){
  const fila = $(id);
  for(let k = 0; k < 2; k++) palabras.forEach(p => { const s = document.createElement('span'); s.textContent = p; fila.appendChild(s); });
}
llenarMarquesina('mq1', MARQUESINA_1);
llenarMarquesina('mq2', MARQUESINA_2);

const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/';
// =================================================================== consola del stack
// Las herramientas agrupadas por área, como componentes en una placa. Al elegir una se ve para
// qué la uso y en qué proyectos reales está, con enlace a cada uno. Recorre sola hasta que el
// visitante toca una.
const PROYECTOS = {
  cotizador: {n: ['Cotizador web', 'Web quoting app'], caso: 'cotizador'},
  facturas: {n: ['Lector de facturas', 'Invoice reader'], caso: 'facturas'},
  nomina: {n: ['Nómina quincenal', 'Biweekly payroll'], caso: 'nomina'},
  alertas: {n: ['Alertas de vencimientos', 'Expiration alerts'], caso: 'alertas'},
  dormify: {n: ['Dormify', 'Dormify'], caso: 'dormify'},
  medicare: {n: ['RiwiMediCare API', 'RiwiMediCare API'], caso: 'medicare'},
  tickets: {n: ['TicketSystem SPA', 'TicketSystem SPA'], repo: 'ticket-system-spa'},
  gestioncall: {n: ['GestionCall', 'GestionCall'], repo: 'GestionCall'},
  reservas: {n: ['API de reservas', 'Reservations API'], repo: 'Actividad_nest_week_5'},
  rick: {n: ['Rick & Morty SPA', 'Rick & Morty SPA'], repo: 'spa-final'},
  web: {n: ['Sitios para negocios', 'Business websites'], ancla: '#web'},
  portafolio: {n: ['Este portafolio', 'This portfolio'], ancla: '#inicio'},
  riwi: {n: ['Formación en Riwi', 'Riwi training'], ancla: '#trayectoria'},
  inicios: {n: ['Primeros proyectos', 'First projects'], ancla: '#trayectoria'}
};
const CATEGORIAS = [['backend', ['Backend', 'Backend']], ['datos', ['Datos', 'Data']], ['frontend', ['Frontend', 'Frontend']], ['infra', ['Infraestructura e IA', 'Infrastructure & AI']]];
// [ícono, nombre, color, área, proyectos donde la uso, para qué, texto si no hay ícono]
const HERRAMIENTAS = [
  ['nodedotjs', 'Node.js', '#5FA04E', 'backend', ['cotizador', 'medicare', 'tickets'], ['Mi base para APIs y automatizaciones.', 'My go-to for APIs and automations.']],
  ['typescript', 'TypeScript', '#3178C6', 'backend', ['medicare', 'reservas'], ['Tipos que atrapan errores antes de llegar a producción.', 'Types that catch bugs before they reach production.']],
  ['express', 'Express', '#9BA4B7', 'backend', ['cotizador', 'medicare'], ['APIs REST livianas con middlewares propios.', 'Lightweight REST APIs with custom middleware.']],
  ['nestjs', 'NestJS', '#E0234E', 'backend', ['reservas'], ['Arquitectura por módulos: guards, pipes e interceptors.', 'Modular architecture: guards, pipes and interceptors.']],
  ['python', 'Python', '#3776AB', 'backend', ['facturas', 'dormify', 'gestioncall'], ['Automatización, lectura de PDF y backends.', 'Automation, PDF parsing and backends.']],
  ['fastapi', 'FastAPI', '#009688', 'backend', ['facturas', 'dormify'], ['APIs rápidas con validación y documentación automática.', 'Fast APIs with validation and automatic docs.']],
  ['flask', 'Flask', '#9BA4B7', 'backend', ['gestioncall'], ['Aplicaciones web pequeñas y directas.', 'Small, straightforward web apps.']],
  ['php', 'PHP', '#777BB4', 'backend', ['inicios'], ['Donde empecé: mis primeras páginas dinámicas.', 'Where I started: my first dynamic pages.']],
  ['cplusplus', 'C++', '#00599C', 'backend', ['inicios'], ['Los fundamentos de programación de la carrera.', 'Programming fundamentals from college.']],
  ['postgresql', 'PostgreSQL', '#4169E1', 'datos', ['cotizador', 'facturas', 'dormify', 'medicare'], ['Mi base de datos principal en producción.', 'My main production database.']],
  ['mysql', 'MySQL', '#4479A1', 'datos', ['inicios'], ['Bases de datos de mis primeros proyectos web.', 'Databases for my first web projects.']],
  ['sqlite', 'SQLite', '#3FA9F5', 'datos', ['riwi'], ['Bases livianas para prototipos y pruebas.', 'Lightweight databases for prototypes and tests.']],
  ['sequelize', 'Sequelize', '#52B0E7', 'datos', ['medicare'], ['Modelos y relaciones con un ORM.', 'Models and relations with an ORM.']],
  [null, 'Excel y VBA', '#21A366', 'datos', ['nomina', 'alertas'], ['Sistemas completos dentro de Excel, con macros.', 'Full systems inside Excel, with macros.'], 'XLS'],
  ['javascript', 'JavaScript', '#F7DF1E', 'frontend', ['cotizador', 'tickets', 'rick', 'web'], ['Interfaces sin frameworks cuando no hacen falta.', 'Framework-free interfaces when none are needed.']],
  ['html5', 'HTML5', '#E34F26', 'frontend', ['web', 'portafolio'], ['Estructura semántica y accesible.', 'Semantic, accessible structure.']],
  ['css3', 'CSS3', '#1572B6', 'frontend', ['web', 'portafolio'], ['Diseño, animaciones y versiones para celular.', 'Design, animation and mobile layouts.']],
  ['threedotjs', 'Three.js', '#ECEFF6', 'frontend', ['portafolio'], ['El 3D de este portafolio: Volt y su equipo.', 'The 3D in this portfolio: Volt and his team.']],
  ['react', 'React', '#61DAFB', 'frontend', ['riwi'], ['Componentes y estado en mi formación en Riwi.', 'Components and state in my Riwi training.']],
  ['vite', 'Vite', '#646CFF', 'frontend', ['tickets'], ['Entorno de desarrollo rápido para SPAs.', 'Fast dev environment for SPAs.']],
  ['bootstrap', 'Bootstrap', '#7952B3', 'frontend', ['tickets'], ['Interfaces ordenadas en poco tiempo.', 'Tidy interfaces in little time.']],
  ['sass', 'Sass', '#CC6699', 'frontend', ['riwi'], ['Estilos organizados por partes.', 'Styles organized into parts.']],
  ['electron', 'Electron', '#47848F', 'frontend', ['riwi'], ['Aplicaciones de escritorio con tecnología web.', 'Desktop apps with web technology.']],
  ['jsonwebtokens', 'JWT', '#D63AFF', 'infra', ['cotizador', 'medicare', 'dormify'], ['Sesiones seguras y roles de usuario.', 'Secure sessions and user roles.']],
  ['swagger', 'Swagger', '#85EA2D', 'infra', ['medicare'], ['Documentación viva de cada endpoint.', 'Living documentation for every endpoint.']],
  ['postman', 'Postman', '#FF6C37', 'infra', ['reservas', 'medicare'], ['Pruebas de cada ruta de la API.', 'Testing every API route.']],
  ['googlegemini', 'Gemini', '#8E75B2', 'infra', ['facturas'], ['IA que lee facturas nuevas, siempre con aprobación humana.', 'AI that reads new invoices, always with human approval.']],
  ['raspberrypi', 'Raspberry Pi', '#E3245A', 'infra', ['facturas'], ['Un servidor pequeño que trabaja día y noche.', 'A tiny server working day and night.']],
  ['linux', 'Linux', '#FCC624', 'infra', ['facturas'], ['Servicios con systemd y respaldos diarios.', 'systemd services and daily backups.']],
  ['render', 'Render', '#9BA4B7', 'infra', ['cotizador', 'dormify'], ['Despliegue en la nube.', 'Cloud deployment.']],
  ['git', 'Git', '#F05032', 'infra', ['cotizador', 'dormify', 'medicare', 'portafolio'], ['Control de versiones en todos mis proyectos.', 'Version control in every project.']],
  ['github', 'GitHub', '#ECEFF6', 'infra', ['portafolio', 'dormify', 'medicare'], ['Mis repositorios públicos y este sitio.', 'My public repositories and this site.']]
];
const tx2 = par => par[idioma === 'en' ? 1 : 0];
// Esfera 3D de herramientas: los logos se reparten sobre una esfera que gira sola, se puede
// arrastrar con inercia y, al elegir un área, gira hasta mostrarla de frente. Cada logo es un
// elemento HTML que se proyecta en perspectiva, así los íconos se ven nítidos.
const esf = {
  items: [], rot: [1, 0, 0, 0, 1, 0, 0, 0, 1], vel: {x: 0, y: .0035}, arrastre: null,
  visible: false, apertura: 0, abierta: false, filtro: 'todas', hover: -1, fijo: -1, girarHacia: null, tocado: 0
};
const ESF_FILTROS = [['todas', ['Todas', 'All']], ...CATEGORIAS];

function iconoStack(h, clase){
  const [slug, , , , , , txt] = h;
  const ic = document.createElement('span');
  ic.className = clase;
  ic.setAttribute('aria-hidden', 'true');
  if(slug) ic.style.setProperty('--i', `url(${SI}${slug}.svg)`);
  else{ ic.classList.add('txt'); ic.textContent = txt; }
  return ic;
}
// Puntos repartidos de forma pareja sobre la esfera (espiral de Fibonacci).
function puntoFibonacci(i, n){
  const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(a) * r, y, Math.sin(a) * r];
}
// Cada área ocupa su propia zona de la esfera (alrededor de los vértices de un tetraedro),
// así al elegirla todas sus herramientas quedan juntas y de frente.
function puntosPorZona(){
  const n = HERRAMIENTAS.length, puntos = Array.from({length: n}, (_, i) => puntoFibonacci(i, n));
  const centros = [[0, .95, .3], [.85, -.35, .4], [-.85, -.35, .4], [0, -.3, -.95]];
  const libres = new Set(puntos.keys()), asignado = new Array(n);
  CATEGORIAS.forEach(([id], k) => {
    const c = centros[k];
    HERRAMIENTAS.forEach((h, i) => {
      if(h[3] !== id) return;
      let mejor = -1, d = Infinity;
      for(const j of libres){ const p = puntos[j], dd = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if(dd < d){ d = dd; mejor = j; } }
      libres.delete(mejor); asignado[i] = puntos[mejor];
    });
  });
  return asignado;
}
const mult = (m, [x, y, z]) => [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];
function girarEsfera(eje, ang){
  // Aplica un giro (en el espacio de la pantalla) a la orientación actual de la esfera.
  const [x, y, z] = eje, c = Math.cos(ang), s = Math.sin(ang), t = 1 - c;
  const r = [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c];
  const m = esf.rot, o = new Array(9);
  for(let f = 0; f < 3; f++) for(let k = 0; k < 3; k++) o[f * 3 + k] = r[f * 3] * m[k] + r[f * 3 + 1] * m[3 + k] + r[f * 3 + 2] * m[6 + k];
  esf.rot = o;
}

function pintarStack(){
  const escena = $('esfEscena');
  escena.querySelectorAll('.esf-item').forEach(e => e.remove());
  const zonas = puntosPorZona();
  esf.items = HERRAMIENTAS.map((h, i) => {
    const el = document.createElement('div');
    el.className = 'esf-item';
    el.style.setProperty('--tc', h[2]);
    const tile = document.createElement('span');
    tile.className = 'esf-tile';
    tile.appendChild(iconoStack(h, 'esf-ic'));
    const nombre = document.createElement('span');
    nombre.className = 'esf-nombre-item';
    nombre.textContent = h[1];
    el.append(tile, nombre);
    el.addEventListener('pointerenter', () => { esf.hover = i; mostrarInfo(i); });
    el.addEventListener('pointerleave', () => { if(esf.hover === i){ esf.hover = -1; if(esf.fijo >= 0) mostrarInfo(esf.fijo); } });
    el.addEventListener('click', () => { esf.fijo = i; esf.tocado = performance.now(); mostrarInfo(i); });
    escena.appendChild(el);
    return {el, h, base: zonas[i], cat: h[3]};
  });
  // Lista para lectores de pantalla (la esfera es solo visual).
  $('esfLista').replaceChildren(...HERRAMIENTAS.map(h => Object.assign(document.createElement('li'), {textContent: `${h[1]}: ${tx2(h[5])}`})));
  const filtros = $('esfFiltros');
  filtros.textContent = '';
  ESF_FILTROS.forEach(([id, nombre]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'esf-filtro'; b.dataset.f = id;
    b.textContent = tx2(nombre);
    b.setAttribute('aria-pressed', id === esf.filtro);
    b.addEventListener('click', () => filtrar(id));
    filtros.appendChild(b);
  });
  mostrarInfo(esf.fijo >= 0 ? esf.fijo : 0, true);
}

function mostrarInfo(i, sinAnimar){
  const h = HERRAMIENTAS[i], info = $('esfInfo');
  info.style.setProperty('--tc', h[2]);
  info.querySelector('.esf-info-ic').replaceChildren(iconoStack(h, 'esf-ic'));
  info.querySelector('.esf-cat').textContent = tx2(CATEGORIAS.find(c => c[0] === h[3])[1]);
  info.querySelector('.esf-nombre').textContent = h[1];
  info.querySelector('.esf-texto').textContent = tx2(h[5]);
  info.querySelector('.esf-usos').textContent = `${L('Lo uso en', 'Used in')}: ${h[4].map(p => tx2(PROYECTOS[p].n)).join(' · ')}`;
  if(!sinAnimar && window.gsap) gsap.fromTo(info.querySelectorAll('.esf-anim'), {y: 8, opacity: 0}, {y: 0, opacity: 1, duration: .35, stagger: .04, ease: 'power3.out', overwrite: true});
}

// Elegir un área: la esfera gira hasta dejar esas herramientas de frente.
function filtrar(id){
  esf.filtro = id;
  esf.tocado = performance.now();
  $$('#esfFiltros .esf-filtro').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === id));
  if(id === 'todas'){ esf.girarHacia = null; return; }
  esf.girarHacia = {cat: id};
  esf.vel = {x: 0, y: 0};
  mostrarInfo(esf.items.findIndex(it => it.cat === id));
}

let esfAntes = performance.now();
function cuadroEsfera(ahora){
  requestAnimationFrame(cuadroEsfera);
  // Todo el giro va por tiempo real, así se ve igual en equipos rápidos y lentos.
  const dt = Math.min((ahora - esfAntes) / 1000, .1), f = dt * 60;
  esfAntes = ahora;
  if(!esf.visible || document.hidden) return;
  const escena = $('esfEscena'), ancho = escena.clientWidth, alto = escena.clientHeight;
  const R = Math.min(ancho, alto) * .42 * (.35 + .65 * esf.apertura), dist = R * 3.4;
  // Giro: arrastre con inercia, o giro automático suave.
  if(!esf.arrastre){
    if(esf.girarHacia){
      // Se gira poco a poco para que el centro del área elegida mire al frente (+z).
      const grupo = esf.items.filter(it => it.cat === esf.girarHacia.cat);
      let c = grupo.reduce((s, it) => { const p = mult(esf.rot, it.base); return [s[0] + p[0], s[1] + p[1], s[2] + p[2]]; }, [0, 0, 0]);
      const l = Math.hypot(...c) || 1; c = c.map(v => v / l);
      const eje = [c[1], -c[0], 0], le = Math.hypot(...eje), ang = Math.acos(Math.min(Math.max(c[2], -1), 1));
      if(le > 1e-4 && ang > .01) girarEsfera(eje.map(v => v / le), ang * (1 - Math.exp(-dt * 4.5)));
      else girarEsfera([0, 1, 0], .0012 * f);
    }else{
      const auto = matchMedia('(prefers-reduced-motion: reduce)').matches ? .0015 : .0035;
      esf.vel.x *= Math.pow(.95, f); esf.vel.y += ((esf.hover >= 0 ? auto * .25 : auto) - esf.vel.y) * (1 - Math.pow(.97, f));
      girarEsfera([0, 1, 0], esf.vel.y * f); if(Math.abs(esf.vel.x) > 1e-5) girarEsfera([1, 0, 0], esf.vel.x * f);
    }
  }
  const cx = ancho / 2, cy = alto / 2;
  for(let k = 0; k < esf.items.length; k++){
    const it = esf.items[k];
    const [x, y, z] = mult(esf.rot, it.base);
    const s = dist / (dist - z * R), prof = (z + 1) / 2;
    const fuera = esf.filtro !== 'todas' && it.cat !== esf.filtro;
    const resalte = k === esf.hover || (esf.hover < 0 && k === esf.fijo);
    const esc = s * (.55 + prof * .5) * (resalte ? 1.35 : 1) * (fuera ? .8 : 1);
    const op = esf.apertura * (fuera ? .1 : .12 + prof * prof * .88);
    it.el.style.transform = `translate3d(${(cx + x * R * s).toFixed(1)}px, ${(cy - y * R * s).toFixed(1)}px, 0) translate(-50%, -50%) scale(${esc.toFixed(3)})`;
    it.el.style.opacity = op.toFixed(3);
    it.el.style.zIndex = resalte ? 200 : Math.round(prof * 100);
    it.el.classList.toggle('activo', resalte);
    it.el.classList.toggle('delante', prof > .72 && !fuera);
  }
}

// Arrastrar para girar; al soltar sigue rodando con inercia.
(() => {
  const escena = $('esfEscena');
  escena.addEventListener('pointerdown', e => {
    esf.arrastre = {x: e.clientX, y: e.clientY, t: performance.now()};
    esf.girarHacia = null; esf.tocado = performance.now();
    escena.setPointerCapture(e.pointerId);
    escena.classList.add('arrastrando');
  });
  escena.addEventListener('pointermove', e => {
    if(!esf.arrastre) return;
    const dx = e.clientX - esf.arrastre.x, dy = e.clientY - esf.arrastre.y;
    esf.arrastre.x = e.clientX; esf.arrastre.y = e.clientY;
    const k = .006;
    girarEsfera([0, 1, 0], dx * k); girarEsfera([1, 0, 0], dy * k);
    esf.vel = {x: dy * k * .6, y: dx * k * .6};
  });
  const soltar = () => { esf.arrastre = null; escena.classList.remove('arrastrando'); };
  escena.addEventListener('pointerup', soltar);
  escena.addEventListener('pointercancel', soltar);
})();

pintarStack();
addEventListener('idioma-cambiado', pintarStack);
// Entrada: la primera vez que se ve, los logos salen del centro y se acomodan en la esfera.
new IntersectionObserver(([e]) => {
  esf.visible = e.isIntersecting;
  if(e.isIntersecting && !esf.abierta){
    esf.abierta = true;
    if(window.gsap) gsap.to(esf, {apertura: 1, duration: 1.8, ease: 'expo.out'});
    else esf.apertura = 1;
    girarEsfera([0, 1, 0], -1.2);
    esf.vel = {x: .01, y: .05};
  }
}, {threshold: .2}).observe($('stack'));
requestAnimationFrame(cuadroEsfera);

// =================================================================== repositorios de GitHub
const REPOS = [
  {nombre:'Dormify', repo:'DORMIFY', tipo:'backend', caso:'dormify', img:'dormify', tags:['FastAPI','PostgreSQL','SQLAlchemy','JWT'],
   es:'Plataforma de alojamiento para universitarios: arriendos, directorio de servicios y foro de la comunidad.',
   en:'Student housing platform: rentals, a services directory and a community forum.'},
  {nombre:'RiwiMediCare API', repo:'-Prueba-M5_2_NodeJS_Final', tipo:'backend', caso:'medicare', img:'medicare', foco:'center 80%', tags:['Express','TypeScript','Sequelize','Swagger'],
   es:'API REST que reemplaza correos y hojas de cálculo en las solicitudes de medicamentos entre clínicas y bodegas.',
   en:'REST API that replaces emails and spreadsheets for medicine requests between clinics and warehouses.'},
  {nombre:'GestionCall', repo:'GestionCall', tipo:'backend', estrellas:2, img:'gestioncall', tags:['Flask','Chart.js','JavaScript'],
   es:'Gestión de clientes para un call center con estados de cada caso y estadísticas en tiempo real.',
   en:'Customer management for a call center with case tracking and real-time statistics.'},
  {nombre:'TicketSystem SPA', repo:'ticket-system-spa', tipo:'frontend', img:'tickets', tags:['JavaScript','Vite','Axios','json-server'],
   es:'Tickets de soporte técnico con tres roles, sesión persistente y cierre de sesión por inactividad.',
   en:'Tech support tickets with three roles, persistent sessions and inactivity logout.'},
  {nombre:'API de reservas', nombreEn:'Reservations API', repo:'Actividad_nest_week_5', tipo:'backend', rutas:[['GET', '/reservations'], ['POST', '/reservations']], tags:['NestJS','TypeScript','Postman'],
   es:'API de reservas para un restaurante para dominar el ciclo de NestJS: middleware, guard, pipe, interceptor y filtros.',
   en:'Restaurant reservations API to master the NestJS lifecycle: middleware, guard, pipe, interceptor and filters.'},
  {nombre:'Rick & Morty SPA', repo:'spa-final', tipo:'frontend', img:'rick-morty', tags:['JavaScript','SPA','localStorage'],
   es:'SPA en JavaScript puro con router propio, CRUD de personajes y manejo de errores de la API.',
   en:'Plain JavaScript SPA with its own router, character CRUD and API error handling.'}
];
// =================================================================== vitrina de sitios web
// Capturas reales de página completa; la pantalla las recorre sola de arriba a abajo.
const SITIOS = [
  {id: 'restaurante', titulo: ['Restaurante de comida rápida', 'Fast-food restaurant'], tipo: ['Prototipo para el cliente', 'Client prototype'],
   texto: ['Menú con filtros por categoría, combos destacados, horario y cómo llegar. Pensado primero para celular, porque ahí lo abren los clientes.',
           'Menu with category filters, featured combos, opening hours and directions. Mobile first, because that’s where customers open it.'],
   stack: ['HTML', 'CSS', 'JavaScript', ['Fotos con IA', 'AI photos']]},
  {id: 'instalaciones', titulo: ['Empresa de instalaciones a domicilio', 'Home installation company'], tipo: ['Sitio publicado', 'Live site'],
   texto: ['Galería por categoría con el antes y después de trabajos reales, videos y pedidos por WhatsApp. Sin dependencias, con SEO local, afiche, tarjetas y QR.',
           'Category gallery with real before-and-after jobs, videos and WhatsApp orders. No dependencies, local SEO, plus poster, cards and QR code.'],
   stack: ['HTML', 'CSS', 'JavaScript', 'SEO']},
  {id: 'clinica', titulo: ['Clínica odontológica', 'Dental clinic'], tipo: ['Propuesta de sitio', 'Site proposal'],
   texto: ['Un sitio cálido y claro: tratamientos, filosofía, preguntas frecuentes y un formulario que deja lista la solicitud de valoración.',
           'A warm, clear site: treatments, philosophy, FAQs and a form that prepares the consultation request.'],
   stack: ['HTML', 'CSS', 'JavaScript', 'UX']}
];
let sitioActual = 0;
function pintarWeb(){
  const lista = $('webLista');
  lista.textContent = '';
  SITIOS.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'web-tab'; b.setAttribute('role', 'tab');
    b.innerHTML = `<span class="web-n">${String(i + 1).padStart(2, '0')}</span><span class="web-tipo"></span><b></b><p></p><ul class="tags"></ul>`;
    b.querySelector('.web-tipo').textContent = s.tipo[idioma === 'en' ? 1 : 0];
    b.querySelector('b').textContent = s.titulo[idioma === 'en' ? 1 : 0];
    b.querySelector('p').textContent = s.texto[idioma === 'en' ? 1 : 0];
    s.stack.forEach(x => { const li = document.createElement('li'); li.textContent = Array.isArray(x) ? x[idioma === 'en' ? 1 : 0] : x; b.querySelector('ul').appendChild(li); });
    b.addEventListener('click', () => mostrarSitio(i));
    lista.appendChild(b);
  });
  mostrarSitio(sitioActual, false);
}
function mostrarSitio(i, animar = true){
  sitioActual = i;
  const s = SITIOS[i];
  $$('#webLista .web-tab').forEach((b, k) => { b.classList.toggle('activo', k === i); b.setAttribute('aria-selected', k === i); });
  const esc = $('webEscritorio'), cel = $('webCelular');
  const cambiar = () => {
    esc.src = `img/trabajos/${s.id}-escritorio.webp`;
    cel.src = `img/trabajos/${s.id}-celular.webp`;
    esc.alt = cel.alt = `${s.titulo[idioma === 'en' ? 1 : 0]} — ${L('captura real, marca oculta', 'real screenshot, brand hidden')}`;
  };
  if(!animar || !ANIMA || MENOS_MOVIMIENTO){ cambiar(); return; }
  gsap.to('.web-laptop, .web-celular', {opacity: 0, y: 16, duration: .25, stagger: .05, ease: 'power2.in', onComplete: () => {
    cambiar();
    gsap.to('.web-laptop, .web-celular', {opacity: 1, y: 0, duration: .55, stagger: .08, ease: 'power3.out'});
  }});
  tono(980, .04);
}
// Cuando carga la captura, se calcula cuánto debe recorrer la pantalla y a qué velocidad.
['webEscritorio', 'webCelular'].forEach(id => $(id).addEventListener('load', e => {
  const img = e.target, marco = img.parentElement;
  const recorrido = Math.max(img.getBoundingClientRect().height - marco.clientHeight, 0);
  img.style.setProperty('--recorrido', `-${recorrido}px`);
  img.style.setProperty('--duracion', `${Math.max(recorrido / 45, 6)}s`);
  img.classList.remove('recorre'); void img.offsetWidth; img.classList.add('recorre');
}));

let filtroActivo = 'todos';
const ICONO_REPO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 0 6.5 24H20v-5"/><path d="M8 7h8M8 11h6" stroke="currentColor" stroke-width="1.8"/></svg>';
function pintarRepos(){
  const caja = $('ghGrid');
  caja.textContent = '';
  REPOS.forEach(r => {
    const url = `https://github.com/${USUARIO_GITHUB}/${r.repo}`;
    // Con caso de estudio la tarjeta abre el caso y el código va en su propio enlace;
    // sin caso, toda la tarjeta es el enlace al repositorio.
    const a = document.createElement(r.caso ? 'article' : 'a');
    a.className = 'repo';
    if(r.caso){ a.dataset.caso = r.caso; }
    else{ a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    a.dataset.tipo = r.tipo;
    a.setAttribute('data-glow', ''); a.setAttribute('data-tilt', '');
    const acciones = r.caso
      ? `<div class="repo-acciones"><button type="button" class="btn-caso" data-caso="${r.caso}">${L('Caso de estudio', 'Case study')}</button><a class="repo-ir" href="${url}" target="_blank" rel="noopener">${L('Código', 'Code')}</a></div>`
      : `<span class="repo-ir">${L('Ver código', 'View code')}</span>`;
    // Captura del proyecto corriendo en local con los datos de prueba de su propio repositorio.
    // Sin captura (API sin interfaz): sus rutas reales y el recorrido de cada petición en Nest.
    const rutas = r.rutas ? `<div class="repo-foto repo-rutas" aria-hidden="true">${r.rutas.map(([v, p]) => `<code><b class="m-${v.toLowerCase()}">${v}</b>${p}</code>`).join('')}<small>middleware → guard → pipe → controller → interceptor</small></div>` : '';
    const foto = r.img ? `<div class="repo-foto"><img src="img/github/${r.img}.webp" srcset="img/github/${r.img}-800.webp 800w, img/github/${r.img}.webp 1414w" sizes="(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 30vw" alt="" loading="lazy" decoding="async" width="1440" height="900"${r.foco ? ` style="object-position:${r.foco}"` : ''}></div>` : '';
    a.innerHTML = `${foto}${rutas}<div class="repo-top">${ICONO_REPO}${r.estrellas ? `<span class="repo-estrellas">★ ${r.estrellas}</span>` : ''}</div>
      <h3></h3><p></p><ul class="tags"></ul>${acciones}`;
    a.querySelector('h3').textContent = idioma === 'en' && r.nombreEn ? r.nombreEn : r.nombre;
    a.querySelector('p').textContent = r[idioma];
    r.tags.forEach(tg => { const li = document.createElement('li'); li.textContent = tg; a.querySelector('ul').appendChild(li); });
    if(filtroActivo !== 'todos' && r.tipo !== filtroActivo) a.classList.add('oculto');
    caja.appendChild(a);
  });
  activarInclinacion();
}
$$('.filtro').forEach(b => b.addEventListener('click', () => {
  filtroActivo = b.dataset.filtro;
  $$('.filtro').forEach(x => { x.classList.toggle('activo', x === b); x.setAttribute('aria-pressed', x === b); });
  const tarjetas = $$('#ghGrid .repo');
  const mostrar = tarjetas.filter(c => filtroActivo === 'todos' || c.dataset.tipo === filtroActivo);
  if(!ANIMA){ tarjetas.forEach(c => c.classList.toggle('oculto', !mostrar.includes(c))); return; }
  gsap.to(tarjetas, {opacity: 0, y: 20, scale: .96, duration: .2, stagger: .02, onComplete: () => {
    tarjetas.forEach(c => c.classList.toggle('oculto', !mostrar.includes(c)));
    gsap.fromTo(mostrar, {opacity: 0, y: 30, scale: .94}, {opacity: 1, y: 0, scale: 1, duration: .5, stagger: .06, ease: 'back.out(1.5)'});
    ScrollTrigger.refresh();
  }});
}));

// Número real de repositorios, en vivo desde la API de GitHub.
let reposEnVivo = null;
fetch(`https://api.github.com/users/${USUARIO_GITHUB}`).then(r => r.ok ? r.json() : null).then(d => {
  if(d && d.public_repos){ reposEnVivo = d; $('cifraRepos').dataset.contar = d.public_repos; }
}).catch(() => {});

// =================================================================== contacto
const ICONOS = {
  correo:'<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
  linkedin:'<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z"/>',
  github:'<path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>',
  whatsapp:'<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.23.64-1.33 1.22-1.83 1.27-.47.05-1.06.07-1.7-.11-.4-.12-.9-.29-1.55-.57-2.72-1.17-4.5-3.91-4.63-4.09-.14-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.25-.27.55-.34.73-.34h.52c.17 0 .4-.06.62.47.23.55.78 1.9.85 2.04.07.14.11.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.11.59-.07.16-.18.68-.8.86-1.07.18-.27.36-.23.61-.14.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.65-.16 1.28z"/>',
  cv:'<path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 2v6h6M9 13h8M9 17h8" fill="none" stroke="currentColor" stroke-width="2"/>'
};
function enlaces(){
  const asunto = encodeURIComponent(L('Contacto desde tu portafolio', 'Contact from your portfolio'));
  return [
    ['linkedin', CONTACTO.linkedin],
    ['correo',   CONTACTO.correo && `mailto:${CONTACTO.correo}?subject=${asunto}`],
    ['github',   CONTACTO.github],
    ['whatsapp', CONTACTO.whatsapp && `https://wa.me/${CONTACTO.whatsapp}`],
    ['cv',       CONTACTO.cv]
  ].filter(([, url]) => url);
}
function pintarContacto(){
  const caja = $('canales');
  caja.textContent = '';
  enlaces().forEach(([tipo, url], n) => {
    const a = document.createElement('a');
    a.href = url;
    if(/^https?:/.test(url)){ a.target = '_blank'; a.rel = 'noopener'; }
    if(tipo === 'cv') a.setAttribute('download', '');
    if(n === 0) a.className = 'principal';
    a.setAttribute('data-magnetic', '');
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[tipo]}</svg>`;
    a.append(t('canal.' + tipo));
    caja.appendChild(a);
  });
}

// =================================================================== rotador
let rotadorIndice = 0;
function rotar(){
  const caja = $('rotador');
  const lista = PALABRAS[idioma];
  rotadorIndice = (rotadorIndice + 1) % lista.length;
  const nueva = document.createElement('span');
  nueva.className = 'palabra';
  nueva.textContent = lista[rotadorIndice];
  caja.replaceChildren(nueva);
  descifrar(nueva, 600);
}

// =================================================================== terminal
const term = $('termCuerpo'), termInput = $('termInput');
const historial = [];
let posHistorial = 0;
function linea(texto, clase = 'sal', html = false){
  const p = document.createElement('p');
  p.className = clase;
  if(html) p.innerHTML = texto; else p.textContent = texto;
  term.appendChild(p);
  term.scrollTop = term.scrollHeight;
  return p;
}
async function escribirLineas(lineas){
  for(const l of lineas){
    const [texto, clase = 'sal', html = false] = Array.isArray(l) ? l : [l];
    linea(texto, clase, html);
    tono(1200 + Math.random() * 300, .02, 'square', .008);
    await new Promise(r => setTimeout(r, MENOS_MOVIMIENTO ? 0 : 45));
  }
}
const enlace = (url, txt) => `<a href="${url}" target="_blank" rel="noopener">${txt}</a>`;
const COMANDOS = {
  help: () => [
    [L('Comandos disponibles:', 'Available commands:'), 'acento'],
    L('  sobre        quién es Leonardo', '  about        who Leonardo is'),
    L('  proyectos    sistemas en producción y en GitHub', '  projects     production systems and GitHub work'),
    L('  stack        tecnologías que usa', '  stack        technologies he uses'),
    L('  riwi         su formación', '  riwi         his training'),
    L('  github       datos en vivo de su GitHub', '  github       live data from his GitHub'),
    L('  casos        casos de estudio de sus proyectos', '  cases        case studies of his projects'),
    L('  contacto     cómo escribirle', '  contact      how to reach him'),
    L('  volt         habla con la mascota', '  volt         talk to the mascot'),
    L('  equipo       conoce a los ayudantes de Volt', '  team         meet Volt’s helpers'),
    '  whoami · ls · date · clear',
    [L('  ¿Algo secreto? Prueba: sudo contratar', '  Something secret? Try: sudo hire'), 'ok']
  ],
  sobre: () => [
    'Leonardo Iván Ayala Pérez',
    L('Software Developer · Systems Engineering · Colombia', 'Software Developer · Systems Engineering · Colombia'),
    L('Automatiza procesos reales en una empresa de ingeniería eléctrica', 'Automates real processes at an electrical engineering company'),
    L('y se forma en Riwi en la ruta avanzada de Node.js.', 'and trains at Riwi on the advanced Node.js track.')
  ],
  proyectos: () => [
    [L('En producción:', 'In production:'), 'acento'],
    L('  ▸ Cotizador web (Node.js, PostgreSQL, PDF)', '  ▸ Web quoting app (Node.js, PostgreSQL, PDF)'),
    L('  ▸ Lector de facturas con IA supervisada (Python, Raspberry Pi)', '  ▸ Invoice reader with supervised AI (Python, Raspberry Pi)'),
    L('  ▸ Nómina quincenal de 55 personas (Excel, VBA)', '  ▸ Biweekly payroll for 55 employees (Excel, VBA)'),
    L('  ▸ Alertas de vencimientos del personal', '  ▸ Staff expiration alerts'),
    [L('En GitHub:', 'On GitHub:'), 'acento'],
    ...REPOS.map(r => [`  ▸ ${enlace(`https://github.com/${USUARIO_GITHUB}/${r.repo}`, idioma === 'en' && r.nombreEn ? r.nombreEn : r.nombre)} · ${r.tags.slice(0, 2).join(', ')}`, 'sal', true])
  ],
  stack: () => [
    ['backend   ', 'acento'], '  Node.js · TypeScript · Express · NestJS · Python · FastAPI · Flask',
    ['datos     ', 'acento'], '  PostgreSQL · MySQL · SQLite · Sequelize · SQLAlchemy',
    ['frontend  ', 'acento'], '  JavaScript · React · Vite · Sass · Bootstrap · Three.js',
    ['otros     ', 'acento'], '  Linux · Raspberry Pi · Git · Swagger · Postman · Excel/VBA · Gemini'
  ],
  riwi: () => [
    L('Riwi · formación intensiva en desarrollo de software (2026)', 'Riwi · intensive software development training (2026)'),
    L('  M1 Python  →  M2 Frontend  →  M3 JavaScript y SPAs', '  M1 Python  →  M2 Frontend  →  M3 JavaScript & SPAs'),
    L('  M4 Bases de datos  →  M5 Node.js, TypeScript y NestJS', '  M4 Databases  →  M5 Node.js, TypeScript & NestJS'),
    [L('Clan: Ruta Avanzada Node.js', 'Clan: Advanced Node.js track'), 'ok']
  ],
  github: async () => {
    linea(L('Consultando api.github.com…', 'Querying api.github.com…'));
    try{
      const [u, repos] = await Promise.all([
        reposEnVivo || fetch(`https://api.github.com/users/${USUARIO_GITHUB}`).then(r => r.json()),
        fetch(`https://api.github.com/users/${USUARIO_GITHUB}/repos?sort=pushed&per_page=5`).then(r => r.json())
      ]);
      return [
        [`${u.name} · ${u.public_repos} ${L('repositorios', 'repositories')} · ${L('desde', 'since')} ${u.created_at.slice(0, 4)}`, 'ok'],
        [L('Últimos movimientos:', 'Latest activity:'), 'acento'],
        ...repos.map(r => [`  ▸ ${enlace(r.html_url, r.name)} · ${r.language || '—'} · ${r.pushed_at.slice(0, 10)}`, 'sal', true])
      ];
    }catch(e){
      return [[L('GitHub no respondió. Intenta en un momento.', 'GitHub didn’t answer. Try again in a moment.'), 'err']];
    }
  },
  contacto: () => enlaces().map(([tipo, url]) => [`  ${t('canal.' + tipo).padEnd(22)} ${enlace(url, url.replace(/^mailto:|\?.*$/g, '').replace('https://', ''))}`, 'sal', true]),
  equipo: () => {
    cargarEquipo().then(() => setTimeout(() => { if(window.Equipo && !window.Equipo.ocupado) window.Equipo.alguna(); }, 900));
    return [[L('El equipo de Volt:', 'Volt’s team:'), 'acento'], ...[['Tuerca', ['ingeniero de mantenimiento', 'maintenance engineer']], ['Brisa', ['dron de limpieza', 'cleaning drone']], ['Foco', ['el pintor del equipo', 'the team painter']], ['Chispa', ['la más juguetona', 'the playful one']], ['Holo', ['el que cuelga las fotos', 'the photo hanger']]].map(([nombre, rol]) => ({nombre, rol})).map(a => `  ▸ ${a.nombre.padEnd(8)} ${L(a.rol[0], a.rol[1])}`), [L('Mira la página: alguno va a salir a trabajar.', 'Watch the page: one of them is about to get to work.'), 'ok']];
  },
  volt: () => { window.Volt?.decir(L('¿Me llamaste? Estoy aquí abajo.', 'You called? I’m down here.'), {expresion: 'feliz', gesto: 'saludar'}); return [L('Volt fue notificado. Míralo.', 'Volt was notified. Look at him.')]; },
  whoami: () => [L('un visitante con buen gusto', 'a visitor with great taste')],
  ls: () => ['sobre.txt  proyectos/  stack.json  riwi.log  contacto.md  .secreto'],
  date: () => [new Date().toLocaleString(idioma === 'en' ? 'en-US' : 'es-CO')],
  clear: () => { term.textContent = ''; return []; },
  'sudo contratar': () => {
    window.Volt?.celebrar();
    window.Volt?.decir(L('¡Excelente decisión!', 'Excellent decision!'), {expresion: 'amor'});
    lluviaDeChispas();
    return [['[sudo] ' + L('acceso concedido', 'access granted'), 'ok'], L('Iniciando proceso de contratación…', 'Starting hiring process…'), [L('▸ Siguiente paso: escríbele por LinkedIn.', '▸ Next step: message him on LinkedIn.'), 'acento']];
  },
  casos: () => {
    const ids = window.Casos?.lista || [];
    return [[L('Casos de estudio disponibles:', 'Available case studies:'), 'acento'],
      ...ids.map(id => [`  ▸ <a href="#caso-${id}" data-caso="${id}">${id}</a>`, 'sal', true]),
      L('Escribe: caso <nombre>  (por ejemplo: caso facturas)', 'Type: case <name>  (for example: case facturas)')];
  },
  'cat .secreto': () => [L('Prueba el código Konami en cualquier parte: ↑ ↑ ↓ ↓ ← → ← → B A', 'Try the Konami code anywhere: ↑ ↑ ↓ ↓ ← → ← → B A')]
};
const ALIAS = {about:'sobre', projects:'proyectos', contact:'contacto', cases:'casos', team:'equipo', ayuda:'help', 'sudo hire':'sudo contratar', 'sudo contratar-leonardo':'sudo contratar', limpiar:'clear', cls:'clear'};
async function ejecutar(texto){
  const cmd = texto.trim().toLowerCase().replace(/\s+/g, ' ');
  if(!cmd) return;
  historial.push(cmd); posHistorial = historial.length;
  linea(texto.trim(), 'cmd');
  const nombre = ALIAS[cmd] || cmd;
  if(nombre.startsWith('echo ')){ linea(texto.trim().slice(5)); return; }
  const pedido = /^(caso|case) (.+)$/.exec(nombre);
  if(pedido){
    const id = pedido[2].trim();
    if(window.Casos?.lista.includes(id)){ linea(L(`Abriendo el caso ${id}…`, `Opening case ${id}…`), 'ok'); window.Casos.abrir(id); }
    else linea(L(`No existe el caso "${id}". Escribe casos para ver la lista.`, `There’s no case "${id}". Type cases to see the list.`), 'err');
    return;
  }
  const fn = COMANDOS[nombre];
  if(!fn){ linea(L(`comando no encontrado: ${cmd}. Escribe help.`, `command not found: ${cmd}. Type help.`), 'err'); return; }
  const salida = await fn();
  await escribirLineas(salida);
}
$('termForm').addEventListener('submit', e => { e.preventDefault(); const v = termInput.value; termInput.value = ''; ejecutar(v); });
termInput.addEventListener('keydown', e => {
  if(e.key === 'ArrowUp' && historial.length){ posHistorial = Math.max(posHistorial - 1, 0); termInput.value = historial[posHistorial]; e.preventDefault(); }
  if(e.key === 'ArrowDown'){ posHistorial = Math.min(posHistorial + 1, historial.length); termInput.value = historial[posHistorial] || ''; }
  if(e.key === 'Tab'){
    const op = Object.keys(COMANDOS).concat(Object.keys(ALIAS)).find(c => c.startsWith(termInput.value.toLowerCase()) && termInput.value);
    if(op){ termInput.value = op; e.preventDefault(); }
  }
});
$('term').addEventListener('click', e => { if(!e.target.closest('a')) termInput.focus({preventScroll: true}); });
function pintarAtajos(){
  const caja = $('termAtajos');
  caja.textContent = '';
  (idioma === 'en' ? ['help','about','projects','stack','github','contact','sudo hire'] : ['help','sobre','proyectos','stack','github','contacto','sudo contratar'])
    .forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', () => ejecutar(c)); caja.appendChild(b); });
}
let terminalIniciada = false;
async function iniciarTerminal(){
  if(terminalIniciada) return;
  terminalIniciada = true;
  linea(L('Bienvenido a la terminal de Leonardo. v3.0', 'Welcome to Leonardo’s terminal. v3.0'), 'ok');
  // Escribe "help" solo, letra por letra.
  for(const c of 'help'){ termInput.value += c; await new Promise(r => setTimeout(r, MENOS_MOVIMIENTO ? 0 : 130)); }
  termInput.value = '';
  ejecutar('help');
}

// =================================================================== chat con Volt
const chat = $('chat'), msgs = $('chatMsgs');
const CHISTES = {
  es:['¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25.','Hay 10 tipos de personas: las que entienden binario y las que no.','Mi código no tiene bugs. Tiene funcionalidades sorpresa.','¿Cuántos programadores se necesitan para cambiar un bombillo? Ninguno, es un problema de hardware.'],
  en:['Why do programmers mix up Halloween and Christmas? Because OCT 31 = DEC 25.','There are 10 kinds of people: those who understand binary and those who don’t.','My code has no bugs. It has surprise features.','How many programmers does it take to change a light bulb? None, that’s a hardware problem.']
};
const INTENCIONES = [
  {re:/hora|time|zona|timezone|despiert|awake|duerme|sleep/, r: () => {
    const m = window.Volt?.momento || 'tarde', h = window.Volt?.horaTexto?.() || '';
    const frase = {
      manana: L('Leonardo está arrancando el día.', 'Leonardo is starting his day.'),
      tarde: L('Leonardo está trabajando ahora mismo.', 'Leonardo is at work right now.'),
      noche: L('Leonardo está en clase en Riwi; te responde al salir.', 'Leonardo is in class at Riwi; he’ll reply after.'),
      madrugada: L('Leonardo duerme; te responde en la mañana.', 'Leonardo is asleep; he’ll reply in the morning.')
    }[m];
    return {texto: L(`Aquí son las ${h} en Colombia (UTC-5). ${frase}`, `It’s ${h} in Colombia (UTC-5). ${frase}`), ex: m === 'madrugada' ? 'dormido' : 'feliz'};
  }},
  {re:/volt|robot|mascota|qui[eé]n eres|who are you|are you/, r: () => ({texto: L('Soy Volt. Estoy hecho con Three.js: mi cara es un canvas que se redibuja 60 veces por segundo y me muevo con física de resortes. Leonardo me construyó para este portafolio.', 'I’m Volt. I’m made with Three.js: my face is a canvas redrawn 60 times per second and I move with spring physics. Leonardo built me for this portfolio.'), ex:'feliz'})},
  {re:/hola|hello|\bhi\b|buenas|hey|saludos/, r: () => ({texto: L('¡Hola! Pregúntame por los proyectos, las tecnologías o cómo contactar a Leonardo.', 'Hi! Ask me about projects, tech stack or how to reach Leonardo.'), ex:'feliz', ge:'saludar'})},
  {re:/proyect|project|trabaj|work|sistema|hizo|built/, r: () => ({texto: L('Tiene 4 sistemas en producción: un cotizador web, un lector de facturas con IA, una nómina de 55 personas y alertas de vencimientos. En GitHub hay más: Dormify, RiwiMediCare API, GestionCall…', 'He has 4 systems in production: a web quoting app, an AI invoice reader, payroll for 55 employees and expiration alerts. More on GitHub: Dormify, RiwiMediCare API, GestionCall…'), ir:'#proyectos', ge:'senalar'})},
  {re:/tecnolog|stack|lenguaj|skill|herramient|tool|sabe|know|language/, r: () => ({texto: L('Backend con Node.js, TypeScript, NestJS, Python, FastAPI y PostgreSQL. Frontend con JavaScript, React y Vite. Y también Linux, Raspberry Pi y Excel con VBA.', 'Backend with Node.js, TypeScript, NestJS, Python, FastAPI and PostgreSQL. Frontend with JavaScript, React and Vite. Plus Linux, Raspberry Pi and Excel with VBA.'), ir:'#herramientas'})},
  {re:/riwi|estudi|study|formaci|educa|universi|ingenier|carrera|aprend/, r: () => ({texto: L('Se forma en Riwi, en la ruta avanzada de Node.js: Python, frontend, JavaScript, bases de datos y ahora Node.js con NestJS. Su perfil es de Ingeniería de Sistemas.', 'He trains at Riwi on the advanced Node.js track: Python, frontend, JavaScript, databases and now Node.js with NestJS. His background is Systems Engineering.'), ir:'#trayectoria'})},
  {re:/contact|contrat|hire|correo|email|mail|linkedin|vacante|escrib|reach|job/, r: () => ({texto: L('¡Gran idea! Lo más rápido es escribirle por LinkedIn. También puedes ver su código en GitHub.', 'Great idea! The fastest way is LinkedIn. You can also check his code on GitHub.'), links: enlaces(), ex:'amor', ge:'celebrar'})},
  {re:/github|repo|c[oó]digo|code/, r: () => ({texto: L(`Tiene ${reposEnVivo?.public_repos || 48} repositorios públicos. Los mejores están en la sección de GitHub.`, `He has ${reposEnVivo?.public_repos || 48} public repositories. The best ones are in the GitHub section.`), ir:'#github'})},
  {re:/chiste|joke|r[ií]e|funny|gracioso/, r: () => { const l = CHISTES[idioma]; return {texto: l[Math.floor(Math.random() * l.length)], ex:'guino'}; }},
  {re:/baila|dance|fiesta|party/, r: () => { window.Volt?.bailar(); return {texto: L('¡Mira mis pasos!', 'Check out my moves!'), ex:'amor'}; }},
  {re:/gracias|thank|genial|cool|incre[ií]ble|awesome/, r: () => ({texto: L('¡Con gusto! Si quieres, te llevo a contacto.', 'You’re welcome! Want me to take you to contact?'), ex:'amor', ir:'#contacto'})},
  {re:/terminal|comando|command/, r: () => ({texto: L('La terminal está más abajo. Escribe help y prueba sudo contratar', 'The terminal is further down. Type help and try sudo hire'), ir:'#terminal'})}
];
function responder(pregunta){
  const q = pregunta.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const intento = INTENCIONES.find(i => i.re.test(q));
  return intento ? intento.r() : {texto: L('Mmm, eso no lo sé todavía. Prueba con: proyectos, tecnologías, Riwi o contacto.', 'Hmm, I don’t know that yet. Try: projects, tech stack, Riwi or contact.'), ex:'pensando', ge:'pensar'};
}
function mensaje(texto, de){
  const m = document.createElement('div');
  m.className = 'msg ' + (de === 'yo' ? 'msg-yo' : 'msg-volt');
  m.textContent = texto;
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;
  return m;
}
async function preguntar(texto){
  if(!texto.trim()) return;
  mensaje(texto, 'yo');
  tono(900, .05);
  const escribe = document.createElement('div');
  escribe.className = 'msg msg-volt msg-escribe';
  escribe.innerHTML = '<i></i><i></i><i></i>';
  msgs.appendChild(escribe);
  msgs.scrollTop = msgs.scrollHeight;
  window.Volt?.ponerExpresion('pensando', 1);
  await new Promise(r => setTimeout(r, 650 + Math.random() * 400));
  escribe.remove();
  const res = responder(texto);
  const m = mensaje('', 'volt');
  window.Volt?.hablarPor(Math.min(res.texto.length * 22, 3500));
  if(res.ex) window.Volt?.ponerExpresion(res.ex, 3);
  if(res.ge) window.Volt?.hacerGesto(res.ge);
  window.Volt?.reaccionar?.(res.texto);
  // Escribe la respuesta letra por letra.
  for(let i = 1; i <= res.texto.length; i += 2){
    m.textContent = res.texto.slice(0, i);
    msgs.scrollTop = msgs.scrollHeight;
    await new Promise(r => setTimeout(r, MENOS_MOVIMIENTO ? 0 : 14));
  }
  m.textContent = res.texto;
  if(res.ir){
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'redondo'; b.style.marginTop = '10px';
    b.textContent = L('Llévame ahí →', 'Take me there →');
    b.addEventListener('click', () => irA(res.ir));
    m.appendChild(document.createElement('br')); m.appendChild(b);
  }
  if(res.links){
    res.links.forEach(([tipo, url]) => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '↗ ' + t('canal.' + tipo); a.style.display = 'block'; a.style.marginTop = '6px'; m.appendChild(a); });
  }
  msgs.scrollTop = msgs.scrollHeight;
}
function pintarChips(){
  const caja = $('chatChips');
  caja.textContent = '';
  (idioma === 'en' ? ['Who is Leonardo?','Projects','Tech stack','Riwi','Contact','Tell me a joke','Dance!'] : ['¿Quién es Leonardo?','Proyectos','Tecnologías','Riwi','Contacto','Cuéntame un chiste','¡Baila!'])
    .forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', () => preguntar(c)); caja.appendChild(b); });
}
function abrirChat(){
  if(!chat.hidden) return;
  chat.hidden = false;
  window.Volt?.callar();
  if(!msgs.children.length) mensaje(L('¡Hola! Soy Volt, el asistente de Leonardo. ¿Qué quieres saber?', 'Hi! I’m Volt, Leonardo’s assistant. What would you like to know?'), 'volt');
  if(ANIMA) gsap.fromTo(chat, {opacity: 0, scale: .85, y: 30}, {opacity: 1, scale: 1, y: 0, duration: .5, ease: 'back.out(1.6)'});
  setTimeout(() => $('chatInput').focus({preventScroll: true}), 200);
}
function cerrarChat(){
  if(!ANIMA){ chat.hidden = true; return; }
  gsap.to(chat, {opacity: 0, scale: .9, y: 20, duration: .25, ease: 'power2.in', onComplete: () => { chat.hidden = true; }});
}
$('chatCerrar').addEventListener('click', cerrarChat);
$('chatForm').addEventListener('submit', e => { e.preventDefault(); const v = $('chatInput').value; $('chatInput').value = ''; preguntar(v); });
addEventListener('keydown', e => { if(e.key === 'Escape' && !chat.hidden) cerrarChat(); });
addEventListener('volt-clic', e => { if(e.detail.abrirChat) abrirChat(); });

// =================================================================== chispas del cursor
const lienzo = $('chispas'), c2d = lienzo.getContext('2d');
const particulas = [];
function ajustarLienzo(){ const d = Math.min(devicePixelRatio, 2); lienzo.width = innerWidth * d; lienzo.height = innerHeight * d; c2d.setTransform(d, 0, 0, d, 0, 0); }
ajustarLienzo();
addEventListener('resize', ajustarLienzo);
function chispa(x, y, fuerza = 1){
  const a = Math.random() * Math.PI * 2, v = (1 + Math.random() * 3) * fuerza;
  particulas.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .5, vida: 1, color: Math.random() < .2 ? '#F5C542' : (Math.random() < .5 ? '#3FD0FF' : '#7FA2FF')});
}
let ultimo = null;
if(PUNTERO_FINO && !MENOS_MOVIMIENTO){
  addEventListener('pointermove', e => {
    if(ultimo && Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) > 14 && particulas.length < 160) chispa(e.clientX, e.clientY, .5);
    ultimo = {x: e.clientX, y: e.clientY};
  }, {passive: true});
}
addEventListener('pointerdown', e => { if(!MENOS_MOVIMIENTO) for(let i = 0; i < 18; i++) chispa(e.clientX, e.clientY, 1.4); });
function lluviaDeChispas(){ for(let i = 0; i < 120; i++) setTimeout(() => chispa(Math.random() * innerWidth, -10, 1.2), i * 12); }
let lienzoLimpio = true;
(function animarChispas(){
  requestAnimationFrame(animarChispas);
  // Sin chispas no hay nada que borrar ni dibujar.
  if(!particulas.length){
    if(!lienzoLimpio){ c2d.clearRect(0, 0, innerWidth, innerHeight); lienzoLimpio = true; }
    return;
  }
  lienzoLimpio = false;
  c2d.clearRect(0, 0, innerWidth, innerHeight);
  c2d.globalCompositeOperation = 'lighter';
  for(let i = particulas.length - 1; i >= 0; i--){
    const p = particulas[i];
    p.x += p.vx; p.y += p.vy; p.vy += .12; p.vx *= .97; p.vida -= .028;
    if(p.vida <= 0){ particulas.splice(i, 1); continue; }
    c2d.strokeStyle = p.color; c2d.globalAlpha = p.vida; c2d.lineWidth = 2;
    c2d.beginPath(); c2d.moveTo(p.x, p.y); c2d.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); c2d.stroke();
  }
  c2d.globalAlpha = 1;
})();

// =================================================================== sección activa
// Resalta en el menú el enlace de la sección que se está viendo.
// =================================================================== menú
// Rodillo: cada letra del enlace va en su propio span para poder rodar con retraso.
function prepararRodillos(){
  $$('.nav nav .rodillo').forEach(el => {
    const texto = el.textContent;
    el.textContent = '';
    [...texto].forEach((ch, i) => {
      const c = document.createElement('span');
      c.className = 'c'; c.style.setProperty('--i', i); c.textContent = ch;
      el.appendChild(c);
    });
  });
}
prepararRodillos();
addEventListener('idioma-cambiado', prepararRodillos);

// Cortina: al elegir una sección, una cortina sube con su nombre en grande, la página salta
// detrás y la cortina se retira hacia arriba revelándola.
const cortina = document.createElement('div');
cortina.className = 'cortina';
cortina.setAttribute('aria-hidden', 'true');
cortina.innerHTML = '<div class="cortina-in"><span class="cortina-num"></span><p class="cortina-txt"></p><i class="cortina-linea"></i></div>';
document.body.appendChild(cortina);
let enCortina = false;
function irConCortina(enlace){
  const destino = document.querySelector(enlace.getAttribute('href'));
  if(!destino) return;
  if(!window.gsap || enCortina){ irA(enlace.getAttribute('href')); return; }
  enCortina = true;
  const enlaces = $$('.nav nav a'), n = enlaces.indexOf(enlace) + 1;
  const num = cortina.querySelector('.cortina-num'), txt = cortina.querySelector('.cortina-txt'), linea = cortina.querySelector('.cortina-linea');
  num.innerHTML = '<span>' + String(n).padStart(2, '0') + ' / ' + String(enlaces.length).padStart(2, '0') + '</span>';
  txt.textContent = '';
  [...enlace.textContent].forEach(ch => txt.appendChild(Object.assign(document.createElement('span'), {textContent: ch})));
  const letras = txt.children;
  tono(520, .12, 'sine', .025);
  gsap.timeline({onComplete: () => { enCortina = false; gsap.set(cortina, {visibility: 'hidden'}); }})
    .set(cortina, {visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)'})
    .set(letras, {yPercent: 110}).set(num.firstChild, {yPercent: 110}).set(linea, {scaleX: 0})
    .to(cortina, {clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'expo.inOut'})
    .to(letras, {yPercent: 0, duration: .6, stagger: .028, ease: 'expo.out'}, '-=.28')
    .to(num.firstChild, {yPercent: 0, duration: .5, ease: 'expo.out'}, '<')
    .to(linea, {scaleX: 1, duration: .7, ease: 'expo.out'}, '<.1')
    // Con la pantalla cubierta, la página salta a la sección sin que se vea el recorrido.
    .add(() => {
      if(lenis) lenis.scrollTo(destino, {immediate: true, force: true});
      else destino.scrollIntoView();
      ScrollTrigger.update();
    })
    .to({}, {duration: .18})
    .to(letras, {yPercent: -110, duration: .45, stagger: .018, ease: 'expo.in'})
    .to([num.firstChild, linea], {opacity: 0, duration: .3}, '<')
    .to(cortina, {clipPath: 'inset(0% 0% 100% 0%)', duration: .7, ease: 'expo.inOut'}, '-=.25')
    .set([num.firstChild, linea], {opacity: 1});
}
// Se escucha en captura para que el enlace no use el scroll normal.
document.querySelector('.nav nav')?.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  e.preventDefault(); e.stopPropagation();
  irConCortina(a);
}, true);

function marcarSeccion(nombre){
  const href = {sobre:'#sobre-mi', trayectoria:'#trayectoria', proyectos:'#proyectos', github:'#proyectos', terminal:'#terminal', contacto:'#contacto'}[nombre];
  $$('.nav nav a').forEach(a => a.classList.toggle('activo', a.getAttribute('href') === href));
}

// Lo que dice Volt al llegar a cada sección (una sola vez).
const FRASES_SECCION = {
  sobre:['Este es Leonardo. Créeme, programa más rápido de lo que yo vuelo.','This is Leonardo. Trust me, he codes faster than I fly.','feliz'],
  trayectoria:['De HTML y PHP a NestJS. ¡Qué viaje!','From HTML and PHP to NestJS. What a journey!','sorpresa'],
  proyectos:['Estos sistemas los usa una empresa real todos los días.','A real company uses these systems every day.','feliz'],
  web:['Son capturas reales. Toca otro sitio para verlo.','These are real screenshots. Tap another site to see it.','feliz'],
  github:['Puedes filtrar por backend o frontend. ¡Pruébalo!','You can filter by backend or frontend. Try it!','guino'],
  terminal:['Psst… escribe sudo contratar','Psst… type sudo hire','guino'],
  contacto:['¿Hablamos? Leonardo responde rápido.','Let’s talk? Leonardo replies fast.','amor']
};
const dichas = new Set();
function alEntrarSeccion(nombre){
  marcarSeccion(nombre);
  if(nombre === 'terminal') iniciarTerminal();
  const f = FRASES_SECCION[nombre];
  if(f && !dichas.has(nombre) && chat.hidden && window.Volt){
    dichas.add(nombre);
    window.Volt.decir(f[idioma === 'en' ? 1 : 0], {expresion: f[2], gesto: nombre === 'proyectos' ? 'senalar' : null, segundos: 3.5});
  }
}

// =================================================================== desplazamiento
let lenis = null;
function irA(sel){
  const destino = document.querySelector(sel);
  if(!destino) return;
  if(lenis) lenis.scrollTo(destino, {duration: 1.5}); else destino.scrollIntoView({behavior: MENOS_MOVIMIENTO ? 'auto' : 'smooth'});
}

// =================================================================== animaciones
let stManifiesto = null, twContacto = null;
function animarManifiesto(){
  if(stManifiesto) stManifiesto.kill();
  const tw = gsap.to('#manifiesto .pal', {opacity: 1, stagger: .08, ease: 'none',
    scrollTrigger: {trigger: '#manifiesto', start: 'top 82%', end: 'bottom 50%', scrub: true}});
  stManifiesto = tw.scrollTrigger;
}
function animarContacto(){
  if(twContacto){ twContacto.scrollTrigger?.kill(); twContacto.kill(); }
  twContacto = gsap.from('.contacto-grande .ch', {yPercent: 115, rotate: 8, stagger: .045, duration: 1.1, ease: 'power4.out',
    scrollTrigger: {trigger: '.contacto-grande', start: 'top 85%'}});
}

function iniciarAnimaciones(){
  if(!MENOS_MOVIMIENTO && typeof window.Lenis !== 'undefined'){
    lenis = new Lenis({duration: 1.15, smoothWheel: true});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    lenis.stop();
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id.length < 2 || !document.querySelector(id)) return;
    e.preventDefault(); irA(id);
  }));

  gsap.set('.hero-nombre .ch', {yPercent: 115});
  gsap.set('[data-anim="sub"]', {y: 30, opacity: 0});
  gsap.set('.nav', {y: -30, opacity: 0});

  ScrollTrigger.create({start: 80, onUpdate: s => $('nav').classList.toggle('solida', s.scroll() > 80)});

  $$('[data-seccion]').forEach(sec => ScrollTrigger.create({trigger: sec, start: 'top 55%', end: 'bottom 55%',
    onEnter: () => alEntrarSeccion(sec.dataset.seccion), onEnterBack: () => alEntrarSeccion(sec.dataset.seccion)}));

  gsap.to('.hero-txt', {yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});

  const filas = $$('.mq-fila');
  ScrollTrigger.create({trigger: '.marquesina', start: 'top bottom', end: 'bottom top', onUpdate: s => {
    const sesgo = gsap.utils.clamp(-14, 14, s.getVelocity() / -240);
    gsap.to(filas, {skewX: sesgo, duration: .3, overwrite: true, onComplete: () => gsap.to(filas, {skewX: 0, duration: .8, ease: 'power3.out'})});
  }});

  // Títulos que se descifran al aparecer.
  $$('.titulo-sec [data-scramble]').forEach(el => {
    gsap.from(el.parentElement, {y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: el, start: 'top 88%',
      onEnter: () => descifrar(el, 1000)}});
  });
  $$('.etiqueta, .sec-intro, .proy-desc').forEach(el => gsap.from(el, {y: 24, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: {trigger: el, start: 'top 90%'}}));

  $$('[data-contar]').forEach(el => {
    const o = {v: 0};
    ScrollTrigger.create({trigger: el, start: 'top 88%', once: true, onEnter: () =>
      gsap.to(o, {v: +el.dataset.contar, duration: 2.2, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v)})});
  });
  gsap.from('.cifra', {y: 50, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: '.cifras', start: 'top 85%'}});
  gsap.from('.esp-card', {y: 90, opacity: 0, rotateX: -10, stagger: .15, duration: 1.2, ease: 'power3.out', scrollTrigger: {trigger: '.esp-grid', start: 'top 85%'}});

  gsap.to('#ltProgreso', {scaleY: 1, ease: 'none', scrollTrigger: {trigger: '#lineaTiempo', start: 'top 65%', end: 'bottom 65%', scrub: true}});
  $$('.hito').forEach(h => {
    ScrollTrigger.create({trigger: h, start: 'top 65%', onEnter: () => { h.classList.add('activo'); tono(1300, .04); }, onLeaveBack: () => h.classList.remove('activo')});
    gsap.from(h.querySelector('div'), {x: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: h, start: 'top 82%'}});
  });

  ScrollTrigger.matchMedia({
    '(min-width: 1024px)': () => {
      const pista = $('pista');
      const distancia = () => pista.scrollWidth - innerWidth;
      const tw = gsap.to(pista, {x: () => -distancia(), ease: 'none',
        scrollTrigger: {trigger: '#proyectos', start: 'top top', end: () => '+=' + distancia(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => gsap.set('#proyBarra', {scaleX: s.progress})}});
      $$('.proy').forEach(card => gsap.from(card, {opacity: .25, scale: .88, rotateY: -16, ease: 'none',
        scrollTrigger: {trigger: card, containerAnimation: tw, start: 'left 100%', end: 'left 55%', scrub: true}}));
      return () => gsap.set(pista, {x: 0});
    },
    '(max-width: 1023px)': () => {
      $$('.proy').forEach(card => gsap.from(card, {y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: card, start: 'top 88%'}}));
    }
  });

  gsap.from('#ghGrid .repo', {y: 70, opacity: 0, rotateX: -12, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: '#ghGrid', start: 'top 85%'}});
  gsap.from('.filtros', {x: 40, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: {trigger: '.filtros', start: 'top 90%'}});
  gsap.from('#term', {y: 80, opacity: 0, scale: .95, duration: 1.1, ease: 'power3.out', scrollTrigger: {trigger: '#term', start: 'top 88%'}});
  gsap.from('#termAtajos button', {y: 20, opacity: 0, stagger: .05, duration: .6, ease: 'power3.out', scrollTrigger: {trigger: '#termAtajos', start: 'top 95%'}});
  gsap.from('.contacto-txt, .canales', {y: 30, opacity: 0, stagger: .15, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: '.contacto-txt', start: 'top 90%'}});
}

function intro(){
  const tl = gsap.timeline({defaults: {ease: 'power4.out'}});
  tl.to('.nav', {y: 0, opacity: 1, duration: 1})
    .to('.hero-nombre .linea:first-child .ch', {yPercent: 0, stagger: .05, duration: 1.2}, '<.05')
    .to('.hero-nombre .linea:last-child .ch', {yPercent: 0, stagger: .06, duration: 1.2}, '<.25')
    .to('[data-anim="sub"]', {y: 0, opacity: 1, stagger: .1, duration: 1}, '<.3')
    .add(() => descifrar($$('.hero-rol [data-scramble]')[0], 1200), '<');
  setInterval(rotar, 2600);
}

// Volt se carga después de la intro: así no compite con la escena 3D en la carga inicial.
// Espera a que el navegador quede libre: así el texto de la portada responde primero.
function cargarEquipo(){
  return window.Equipo ? Promise.resolve() : import('./equipo.js').catch(() => {});
}
function cargarVolt(){
  const ir = () => cargarVoltYa();
  setTimeout(() => 'requestIdleCallback' in window ? requestIdleCallback(ir, {timeout: 1200}) : ir(), 500);
}
function cargarVoltYa(){
  import('./mascota.js')
    // El equipo de ayudantes llega después, cuando Volt ya está en pantalla.
    // En celulares el equipo no se carga solo: taparía el texto y sería una tercera escena 3D.
    // Se carga cuando se pide desde la terminal.
    .then(() => { if(innerWidth >= 760) setTimeout(cargarEquipo, 3000); })
    .catch(() => { $('voltHit')?.remove(); });
}

// Pantalla de carga con registro de arranque.
function cargar(){
  const num = $('loaderNum'), barra = $('loaderBarra'), log = $('loaderLog');
  const PASOS = idioma === 'en'
    ? ['loading 3D scene','waking up Volt','connecting to GitHub','ready']
    : ['cargando escena 3D','despertando a Volt','conectando con GitHub','listo'];
  const o = {v: 0};
  let escenaLista = !!window.__escenaLista;
  addEventListener('escena-lista', () => escenaLista = true, {once: true});
  // Quien ya vio la intro en esta visita no espera otra vez la carga completa.
  let repetida = false;
  try{ repetida = sessionStorage.getItem('intro-vista') === '1'; sessionStorage.setItem('intro-vista', '1'); }catch(e){}
  const rapido = repetida ? .35 : 1;
  const limite = performance.now() + (repetida ? 1500 : 3000);
  let paso = 0;
  const avanzarLog = v => {
    while(paso < PASOS.length && v >= (paso + 1) * 24){
      log.lastElementChild?.classList.add('ok');
      const li = document.createElement('li'); li.textContent = PASOS[paso++]; log.appendChild(li);
    }
  };
  const pintar = () => { num.textContent = Math.round(o.v); gsap.set(barra, {scaleX: o.v / 100}); avanzarLog(o.v); };

  let salio = false;
  setTimeout(() => { if(!salio){ gsap.killTweensOf(o); gsap.set('#loader', {display: 'none'}); terminar(); } }, 6500);
  function terminar(){
    if(salio) return;
    salio = true;
    $('loader')?.remove();
    document.body.classList.remove('cargando');
    if(lenis) lenis.start();
    window.__introHecha = true;
    dispatchEvent(new Event('intro'));
    cargarVolt();
    intro();
    ScrollTrigger.refresh();
  }
  gsap.to(o, {v: 85, duration: .9 * rapido, ease: 'power2.out', onUpdate: pintar, onComplete: function esperar(){
    if(!escenaLista && performance.now() < limite){ gsap.delayedCall(.1, esperar); return; }
    gsap.to(o, {v: 100, duration: .25 * rapido, ease: 'power1.out', onUpdate: pintar, onComplete: () => {
      log.lastElementChild?.classList.add('ok');
      gsap.timeline()
        .to('.loader > *', {y: -30, opacity: 0, stagger: .05, duration: .35, ease: 'power3.in', delay: .1})
        .to('#loader', {clipPath: 'circle(0% at 50% 50%)', duration: .7, ease: 'expo.inOut'}, '-=.1')
        .add(terminar, '-=.45');
    }});
  }});
}

// =================================================================== interacciones del puntero
function activarInclinacion(){
  if(!PUNTERO_FINO || !ANIMA) return;
  $$('[data-tilt]').forEach(card => {
    if(card._inclinacion) return;
    card._inclinacion = true;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, {rotateY: x * 10, rotateX: -y * 10, transformPerspective: 1000, duration: .5, ease: 'power3.out'});
    });
    card.addEventListener('pointerleave', () => gsap.to(card, {rotateY: 0, rotateX: 0, duration: .9, ease: 'elastic.out(1,.5)'}));
  });
}
function iniciarPuntero(){
  if(!PUNTERO_FINO || !ANIMA) return;
  document.addEventListener('pointermove', e => {
    $$('[data-magnetic]').forEach(el => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const cerca = Math.hypot(dx, dy) < Math.max(r.width, r.height) * .9;
      gsap.to(el, cerca ? {x: dx * .3, y: dy * .35, duration: .4, ease: 'power3.out'} : {x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)'});
    });
  });
  activarInclinacion();
  $$('[data-scramble-hover]').forEach(el => el.parentElement.addEventListener('pointerenter', () => descifrar(el, 450)));
}
// Brillo que sigue al puntero dentro de las tarjetas.
document.addEventListener('pointermove', e => {
  const el = e.target.closest?.('[data-glow]');
  if(!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
});

// =================================================================== arranque
$('idioma').addEventListener('click', () => {
  idioma = idioma === 'en' ? 'es' : 'en';
  try{ localStorage.setItem('idioma', idioma); }catch(e){}
  aplicarIdioma();
  window.Volt?.decir(idioma === 'en' ? 'Switching to English! 🇺🇸' : '¡Ahora en español! 🇨🇴', {expresion: 'feliz', segundos: 2});
});
$('anio').textContent = new Date().getFullYear();
$$('.hero-nombre [data-split]').forEach(partirLetras);
if('scrollRestoration' in history) history.scrollRestoration = 'manual';
if(!location.hash) scrollTo(0, 0);

if(ANIMA){
  gsap.registerPlugin(ScrollTrigger);
  // Las animaciones avanzan por reloj real aunque el navegador entregue pocos cuadros.
  gsap.ticker.lagSmoothing(0);
  aplicarIdioma();
  iniciarAnimaciones();
  iniciarPuntero();
  cargar();
}else{
  aplicarIdioma();
  $('loader').remove();
  document.body.classList.remove('cargando');
  window.__introHecha = true;
  cargarVolt();
  setInterval(rotar, 2600);
  new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) iniciarTerminal(); })).observe($('term'));
}

// =================================================================== visor de imágenes
// Un clic en cualquier captura y Holo la proyecta en grande, como holograma: entra en cian
// con líneas de barrido y luego se ve a todo color. Las capturas de página completa se pueden
// recorrer hacia abajo dentro del visor.
const IMAGENES_AMPLIABLES = '.proy-visual img, .repo-foto img, .sim-captura img, #webEscritorio, #webCelular';
const visor = document.createElement('div');
visor.className = 'visor';
visor.hidden = true;
visor.setAttribute('role', 'dialog');
visor.setAttribute('aria-modal', 'true');
visor.innerHTML = `<div class="visor-fondo"></div>
  <figure class="visor-holo">
    <i class="visor-esquina"></i><i class="visor-esquina"></i><i class="visor-esquina"></i><i class="visor-esquina"></i>
    <div class="visor-marco"><img alt=""></div>
    <figcaption class="visor-pie"></figcaption>
    <button type="button" class="visor-cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
  </figure>`;
document.body.appendChild(visor);
const visorImg = visor.querySelector('img'), visorPie = visor.querySelector('.visor-pie'), visorHolo = visor.querySelector('.visor-holo');
let cerrarHolo = null, focoPrevio = null;

function abrirVisor(img){
  const src = img.src || img.currentSrc;
  if(!src) return;
  focoPrevio = document.activeElement;
  visorImg.src = src;
  visorImg.alt = img.alt || '';
  // Sin texto alternativo, el pie toma el nombre del proyecto de la tarjeta.
  const titulo = img.closest('.repo, .proy, .caso-panel')?.querySelector('h3, .caso-barra h2, #casoTitulo')?.textContent?.trim();
  visorPie.textContent = img.alt || titulo || L('Captura del proyecto', 'Project screenshot');
  visor.setAttribute('aria-label', L('Imagen ampliada', 'Enlarged image'));
  visor.querySelector('.visor-cerrar').setAttribute('aria-label', L('Cerrar', 'Close'));
  // Las capturas muy altas (páginas completas) se recorren con scroll dentro del marco.
  visor.classList.toggle('alta', (img.naturalHeight / Math.max(img.naturalWidth, 1)) > 1.2);
  visor.querySelector('.visor-marco').scrollTop = 0;
  visor.hidden = false;
  document.documentElement.classList.add('con-visor');
  lenis?.stop();
  requestAnimationFrame(() => visor.classList.add('abierto'));
  tono(1100, .08, 'sine', .03);
  visor.querySelector('.visor-cerrar').focus({preventScroll: true});
  // Holo llega a proyectarla cuando el visor terminó de abrirse (si el equipo ya cargó y está libre).
  clearTimeout(abrirVisor.holo);
  abrirVisor.holo = setTimeout(() => { if(!visor.hidden && visor.classList.contains('abierto')) cerrarHolo = window.Equipo?.proyectar?.(() => visorHolo.getBoundingClientRect()) || null; }, 700);
}
function cerrarVisor(){
  if(visor.hidden) return;
  visor.classList.remove('abierto');
  clearTimeout(abrirVisor.holo);
  cerrarHolo?.(); cerrarHolo = null;
  document.documentElement.classList.remove('con-visor');
  lenis?.start();
  setTimeout(() => { visor.hidden = true; visorImg.removeAttribute('src'); }, 320);
  focoPrevio?.focus?.({preventScroll: true});
}
// Se escucha en captura para que el clic en la imagen no abra también el caso de estudio de la tarjeta.
document.addEventListener('click', e => {
  const img = e.target.closest?.(IMAGENES_AMPLIABLES);
  if(!img || visor.contains(img)) return;
  e.preventDefault(); e.stopPropagation();
  abrirVisor(img);
}, true);
visor.querySelector('.visor-fondo').addEventListener('click', cerrarVisor);
visor.querySelector('.visor-cerrar').addEventListener('click', cerrarVisor);
addEventListener('keydown', e => { if(e.key === 'Escape' && !visor.hidden){ e.stopPropagation(); cerrarVisor(); } }, true);
