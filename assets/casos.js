// Casos de estudio: una vista completa por proyecto con contexto, problema,
// solución, diagrama de arquitectura animado y resultados.
// Usa las utilidades de main.js ($, $$, L, idioma, ANIMA, lenis, tono, irA).

// Cada texto es [español, inglés]. Los nodos del diagrama van en una cuadrícula (col, fila).
const CASOS = [
  {
    id: 'cotizador', tipo: ['En producción · código privado', 'In production · private code'],
    titulo: ['Cotizador web', 'Web quoting app'],
    resumen: ['El equipo comercial de una empresa de ingeniería eléctrica arma sus cotizaciones con un catálogo único y descarga el PDF oficial en un par de clics.',
              'The sales team of an electrical engineering company builds quotes from a single catalog and downloads the official PDF in a couple of clicks.'],
    rol: ['Diseño, desarrollo y despliegue de punta a punta', 'End-to-end design, development and deployment'],
    contexto: ['La empresa cotiza todos los días instalaciones eléctricas, puestas a tierra y sistemas solares. Cada cotización sale con el formato oficial de la empresa y la fórmula AIU (administración, imprevistos y utilidad).',
               'The company quotes electrical installations, grounding and solar systems every day. Every quote uses the company’s official format and the AIU formula (administration, contingency and profit).'],
    problema: [
      ['Cada cotización se armaba copiando un Excel y buscando precios a mano.', 'Every quote was built by copying an Excel file and looking up prices by hand.'],
      ['El precio cambiaba según quién la hiciera.', 'The price changed depending on who made it.'],
      ['El IVA se aplicaba mal: va solo sobre la utilidad, no sobre el total.', 'VAT was applied wrong: it goes only on the profit, not on the total.'],
      ['No había un historial central de lo cotizado.', 'There was no central history of what had been quoted.']
    ],
    solucion: [
      ['Catálogo único: cada producto guarda su costo y su mano de obra, y el precio se calcula solo.', 'Single catalog: each product stores its cost and labor, and the price is calculated automatically.'],
      ['La fórmula AIU vive en el servidor, con el IVA aplicado solo sobre la utilidad.', 'The AIU formula lives on the server, with VAT applied only on the profit.'],
      ['PDF con el formato oficial de la empresa, generado con pdf-lib.', 'PDF in the company’s official format, generated with pdf-lib.'],
      ['Roles de vendedor y administrador; las cuentas nuevas esperan aprobación.', 'Salesperson and admin roles; new accounts wait for approval.'],
      ['Sesión con JWT en cookie segura, contraseñas con bcrypt y límite de intentos.', 'JWT session in a secure cookie, bcrypt passwords and rate limiting.'],
      ['Migración de archivos JSON a PostgreSQL y despliegue en Render con la base en Neon.', 'Migration from JSON files to PostgreSQL, deployed on Render with the database on Neon.']
    ],
    nodos: [
      {id: 'u', t: ['Vendedor / Admin', 'Sales / Admin'], s: ['Navegador', 'Browser'], c: 0, f: 1},
      {id: 'api', t: ['API Express', 'Express API'], s: ['JWT · límite de intentos', 'JWT · rate limiting'], c: 1, f: 1, clave: true},
      {id: 'aiu', t: ['Precios y AIU', 'Pricing & AIU'], s: ['IVA solo sobre utilidad', 'VAT on profit only'], c: 2, f: 0},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Neon · nube', 'Neon · cloud'], c: 3, f: 0},
      {id: 'pdf', t: ['Generador PDF', 'PDF generator'], s: ['pdf-lib · formato F-02', 'pdf-lib · F-02 format'], c: 2, f: 2},
      {id: 'out', t: ['Cotización', 'Quote'], s: ['PDF listo para enviar', 'PDF ready to send'], c: 3, f: 2}
    ],
    flechas: [['u', 'api'], ['api', 'aiu'], ['aiu', 'db'], ['api', 'pdf'], ['pdf', 'out']],
    resultados: [
      ['1', ['catálogo único para todo el equipo', 'single catalog for the whole team']],
      ['2', ['clics para tener el PDF oficial', 'clicks to get the official PDF']],
      ['2', ['roles con permisos distintos', 'roles with different permissions']],
      ['0', ['cálculos de AIU hechos a mano', 'AIU calculations done by hand']]
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'bcrypt', 'pdf-lib', 'Render', 'Neon']
  },
  {
    id: 'facturas', tipo: ['En producción · código privado', 'In production · private code'],
    titulo: ['Lector de facturas con IA supervisada', 'Invoice reader with supervised AI'],
    resumen: ['Un servicio que corre 24/7 en una Raspberry Pi 5 lee las facturas de proveedores y alimenta la hoja de gastos. La IA solo interviene cuando hace falta, y siempre con una persona que aprueba.',
              'A 24/7 service on a Raspberry Pi 5 reads supplier invoices and feeds the expense sheet. AI only steps in when needed, and a person always approves.'],
    rol: ['Diseño del sistema, desarrollo y puesta en marcha en la Pi', 'System design, development and setup on the Pi'],
    contexto: ['Las facturas de proveedores llegan en PDF a una carpeta de Google Drive. Contabilidad necesita cada valor en una hoja de control de gastos.',
               'Supplier invoices arrive as PDFs in a Google Drive folder. Accounting needs every amount in an expense control sheet.'],
    problema: [
      ['Alguien tenía que abrir cada PDF y digitar los valores a mano.', 'Someone had to open each PDF and type the amounts by hand.'],
      ['Los errores de digitación llegaban a la contabilidad.', 'Typing mistakes made it into the books.'],
      ['Cada proveedor usa un formato distinto y algunos lo cambian sin avisar.', 'Every supplier uses a different format and some change it without notice.']
    ],
    solucion: [
      ['Una tarea de systemd revisa la carpeta de Drive cada 15 minutos, con permiso de solo lectura.', 'A systemd timer checks the Drive folder every 15 minutes, with read-only access.'],
      ['Los proveedores conocidos se leen con reglas propias, sin IA.', 'Known suppliers are read with custom rules, no AI.'],
      ['Si llega un formato nuevo, Gemini lo lee y la factura queda "por aprobar" en un panel web.', 'When a new format arrives, Gemini reads it and the invoice waits "pending approval" in a web panel.'],
      ['Nada leído por IA entra a los gastos sin que una persona lo apruebe.', 'Nothing read by AI reaches expenses until a person approves it.'],
      ['Los PDF se leen en memoria y nunca se guardan en el equipo.', 'PDFs are read in memory and never stored on the device.'],
      ['El panel consulta con un usuario de solo lectura; respaldo diario con 14 días de historia.', 'The panel uses a read-only database user; daily backups with 14 days of history.']
    ],
    nodos: [
      {id: 'drive', t: ['Google Drive', 'Google Drive'], s: ['Facturas en PDF', 'PDF invoices'], c: 0, f: 1},
      {id: 'pi', t: ['Lector · Pi 5', 'Reader · Pi 5'], s: ['Cada 15 min · systemd', 'Every 15 min · systemd'], c: 1, f: 1, clave: true},
      {id: 'reglas', t: ['Reglas', 'Rules'], s: ['Proveedores conocidos', 'Known suppliers'], c: 2, f: 0},
      {id: 'ia', t: ['Gemini', 'Gemini'], s: ['Solo formatos nuevos', 'New formats only'], c: 2, f: 2},
      {id: 'panel', t: ['Panel web', 'Web panel'], s: ['Una persona aprueba', 'A person approves'], c: 3, f: 2},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Base propia', 'Dedicated database'], c: 3, f: 0},
      {id: 'hoja', t: ['Google Sheets', 'Google Sheets'], s: ['Control de gastos', 'Expense control'], c: 4, f: 0}
    ],
    flechas: [['drive', 'pi'], ['pi', 'reglas'], ['pi', 'ia'], ['reglas', 'db'], ['ia', 'panel'], ['panel', 'db'], ['db', 'hoja']],
    resultados: [
      ['15', ['minutos entre cada revisión automática', 'minutes between automatic checks']],
      ['100%', ['de lo leído por IA lo revisa una persona', 'of AI-read invoices reviewed by a person']],
      ['0', ['PDF guardados en la Raspberry Pi', 'PDFs stored on the Raspberry Pi']],
      ['14', ['días de respaldos diarios', 'days of daily backups']]
    ],
    stack: ['Python', 'PostgreSQL', 'Google Drive API', 'Google Sheets API', 'Gemini', 'systemd', 'Raspberry Pi 5', 'Linux']
  },
  {
    id: 'nomina', tipo: ['En producción · uso interno', 'In production · internal use'],
    titulo: ['Nómina quincenal', 'Biweekly payroll'],
    resumen: ['Un sistema que liquida la nómina de 55 personas cada quincena. Se comprobó contra la nómina real antes de entregarlo.',
              'A system that calculates payroll for 55 employees every two weeks. It was checked against the real payroll before delivery.'],
    rol: ['Análisis del proceso, desarrollo, validación y capacitación', 'Process analysis, development, validation and training'],
    contexto: ['La empresa paga cada quincena a 55 personas con turnos, horas extras, recargos, incapacidades y descuentos que cambian todo el tiempo.',
               'The company pays 55 employees every two weeks, with shifts, overtime, surcharges, sick leave and deductions that change constantly.'],
    problema: [
      ['La nómina vivía en una hoja con fórmulas que solo entendía quien la armó.', 'Payroll lived in a spreadsheet whose formulas only its author understood.'],
      ['Cada cambio era un riesgo de pagar mal.', 'Every change risked paying someone wrong.'],
      ['Nadie podía explicar de dónde salía cada valor.', 'Nobody could explain where each value came from.']
    ],
    solucion: [
      ['Se anotan solo las novedades: quién vino, turnos, horas extras, incapacidades y descuentos.', 'You only enter the period’s events: attendance, shifts, overtime, sick leave and deductions.'],
      ['El sistema calcula salario, auxilio, bono, recargos, horas extras, salud, pensión y neto.', 'The system calculates salary, allowance, bonus, surcharges, overtime, health, pension and net pay.'],
      ['Una hoja explica la fórmula y el origen de cada valor.', 'One sheet explains the formula and source of every value.'],
      ['Avisos cuando algo no cuadra antes de pagar.', 'Warnings when something doesn’t add up before paying.'],
      ['Manual, hoja rápida para imprimir y una copia de práctica con ejercicios.', 'Manual, printable quick sheet and a practice copy with exercises.']
    ],
    nodos: [
      {id: 'param', t: ['Parámetros', 'Parameters'], s: ['Salario mínimo, recargos', 'Minimum wage, surcharges'], c: 0, f: 0},
      {id: 'nov', t: ['Novedades', 'Period events'], s: ['Turnos, extras, ausencias', 'Shifts, overtime, absences'], c: 0, f: 2},
      {id: 'motor', t: ['Motor de cálculo', 'Calculation engine'], s: ['VBA', 'VBA'], c: 1, f: 1, clave: true},
      {id: 'neto', t: ['Nómina y neto', 'Payroll & net pay'], s: ['55 personas', '55 employees'], c: 2, f: 0},
      {id: 'como', t: ['Cómo se calcula', 'How it’s calculated'], s: ['Fórmula de cada valor', 'Formula for each value'], c: 2, f: 1},
      {id: 'aviso', t: ['Avisos', 'Warnings'], s: ['Antes de pagar', 'Before paying'], c: 2, f: 2}
    ],
    flechas: [['param', 'motor'], ['nov', 'motor'], ['motor', 'neto'], ['motor', 'como'], ['motor', 'aviso']],
    resultados: [
      ['55/55', ['netos iguales a la nómina real pagada', 'net amounts matching the real payroll']],
      ['$0,50', ['de diferencia máxima, por redondeo', 'maximum difference, from rounding']],
      ['4', ['documentos de capacitación', 'training documents']],
      ['1', ['copia de práctica para aprender sin riesgo', 'practice copy to learn safely']]
    ],
    stack: ['Excel', 'VBA']
  },
  {
    id: 'alertas', tipo: ['En producción · uso interno', 'In production · internal use'],
    titulo: ['Alertas de vencimientos', 'Expiration alerts'],
    resumen: ['Cada día el sistema revisa la base del personal y avisa por correo antes de que venza algo que impida trabajar en obra.',
              'Every day the system checks the staff database and emails a warning before anything that would stop someone from working on site expires.'],
    rol: ['Desarrollo, automatización y soporte', 'Development, automation and support'],
    contexto: ['En obra eléctrica, cada persona necesita examen médico, curso de alturas, dotación y contrato vigentes para poder trabajar.',
               'On electrical job sites, every worker needs a valid medical exam, work-at-heights course, gear and contract to be allowed to work.'],
    problema: [
      ['El control dependía de que alguien abriera el archivo y revisara fila por fila.', 'Tracking depended on someone opening the file and checking row by row.'],
      ['Un vencimiento olvidado dejaba a una persona sin poder subir a la obra al día siguiente.', 'A forgotten expiration meant a worker couldn’t go on site the next day.']
    ],
    solucion: [
      ['Una tarea programada de Windows abre el libro todos los días.', 'A Windows scheduled task opens the workbook every day.'],
      ['VBA revisa los cuatro vencimientos con umbrales de aviso.', 'VBA checks the four expirations against warning thresholds.'],
      ['Envía un correo con lo que está por vencer.', 'It emails what is about to expire.'],
      ['El mismo libro genera los certificados laborales.', 'The same workbook issues employment certificates.']
    ],
    nodos: [
      {id: 'tarea', t: ['Tarea programada', 'Scheduled task'], s: ['Todos los días', 'Every day'], c: 0, f: 1},
      {id: 'libro', t: ['Libro de personal', 'Staff workbook'], s: ['Excel · VBA', 'Excel · VBA'], c: 1, f: 1, clave: true},
      {id: 'reglas', t: ['Vencimientos', 'Expirations'], s: ['Examen, alturas, contrato…', 'Exam, heights, contract…'], c: 2, f: 0},
      {id: 'correo', t: ['Correo de alerta', 'Alert email'], s: ['Antes de que venza', 'Before it expires'], c: 3, f: 0},
      {id: 'cert', t: ['Certificados', 'Certificates'], s: ['Laborales, al instante', 'Employment, instantly'], c: 2, f: 2}
    ],
    flechas: [['tarea', 'libro'], ['libro', 'reglas'], ['reglas', 'correo'], ['libro', 'cert']],
    resultados: [
      ['4', ['tipos de vencimiento vigilados', 'kinds of expiration watched']],
      ['1', ['correo automático cada día', 'automatic email every day']],
      ['0', ['revisiones fila por fila', 'row-by-row checks']]
    ],
    stack: ['Excel', 'VBA', ['Tareas programadas de Windows', 'Windows Task Scheduler'], ['Correo', 'Email']]
  },
  {
    id: 'dormify', tipo: ['Código abierto', 'Open source'],
    titulo: ['Dormify', 'Dormify'],
    resumen: ['Plataforma para que estudiantes universitarios encuentren dónde vivir cerca de su universidad, con servicios útiles y una comunidad.',
              'A platform for university students to find housing near campus, with useful services and a community.'],
    rol: ['Backend, base de datos y frontend', 'Backend, database and frontend'],
    contexto: ['Los estudiantes que llegan a una ciudad nueva buscan habitación, apartaestudio o residencia cerca de su universidad.',
               'Students arriving in a new city look for a room, studio or residence close to their university.'],
    problema: [
      ['La información está dispersa en grupos y redes sociales.', 'Listings are scattered across groups and social networks.'],
      ['No hay forma de comparar, guardar favoritos ni preguntar a otros estudiantes.', 'There’s no way to compare, save favorites or ask other students.']
    ],
    solucion: [
      ['Tres módulos en el MVP: arriendos, directorio de servicios y foro con comentarios.', 'Three MVP modules: rentals, a services directory and a forum with comments.'],
      ['API REST con FastAPI organizada por recursos, con validación de datos con Pydantic.', 'REST API with FastAPI organized by resource, with Pydantic data validation.'],
      ['Autenticación con JWT y favoritos por usuario.', 'JWT authentication and per-user favorites.'],
      ['PostgreSQL con SQLAlchemy y un frontend SPA en JavaScript con Bootstrap.', 'PostgreSQL with SQLAlchemy and a JavaScript SPA frontend with Bootstrap.']
    ],
    nodos: [
      {id: 'spa', t: ['SPA', 'SPA'], s: ['JavaScript · Bootstrap', 'JavaScript · Bootstrap'], c: 0, f: 1},
      {id: 'api', t: ['API FastAPI', 'FastAPI API'], s: ['6 routers', '6 routers'], c: 1, f: 1, clave: true},
      {id: 'jwt', t: ['Middleware JWT', 'JWT middleware'], s: ['Rutas privadas', 'Private routes'], c: 2, f: 0},
      {id: 'pyd', t: ['Pydantic', 'Pydantic'], s: ['Validación de datos', 'Data validation'], c: 2, f: 2},
      {id: 'orm', t: ['SQLAlchemy', 'SQLAlchemy'], s: ['Modelos', 'Models'], c: 3, f: 1},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Datos', 'Data'], c: 4, f: 1}
    ],
    flechas: [['spa', 'api'], ['api', 'jwt'], ['api', 'pyd'], ['jwt', 'orm'], ['pyd', 'orm'], ['orm', 'db']],
    resultados: [
      ['3', ['módulos: arriendos, servicios y foro', 'modules: rentals, services and forum']],
      ['6', ['grupos de endpoints en la API', 'endpoint groups in the API']],
      ['1', ['SPA sin recargas de página', 'SPA with no page reloads']]
    ],
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Pydantic', 'PostgreSQL', 'JWT', 'JavaScript', 'Bootstrap'],
    enlaces: [['Ver código', 'View code', 'https://github.com/leonardo-200224/DORMIFY']]
  },
  {
    id: 'medicare', tipo: ['Código abierto · Riwi', 'Open source · Riwi'],
    titulo: ['RiwiMediCare API', 'RiwiMediCare API'],
    resumen: ['API REST para que una red de clínicas pida medicamentos a sus bodegas con trazabilidad completa, en lugar de correos y hojas de cálculo.',
              'REST API for a network of clinics to request medicines from their warehouses with full traceability, instead of emails and spreadsheets.'],
    rol: ['Arquitectura y desarrollo del backend', 'Backend architecture and development'],
    contexto: ['Prueba de desempeño de la ruta avanzada de Node.js en Riwi, planteada como un caso real de una red de clínicas.',
               'Performance assessment for Riwi’s advanced Node.js track, framed as a real case for a clinic network.'],
    problema: [
      ['Las solicitudes de medicamentos iban por correo y hojas de cálculo.', 'Medicine requests went through email and spreadsheets.'],
      ['No se sabía en qué estado estaba cada solicitud ni quién la había aprobado.', 'Nobody knew the status of each request or who had approved it.']
    ],
    solucion: [
      ['Gestión de clínicas, bodegas, medicamentos y el ciclo completo de cada solicitud.', 'Management of clinics, warehouses, medicines and the full lifecycle of each request.'],
      ['Arquitectura por capas: rutas, controladores, servicios y modelos separados.', 'Layered architecture: routes, controllers, services and models kept separate.'],
      ['Autenticación con JWT y autorización por roles.', 'JWT authentication and role-based authorization.'],
      ['Carga inicial de datos por consola y por un endpoint que recibe archivos.', 'Seed data via CLI and via an endpoint that accepts file uploads.'],
      ['Documentación interactiva con Swagger.', 'Interactive documentation with Swagger.']
    ],
    nodos: [
      {id: 'cli', t: ['Cliente', 'Client'], s: ['Clínica o bodega', 'Clinic or warehouse'], c: 0, f: 0},
      {id: 'rutas', t: ['Rutas', 'Routes'], s: ['Swagger', 'Swagger'], c: 1, f: 0},
      {id: 'mw', t: ['Middlewares', 'Middlewares'], s: ['JWT · roles · errores', 'JWT · roles · errors'], c: 2, f: 0},
      {id: 'ctrl', t: ['Controladores', 'Controllers'], s: ['HTTP → servicio', 'HTTP → service'], c: 3, f: 0},
      {id: 'srv', t: ['Servicios', 'Services'], s: ['Reglas de negocio', 'Business rules'], c: 3, f: 1, clave: true},
      {id: 'mod', t: ['Sequelize', 'Sequelize'], s: ['Modelos y relaciones', 'Models & associations'], c: 2, f: 1},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Datos', 'Data'], c: 1, f: 1},
      {id: 'seed', t: ['Seeders', 'Seeders'], s: ['CLI y archivos', 'CLI & file upload'], c: 0, f: 1}
    ],
    flechas: [['cli', 'rutas'], ['rutas', 'mw'], ['mw', 'ctrl'], ['ctrl', 'srv'], ['srv', 'mod'], ['mod', 'db'], ['seed', 'db']],
    resultados: [
      ['8', ['capas con una responsabilidad cada una', 'layers, one responsibility each']],
      ['JWT', ['más autorización por roles', 'plus role-based authorization']],
      ['100%', ['de los endpoints documentados en Swagger', 'of endpoints documented in Swagger']]
    ],
    stack: ['Node.js', 'TypeScript', 'Express', 'Sequelize', 'PostgreSQL', 'JWT', 'Multer', 'Swagger'],
    enlaces: [['Ver código', 'View code', 'https://github.com/leonardo-200224/-Prueba-M5_2_NodeJS_Final']]
  }
];

const tx = par => Array.isArray(par) ? par[idioma === 'en' ? 1 : 0] : par;
const casoPanel = $('caso'), casoScroll = $('casoScroll');
let casoActual = -1, abridor = null;

// ------------------------------------------------------------------ diagrama
function diagrama(caso){
  const COL = 196, FIL = 92, W = 164, H = 60, M = 16;
  const cols = Math.max(...caso.nodos.map(n => n.c)) + 1, filas = Math.max(...caso.nodos.map(n => n.f)) + 1;
  const ancho = M * 2 + (cols - 1) * COL + W, alto = M * 2 + (filas - 1) * FIL + H;
  const pos = Object.fromEntries(caso.nodos.map(n => [n.id, {x: M + n.c * COL, y: M + n.f * FIL}]));
  // Conexión en ángulo recto entre los bordes de dos nodos.
  const camino = (a, b) => {
    const p = pos[a], q = pos[b];
    if(p.x === q.x){
      const x = p.x + W / 2, y1 = q.y > p.y ? p.y + H : p.y, y2 = q.y > p.y ? q.y : q.y + H;
      return `M${x} ${y1}V${y2}`;
    }
    const derecha = q.x > p.x;
    const x1 = derecha ? p.x + W : p.x, x2 = derecha ? q.x : q.x + W;
    const y1 = p.y + H / 2, y2 = q.y + H / 2, xm = (x1 + x2) / 2;
    return y1 === y2 ? `M${x1} ${y1}H${x2}` : `M${x1} ${y1}H${xm}V${y2}H${x2}`;
  };
  const lineas = caso.flechas.map(([a, b], i) => {
    const d = camino(a, b);
    return `<path class="dg-cable" d="${d}"/><path class="dg-pulso" d="${d}" pathLength="100" style="animation-delay:${(i * .35).toFixed(2)}s"/>`;
  }).join('');
  // Si un texto no cabe en la caja, se comprime lo justo en vez de salirse.
  const ajuste = (texto, anchoLetra) => texto.length * anchoLetra > W - 28 ? ` textLength="${W - 28}" lengthAdjust="spacingAndGlyphs"` : '';
  const cajas = caso.nodos.map((n, i) => {
    const {x, y} = pos[n.id];
    const titulo = tx(n.t), sub = tx(n.s);
    return `<g class="dg-nodo${n.clave ? ' clave' : ''}" style="--d:${(i * .08).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="${W}" height="${H}" rx="12"/>
      <text x="${x + 14}" y="${y + 26}" class="dg-t"${ajuste(titulo, 8.4)}>${titulo}</text>
      <text x="${x + 14}" y="${y + 45}" class="dg-s"${ajuste(sub, 6.7)}>${sub}</text></g>`;
  }).join('');
  return `<svg class="diagrama" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-label="${L('Diagrama de arquitectura', 'Architecture diagram')}">${lineas}${cajas}</svg>`;
}

// ------------------------------------------------------------------ contenido
const lista = items => `<ul class="caso-lista">${items.map(i => `<li>${tx(i)}</li>`).join('')}</ul>`;
function pintarCaso(i){
  const c = CASOS[i];
  const siguiente = CASOS[(i + 1) % CASOS.length];
  $('casoTipo').textContent = tx(c.tipo);
  $('casoPos').textContent = `${i + 1} / ${CASOS.length}`;
  const enlaces = (c.enlaces || []).map(([es, en, url]) => `<a class="btn btn-borde" href="${url}" target="_blank" rel="noopener"><span>${idioma === 'en' ? en : es} ↗</span></a>`).join('');
  casoScroll.innerHTML = `
    <header class="caso-cab caso-anim">
      <h2 id="casoTitulo">${tx(c.titulo)}</h2>
      <p class="caso-resumen">${tx(c.resumen)}</p>
      <div class="caso-meta">
        <div><span>${L('Mi rol', 'My role')}</span><b>${tx(c.rol)}</b></div>
        <ul class="tags">${c.stack.map(s => `<li>${tx(s)}</li>`).join('')}</ul>
        ${enlaces ? `<div class="caso-enlaces">${enlaces}</div>` : ''}
      </div>
    </header>
    <div class="caso-dos caso-anim">
      <section><h3>${L('Contexto', 'Context')}</h3><p>${tx(c.contexto)}</p></section>
      <section><h3>${L('El problema', 'The problem')}</h3>${lista(c.problema)}</section>
    </div>
    <section class="caso-anim"><h3>${L('La solución', 'The solution')}</h3>${lista(c.solucion)}</section>
    <section class="caso-anim"><h3>${L('Cómo fluye la información', 'How the data flows')}</h3><div class="dg-caja">${diagrama(c)}</div></section>
    <section class="caso-anim"><h3>${L('Resultados', 'Results')}</h3>
      <div class="caso-resultados">${c.resultados.map(([n, t]) => `<div><b>${n}</b><span>${tx(t)}</span></div>`).join('')}</div></section>
    <button type="button" class="caso-siguiente caso-anim" id="casoSiguiente">
      <span>${L('Siguiente caso', 'Next case')}</span><b>${tx(siguiente.titulo)} →</b>
    </button>`;
  $('casoSiguiente').addEventListener('click', () => mostrarCaso((i + 1) % CASOS.length));
  casoScroll.scrollTop = 0;
}

function animarEntrada(){
  if(!ANIMA || MENOS_MOVIMIENTO) return;
  gsap.from('#casoScroll .caso-anim', {y: 40, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', delay: .15});
  gsap.from('#casoScroll .caso-resultados > div', {y: 24, opacity: 0, scale: .94, duration: .6, stagger: .08, ease: 'back.out(1.6)', delay: .6});
}

function mostrarCaso(i, desdeHistorial = false){
  casoActual = (i + CASOS.length) % CASOS.length;
  pintarCaso(casoActual);
  animarEntrada();
  const hash = `#caso-${CASOS[casoActual].id}`;
  if(!desdeHistorial && location.hash !== hash) history.replaceState(null, '', hash);
  tono(880, .05);
}

function abrirCaso(id, desdeHistorial = false){
  const i = CASOS.findIndex(c => c.id === id);
  if(i < 0) return;
  const yaAbierto = !casoPanel.hidden;
  if(!yaAbierto){
    abridor = document.activeElement;
    casoPanel.hidden = false;
    document.documentElement.classList.add('con-caso');
    if(lenis) lenis.stop();
    if(ANIMA && !MENOS_MOVIMIENTO){
      gsap.fromTo('.caso-fondo', {opacity: 0}, {opacity: 1, duration: .4});
      gsap.fromTo('.caso-panel', {yPercent: 100}, {yPercent: 0, duration: .8, ease: 'expo.out'});
    }
  }
  mostrarCaso(i, desdeHistorial);
  $('casoCerrar').focus({preventScroll: true});
}

function cerrarCaso(){
  if(casoPanel.hidden) return;
  const fin = () => {
    casoPanel.hidden = true;
    document.documentElement.classList.remove('con-caso');
    if(lenis) lenis.start();
    history.replaceState(null, '', location.pathname + location.search);
    abridor?.focus?.({preventScroll: true});
  };
  if(!ANIMA || MENOS_MOVIMIENTO) return fin();
  gsap.to('.caso-fondo', {opacity: 0, duration: .35});
  gsap.to('.caso-panel', {yPercent: 100, duration: .5, ease: 'power3.in', onComplete: fin});
}

// ------------------------------------------------------------------ eventos
$('casoCerrar').addEventListener('click', cerrarCaso);
$('casoPrev').addEventListener('click', () => mostrarCaso(casoActual - 1));
$('casoNext').addEventListener('click', () => mostrarCaso(casoActual + 1));
casoPanel.addEventListener('click', e => { if(e.target.closest('[data-cerrar]')) cerrarCaso(); });
addEventListener('keydown', e => {
  if(casoPanel.hidden) return;
  if(e.key === 'Escape') cerrarCaso();
  if(e.key === 'ArrowRight' && !e.target.closest('input')) mostrarCaso(casoActual + 1);
  if(e.key === 'ArrowLeft' && !e.target.closest('input')) mostrarCaso(casoActual - 1);
  // Mantener el foco dentro del panel.
  if(e.key === 'Tab'){
    const f = $$('.caso-panel button, .caso-panel a[href]').filter(el => el.offsetParent);
    if(!f.length) return;
    if(e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f.at(-1).focus(); }
    else if(!e.shiftKey && document.activeElement === f.at(-1)){ e.preventDefault(); f[0].focus(); }
  }
});
// Cualquier elemento con data-caso abre su caso (tarjetas, botones, terminal).
document.addEventListener('click', e => {
  const el = e.target.closest('[data-caso]');
  if(!el || e.target.closest('a[href]:not([data-caso])')) return;
  e.preventDefault();
  abrirCaso(el.dataset.caso);
});
addEventListener('idioma-cambiado', () => { if(!casoPanel.hidden) pintarCaso(casoActual); });
// Enlaces directos: /portfolio/#caso-facturas abre ese caso al cargar.
function casoDesdeHash(){
  const m = /^#caso-(.+)$/.exec(location.hash);
  if(m) abrirCaso(m[1], true);
}
addEventListener('hashchange', casoDesdeHash);
addEventListener('intro', () => setTimeout(casoDesdeHash, 900), {once: true});

window.Casos = {abrir: abrirCaso, lista: CASOS.map(c => c.id)};
