// Casos de estudio como simulación: en lugar de leer el caso, el visitante lo ejecuta.
// Un paquete de datos recorre la arquitectura paso a paso, el inspector muestra cómo
// cambia la información y la consola registra lo que haría el sistema real.
// Usa las utilidades de main.js ($, $$, L, idioma, ANIMA, lenis, tono, MENOS_MOVIMIENTO).
//
// Cada texto es [español, inglés]. Tipos de paso:
//   antes   el proceso manual, con el escenario apagado
//   (normal) un paquete viaja de un nodo a otro
//   final   resultados
// Un paso puede tener "opciones" (el visitante decide) o "control" (un deslizador).
// Los datos son de ejemplo: muestran la forma de la información, no cifras de clientes.

const CASOS = [
  {
    id: 'cotizador', tipo: ['En producción · código privado', 'In production · private code'],
    titulo: ['Cotizador web', 'Web quoting app'],
    lema: ['Del Excel copiado a mano al PDF oficial en dos clics.', 'From a hand-copied Excel file to the official PDF in two clicks.'],
    stack: 'Node.js · Express · PostgreSQL · JWT · pdf-lib · Render · Neon',
    captura: 'img/cotizador/cotizacion.jpg',
    nodos: [
      {id: 'u', t: ['Vendedor', 'Salesperson'], s: ['Navegador', 'Browser'], c: 0, f: 1},
      {id: 'api', t: ['API Express', 'Express API'], s: ['JWT · límite de intentos', 'JWT · rate limiting'], c: 1, f: 1, clave: true},
      {id: 'aiu', t: ['Precios y AIU', 'Pricing & AIU'], s: ['IVA solo a la utilidad', 'VAT on profit only'], c: 2, f: 0},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Neon · nube', 'Neon · cloud'], c: 3, f: 0},
      {id: 'pdf', t: ['Generador PDF', 'PDF generator'], s: ['pdf-lib · formato F-02', 'pdf-lib · F-02 format'], c: 2, f: 2},
      {id: 'out', t: ['Cotización', 'Quote'], s: ['Lista para enviar', 'Ready to send'], c: 3, f: 2}
    ],
    flechas: [['u', 'api'], ['api', 'aiu'], ['aiu', 'db'], ['api', 'pdf'], ['pdf', 'out']],
    pasos: [
      {tipo: 'antes', titulo: ['Así se cotizaba', 'How quoting used to work'],
        texto: ['Copiar el Excel de la última cotización, buscar cada precio y aplicar el AIU a mano. Dos vendedores podían dar dos precios distintos para lo mismo.',
                'Copy the last quote’s Excel file, look up every price and apply the AIU formula by hand. Two salespeople could quote two different prices for the same job.'],
        datos: {archivo: 'cotizacion_final_v3_ESTA_SI.xlsx', precio_emt: '¿8.434? ¿8.900?', iva: 'sobre el total (error)'},
        log: ['abrir cotizacion_final_v3_ESTA_SI.xlsx', 'buscar precio: "tubería EMT 3/4"…', 'aplicar IVA al total  ✗']},
      {titulo: ['El vendedor arma la cotización', 'The salesperson builds the quote'], activos: ['u'],
        texto: ['Elige productos del catálogo y la cantidad. No escribe ningún precio.', 'Picks products from the catalog and quantities. No prices are typed.'],
        datos: {cliente: 'Constructora (ejemplo)', items: [{producto: 'Varilla puesta a tierra', cant: 12}, {producto: 'Cable desnudo #2', cant: 80}]},
        log: ['UI: 2 productos agregados']},
      {titulo: ['La API comprueba quién es', 'The API checks who is asking'], paquete: ['u', 'api', 'json', 'POST'],
        texto: ['La sesión viaja en una cookie segura. Si alguien prueba contraseñas, el límite de intentos lo frena.', 'The session travels in a secure cookie. If someone tries guessing passwords, rate limiting stops them.'],
        datos: {sesion: 'JWT · cookie httpOnly', rol: 'vendedor', intentos_restantes: 4},
        log: ['POST /api/cotizaciones', 'auth: JWT válido · rol=vendedor', 'rate-limit: ok']},
      {titulo: ['El precio se calcula solo', 'The price calculates itself'], paquete: ['api', 'aiu', 'json', 'AIU'],
        texto: ['Costo y mano de obra salen del catálogo; la fórmula AIU vive en el servidor y el IVA va solo sobre la utilidad.', 'Cost and labor come from the catalog; the AIU formula lives on the server and VAT applies only to the profit.'],
        datos: {parcial: 4151290, administracion_10: 415129, imprevistos_2: 83026, utilidad_6: 249077, iva_19_utilidad: 47325, total: 4945847},
        log: ['aiu: parcial=4151290', 'aiu: IVA calculado sobre utilidad ✓']},
      {titulo: ['Queda en el historial', 'It’s saved to the history'], paquete: ['aiu', 'db', 'fila', 'SQL'],
        texto: ['Cada cotización se guarda con su número y su total. Ya no hay versiones perdidas en carpetas.', 'Every quote is stored with its number and total. No more versions lost in folders.'],
        datos: {numero: 'COT-26081', estado: 'generada', total: 4945847},
        log: ['INSERT INTO cotizaciones … 1 fila']},
      {titulo: ['Se arma el PDF oficial', 'The official PDF is built'], paquete: ['api', 'pdf', 'doc', 'F-02'],
        texto: ['pdf-lib llena el formato oficial de la empresa con logo, tabla y totales.', 'pdf-lib fills the company’s official template with logo, table and totals.'],
        datos: {plantilla: 'F-02', paginas: 1, firma: 'incluida'},
        log: ['pdf: plantilla F-02 cargada', 'pdf: 2 líneas · 1 página']},
      {titulo: ['Listo para enviar', 'Ready to send'], paquete: ['pdf', 'out', 'pdf', 'PDF'],
        texto: ['El vendedor descarga el PDF y lo envía. Dos clics desde que eligió los productos.', 'The salesperson downloads the PDF and sends it. Two clicks after choosing the products.'],
        datos: {archivo: 'COT-26081.pdf', clics: 2},
        log: ['GET /api/cotizaciones/26081/pdf  200']},
      {tipo: 'final', resultados: [
        ['1', ['catálogo único para todo el equipo', 'single catalog for the whole team']],
        ['2', ['clics para tener el PDF oficial', 'clicks to get the official PDF']],
        ['0', ['cálculos de AIU hechos a mano', 'AIU calculations done by hand']]
      ]}
    ]
  },
  {
    id: 'facturas', tipo: ['En producción · código privado', 'In production · private code'],
    titulo: ['Lector de facturas con IA supervisada', 'Invoice reader with supervised AI'],
    lema: ['La IA ayuda, pero una persona tiene la última palabra.', 'AI helps, but a person has the final say.'],
    stack: 'Python · PostgreSQL · Google Drive API · Google Sheets API · Gemini · systemd · Raspberry Pi 5',
    captura: 'img/facturas/grafica.jpg',
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
    pasos: [
      {tipo: 'antes', titulo: ['Así se hacía', 'How it used to work'],
        texto: ['Alguien abría cada PDF y copiaba NIT, subtotal, IVA y total a la hoja de gastos. Cada proveedor con un formato distinto.',
                'Someone opened every PDF and copied tax ID, subtotal, VAT and total into the expense sheet. Every supplier with a different format.'],
        datos: {pdf_abiertos_hoy: 23, campos_por_factura: 6, errores_de_digitacion: 'frecuentes'},
        log: ['abrir factura_0412.pdf', 'copiar NIT… subtotal… IVA…', 'siguiente PDF (22 restantes)']},
      {titulo: ['La Pi revisa Drive', 'The Pi checks Drive'], paquete: ['drive', 'pi', 'pdf', 'PDF'],
        texto: ['Cada 15 minutos una tarea de systemd busca facturas nuevas. Tiene permiso de solo lectura y el PDF se lee en memoria, nunca se guarda.',
                'Every 15 minutes a systemd timer looks for new invoices. It has read-only access and the PDF is read in memory, never stored.'],
        datos: {carpeta: 'Facturas Recibidas', nuevas: 1, permiso: 'solo lectura', pdf_guardado: false},
        log: ['systemd: facturas-procesar.timer → start', 'drive: 1 archivo nuevo']},
      {titulo: ['¿Proveedor conocido?', 'Known supplier?'], activos: ['pi'],
        texto: ['Tú decides el camino de esta factura.', 'You choose this invoice’s path.'],
        opciones: [[['Sí, ya lo conocemos', 'Yes, a known one'], 3], [['No, formato nuevo', 'No, a new format'], 5]],
        datos: {proveedor: '?', plantilla: '?'},
        log: ['buscando plantilla del proveedor…']},
      {titulo: ['Lo leen reglas propias', 'Custom rules read it'], paquete: ['pi', 'reglas', 'json', '{ }'],
        texto: ['Para proveedores conocidos no hace falta IA: una plantilla por proveedor extrae cada campo.', 'Known suppliers don’t need AI: one template per supplier extracts every field.'],
        datos: {proveedor: 'Proveedor A', nit: '900.123.456-7', subtotal: 1250000, iva: 237500, total: 1487500, metodo: 'reglas'},
        log: ['reglas: plantilla "proveedor_a" ✓', 'campos extraídos: 6/6']},
      {titulo: ['Entra a la base', 'It goes into the database'], paquete: ['reglas', 'db', 'fila', 'SQL'], siguiente: 8,
        texto: ['Lo que leen las reglas es confiable y pasa directo a los gastos.', 'What the rules read is reliable and goes straight to expenses.'],
        datos: {estado: 'registrada', metodo: 'reglas', total: 1487500},
        log: ['INSERT INTO facturas … 1 fila']},
      {titulo: ['Formato nuevo: lo lee Gemini', 'New format: Gemini reads it'], paquete: ['pi', 'ia', 'ia', 'IA'],
        texto: ['Si ninguna plantilla sirve, Gemini lee el PDF. Pero lo que lee la IA no entra solo a los gastos.', 'If no template fits, Gemini reads the PDF. But what AI reads doesn’t go into expenses on its own.'],
        datos: {proveedor: 'Proveedor nuevo', total: 842000, metodo: 'gemini', estado: 'por_aprobar'},
        log: ['reglas: sin plantilla ✗', 'gemini: lectura completa', 'estado → por_aprobar']},
      {titulo: ['Una persona revisa', 'A person reviews it'], paquete: ['ia', 'panel', 'json', 'REV'],
        texto: ['La factura aparece en el panel web. Ahora eres tú quien aprueba.', 'The invoice shows up in the web panel. Now you’re the one approving.'],
        opciones: [[['Aprobar factura', 'Approve invoice'], 7]],
        datos: {proveedor: 'Proveedor nuevo', total: 842000, estado: 'por_aprobar', aprobada_por: null},
        log: ['panel: 1 factura por aprobar']},
      {titulo: ['Aprobada: entra a la base', 'Approved: into the database'], paquete: ['panel', 'db', 'fila', 'OK'],
        texto: ['El panel solo puede hacer esto: aprobar o descartar. Para todo lo demás usa un usuario de solo lectura.', 'The panel can only do this: approve or discard. For everything else it uses a read-only user.'],
        datos: {proveedor: 'Proveedor nuevo', total: 842000, estado: 'aprobada', aprobada_por: 'tú'},
        log: ['panel: factura aprobada', 'INSERT INTO facturas … 1 fila']},
      {titulo: ['La hoja se actualiza sola', 'The sheet updates itself'], paquete: ['db', 'hoja', 'fila', 'XLS'],
        texto: ['Contabilidad ve la factura en su hoja de control. Y cada noche hay respaldo con 14 días de historia.', 'Accounting sees the invoice in its control sheet. And every night there’s a backup with 14 days of history.'],
        datos: {hoja: 'Control de gastos', filas_nuevas: 1, respaldo: '3:00 a.m. · 14 días'},
        log: ['sheets: hoja actualizada', 'backup: programado 03:00']},
      {tipo: 'final', resultados: [
        ['15', ['minutos entre cada revisión', 'minutes between checks']],
        ['100%', ['de lo leído por IA lo aprueba una persona', 'of AI-read invoices approved by a person']],
        ['0', ['PDF guardados en la Raspberry Pi', 'PDFs stored on the Raspberry Pi']]
      ]}
    ]
  },
  {
    id: 'nomina', tipo: ['En producción · uso interno', 'In production · internal use'],
    titulo: ['Nómina quincenal', 'Biweekly payroll'],
    lema: ['55 netos iguales a la nómina real. Al peso.', '55 net amounts matching the real payroll. To the peso.'],
    stack: 'Excel · VBA',
    captura: 'img/nomina/turnos.jpg',
    // Es el libro real (hojas, columnas y formato) con empleados ficticios, no una captura de la nómina.
    capturaNota: ['El libro real, con empleados ficticios', 'The real workbook, with fictional employees'],
    nodos: [
      {id: 'param', t: ['Parámetros', 'Parameters'], s: ['Recargos y aportes', 'Surcharges & contributions'], c: 0, f: 0},
      {id: 'nov', t: ['Novedades', 'Period events'], s: ['Turnos y horas extra', 'Shifts & overtime'], c: 0, f: 2},
      {id: 'motor', t: ['Motor de cálculo', 'Calculation engine'], s: ['VBA', 'VBA'], c: 1, f: 1, clave: true},
      {id: 'neto', t: ['Nómina y neto', 'Payroll & net pay'], s: ['55 personas', '55 employees'], c: 2, f: 0},
      {id: 'como', t: ['Cómo se calcula', 'How it’s calculated'], s: ['Fórmula de cada valor', 'Formula for each value'], c: 2, f: 1},
      {id: 'aviso', t: ['Avisos', 'Warnings'], s: ['Antes de pagar', 'Before paying'], c: 2, f: 2}
    ],
    flechas: [['param', 'motor'], ['nov', 'motor'], ['motor', 'neto'], ['motor', 'como'], ['motor', 'aviso']],
    pasos: [
      {tipo: 'antes', titulo: ['Así se liquidaba', 'How payroll used to work'],
        texto: ['Una hoja con fórmulas que solo entendía quien la armó. Cambiar algo era arriesgarse a pagar mal.', 'A spreadsheet whose formulas only its author understood. Changing anything risked paying someone wrong.'],
        datos: {formulas_ocultas: 'muchas', quien_la_entiende: 1, documentacion: 'ninguna'},
        log: ['abrir NOMINA_QUINCENA_FINAL(2).xlsx', '#¡REF! en la columna W']},
      {titulo: ['Se anotan las novedades', 'The period’s events go in'], paquete: ['nov', 'motor', 'json', 'NOV'],
        texto: ['Solo lo que cambió en la quincena: turnos, horas extra, incapacidades, descuentos.', 'Only what changed this period: shifts, overtime, sick leave, deductions.'],
        datos: {trabajador: 'Trabajador 17 (ejemplo)', dias: 15, horas_extra_diurnas: 6, incapacidad_dias: 0},
        log: ['novedades: 55 personas cargadas']},
      {titulo: ['Los parámetros entran', 'Parameters come in'], paquete: ['param', 'motor', 'json', '%'],
        texto: ['Recargos y aportes viven en una sola hoja de parámetros, con su origen anotado.', 'Surcharges and contributions live in one parameters sheet, with their source noted.'],
        datos: {extra_diurna: '+25%', recargo_nocturno: '+35%', salud_empleado: '4%', pension_empleado: '4%'},
        log: ['parámetros: 4 valores leídos']},
      {titulo: ['Mueve las horas extra', 'Move the overtime'], activos: ['motor'],
        texto: ['El motor recalcula al instante. Prueba tú: cambia las horas extra de esta persona.', 'The engine recalculates instantly. Try it: change this person’s overtime hours.'],
        control: {etiqueta: ['Horas extra diurnas', 'Daytime overtime hours'], min: 0, max: 24, valor: 6},
        calcular: h => {
          // Ejemplo con salario de 1.800.000 al mes y valor hora de ejemplo.
          const basica = 900000, hora = 7826, extra = Math.round(h * hora * 1.25);
          const devengado = basica + extra, salud = Math.round(devengado * .04), pension = Math.round(devengado * .04);
          return {basica_quincena: basica, horas_extra: h, valor_extras: extra, salud_4: salud, pension_4: pension, neto: devengado - salud - pension};
        },
        log: ['motor: recalculando…']},
      {titulo: ['Nómina y neto', 'Payroll & net pay'], paquete: ['motor', 'neto', 'fila', '$'],
        texto: ['Antes de entregarlo lo comparé con una quincena real: los 55 netos coinciden.', 'Before delivery I compared it with a real pay period: all 55 net amounts match.'],
        datos: {personas: 55, netos_que_cuadran: '55/55', diferencia_maxima: '$0,50 (redondeo)'},
        log: ['validación: 55/55 ✓']},
      {titulo: ['Cada valor se explica', 'Every value is explained'], paquete: ['motor', 'como', 'doc', 'f(x)'],
        texto: ['Una hoja muestra la fórmula y el origen de cada valor. Cualquiera puede revisarla.', 'One sheet shows the formula and source of every value. Anyone can check it.'],
        datos: {hoja: 'COMO_SE_CALCULA', formulas_documentadas: 'todas'},
        log: ['documento: generado']},
      {titulo: ['Avisos antes de pagar', 'Warnings before paying'], paquete: ['motor', 'aviso', 'correo', '!'],
        texto: ['Si algo no cuadra, el sistema avisa antes del pago, no después.', 'If something doesn’t add up, the system warns before payment, not after.'],
        datos: {avisos: 0, estado: 'lista para pagar'},
        log: ['avisos: 0 · nómina lista']},
      {tipo: 'final', resultados: [
        ['55/55', ['netos iguales a la nómina real', 'net amounts matching the real payroll']],
        ['$0,50', ['de diferencia máxima, por redondeo', 'maximum difference, from rounding']],
        ['4', ['documentos de capacitación', 'training documents']]
      ]}
    ]
  },
  {
    id: 'alertas', tipo: ['En producción · uso interno', 'In production · internal use'],
    titulo: ['Alertas de vencimientos', 'Expiration alerts'],
    lema: ['Que nadie se quede sin poder subir a la obra por un papel vencido.', 'So nobody is kept off the job site by an expired document.'],
    stack: 'Excel · VBA · Windows Task Scheduler · Email',
    captura: 'img/alertas/dashboard.jpg',
    capturaNota: ['El libro real, con personal ficticio', 'The real workbook, with fictional staff'],
    nodos: [
      {id: 'tarea', t: ['Tarea programada', 'Scheduled task'], s: ['Todos los días', 'Every day'], c: 0, f: 1},
      {id: 'libro', t: ['Libro de personal', 'Staff workbook'], s: ['Excel · VBA', 'Excel · VBA'], c: 1, f: 1, clave: true},
      {id: 'reglas', t: ['Vencimientos', 'Expirations'], s: ['Examen, alturas…', 'Exam, heights…'], c: 2, f: 0},
      {id: 'correo', t: ['Correo de alerta', 'Alert email'], s: ['Antes de que venza', 'Before it expires'], c: 3, f: 0},
      {id: 'cert', t: ['Certificados', 'Certificates'], s: ['Laborales, al instante', 'Employment, instantly'], c: 2, f: 2}
    ],
    flechas: [['tarea', 'libro'], ['libro', 'reglas'], ['reglas', 'correo'], ['libro', 'cert']],
    pasos: [
      {tipo: 'antes', titulo: ['Así se controlaba', 'How it used to be tracked'],
        texto: ['Alguien tenía que acordarse de abrir el archivo y revisar fila por fila. Un vencimiento olvidado dejaba a alguien sin trabajar.', 'Someone had to remember to open the file and check row by row. A forgotten expiration kept someone from working.'],
        datos: {revision: 'manual', frecuencia: 'cuando alguien se acuerda'},
        log: ['abrir BASE_PERSONAL.xlsx', 'revisar fila 1 de 60…']},
      {titulo: ['Cada mañana arranca solo', 'It starts on its own every morning'], paquete: ['tarea', 'libro', 'reloj', '6:00'],
        texto: ['El Programador de tareas de Windows abre el libro todos los días a la misma hora.', 'Windows Task Scheduler opens the workbook every day at the same time.'],
        datos: {disparador: 'diario · 6:00 a.m.', accion: 'abrir libro y revisar'},
        log: ['task-scheduler: alertas_diarias → start']},
      {titulo: ['Simula un vencimiento', 'Simulate an expiration'], paquete: ['libro', 'reglas', 'json', '{ }'],
        texto: ['Mueve los días que faltan para que venza el curso de alturas y mira cuándo se activa la alerta.', 'Move the days left before the heights course expires and see when the alert fires.'],
        control: {etiqueta: ['Días para que venza', 'Days until it expires'], min: 0, max: 60, valor: 45},
        calcular: d => ({trabajador: 'Trabajador 08 (ejemplo)', curso_alturas: `vence en ${d} días`, umbral: '30 días', alerta: d <= 30}),
        log: ['reglas: revisando 4 tipos de vencimiento']},
      {titulo: ['Correo antes de que venza', 'Email before it expires'], paquete: ['reglas', 'correo', 'correo', '@'],
        texto: ['Llega un correo con todo lo que está por vencer, a tiempo para renovarlo.', 'An email arrives with everything about to expire, in time to renew it.'],
        datos: {para: 'talento humano', asunto: 'Vencimientos de esta semana', incluye: ['curso de alturas', 'examen médico']},
        log: ['smtp: correo enviado ✓']},
      {titulo: ['Certificados al instante', 'Certificates instantly'], paquete: ['libro', 'cert', 'doc', 'DOC'],
        texto: ['El mismo libro genera los certificados laborales sin redactarlos a mano.', 'The same workbook issues employment certificates without writing them by hand.'],
        datos: {certificado: 'laboral', tiempo: 'segundos'},
        log: ['certificado: generado']},
      {tipo: 'final', resultados: [
        ['4', ['tipos de vencimiento vigilados', 'kinds of expiration watched']],
        ['1', ['correo automático cada día', 'automatic email every day']],
        ['0', ['revisiones fila por fila', 'row-by-row checks']]
      ]}
    ]
  },
  {
    id: 'dormify', tipo: ['Código abierto', 'Open source'],
    titulo: ['Dormify', 'Dormify'],
    lema: ['Encontrar dónde vivir cerca de la universidad, sin buscar en veinte grupos.', 'Finding a place near campus without searching twenty groups.'],
    stack: 'Python · FastAPI · SQLAlchemy · Pydantic · PostgreSQL · JWT · JavaScript',
    captura: 'img/github/dormify.jpg',
    codigo: 'https://github.com/leonardo-200224/DORMIFY',
    nodos: [
      {id: 'spa', t: ['SPA', 'SPA'], s: ['JavaScript · Bootstrap', 'JavaScript · Bootstrap'], c: 0, f: 1},
      {id: 'api', t: ['API FastAPI', 'FastAPI API'], s: ['6 routers', '6 routers'], c: 1, f: 1, clave: true},
      {id: 'jwt', t: ['Middleware JWT', 'JWT middleware'], s: ['Rutas privadas', 'Private routes'], c: 2, f: 0},
      {id: 'pyd', t: ['Pydantic', 'Pydantic'], s: ['Validación de datos', 'Data validation'], c: 2, f: 2},
      {id: 'orm', t: ['SQLAlchemy', 'SQLAlchemy'], s: ['Modelos', 'Models'], c: 3, f: 1},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Datos', 'Data'], c: 4, f: 1}
    ],
    flechas: [['spa', 'api'], ['api', 'jwt'], ['api', 'pyd'], ['jwt', 'orm'], ['pyd', 'orm'], ['orm', 'db']],
    pasos: [
      {tipo: 'antes', titulo: ['El problema', 'The problem'],
        texto: ['Los arriendos para estudiantes están regados en grupos y redes. No hay cómo comparar ni preguntarle a otros.', 'Student rentals are scattered across groups and social media. There’s no way to compare or ask others.'],
        datos: {fuentes: ['grupo de WhatsApp', 'Marketplace', 'cartel en la portería'], comparar: false},
        log: ['buscar "habitación cerca U"… 47 mensajes']},
      {titulo: ['Busca y guarda favoritos', 'Search and save favorites'], paquete: ['spa', 'api', 'json', 'GET'],
        texto: ['La SPA pide a la API los arriendos cerca de la universidad, sin recargar la página.', 'The SPA asks the API for rentals near campus, without reloading the page.'],
        datos: {endpoint: 'GET /api/properties', filtro: {cerca_de: 'universidad', tipo: 'habitación'}},
        log: ['GET /api/properties?type=room  200']},
      {titulo: ['Rutas privadas con JWT', 'Private routes with JWT'], paquete: ['api', 'jwt', 'json', 'JWT'],
        texto: ['Guardar un favorito o comentar en el foro exige una sesión válida.', 'Saving a favorite or posting in the forum requires a valid session.'],
        datos: {endpoint: 'POST /api/favorites', token: 'Bearer …', usuario: 'estudiante_ejemplo'},
        log: ['auth: token válido']},
      {titulo: ['Datos validados', 'Validated data'], paquete: ['api', 'pyd', 'json', '✓'],
        texto: ['Pydantic revisa cada dato antes de tocar la base: tipos, campos obligatorios, formatos.', 'Pydantic checks every field before touching the database: types, required fields, formats.'],
        datos: {schema: 'PropertyCreate', precio: 650000, tipo: 'habitación', valido: true},
        log: ['pydantic: PropertyCreate ✓']},
      {titulo: ['A la base de datos', 'Into the database'], paquete: ['orm', 'db', 'fila', 'SQL'],
        texto: ['SQLAlchemy traduce los modelos a PostgreSQL: arriendos, servicios, foro y favoritos.', 'SQLAlchemy maps the models to PostgreSQL: rentals, services, forum and favorites.'],
        datos: {tabla: 'favorites', filas_nuevas: 1},
        log: ['INSERT INTO favorites … 1 fila']},
      {tipo: 'final', resultados: [
        ['3', ['módulos: arriendos, servicios y foro', 'modules: rentals, services and forum']],
        ['6', ['grupos de endpoints en la API', 'endpoint groups in the API']],
        ['1', ['SPA sin recargas de página', 'SPA with no page reloads']]
      ]}
    ]
  },
  {
    id: 'medicare', tipo: ['Código abierto · Riwi', 'Open source · Riwi'],
    titulo: ['RiwiMediCare API', 'RiwiMediCare API'],
    lema: ['Cada solicitud de medicamentos con dueño, estado e historial.', 'Every medicine request with an owner, a status and a history.'],
    stack: 'Node.js · TypeScript · Express · Sequelize · PostgreSQL · JWT · Swagger',
    captura: 'img/github/medicare-respuesta.jpg',
    codigo: 'https://github.com/leonardo-200224/-Prueba-M5_2_NodeJS_Final',
    nodos: [
      {id: 'cli', t: ['Cliente', 'Client'], s: ['Clínica o bodega', 'Clinic or warehouse'], c: 0, f: 0},
      {id: 'rutas', t: ['Rutas', 'Routes'], s: ['Swagger', 'Swagger'], c: 1, f: 0},
      {id: 'mw', t: ['Middlewares', 'Middlewares'], s: ['JWT · roles · errores', 'JWT · roles · errors'], c: 2, f: 0},
      {id: 'ctrl', t: ['Controladores', 'Controllers'], s: ['HTTP → servicio', 'HTTP → service'], c: 3, f: 0},
      {id: 'srv', t: ['Servicios', 'Services'], s: ['Reglas de negocio', 'Business rules'], c: 3, f: 1, clave: true},
      {id: 'mod', t: ['Sequelize', 'Sequelize'], s: ['Modelos y relaciones', 'Models & associations'], c: 2, f: 1},
      {id: 'db', t: ['PostgreSQL', 'PostgreSQL'], s: ['Datos', 'Data'], c: 1, f: 1},
      {id: 'seed', t: ['Seeders', 'Seeders'], s: ['CLI y archivos', 'CLI & files'], c: 0, f: 1}
    ],
    flechas: [['cli', 'rutas'], ['rutas', 'mw'], ['mw', 'ctrl'], ['ctrl', 'srv'], ['srv', 'mod'], ['mod', 'db'], ['seed', 'db']],
    pasos: [
      {tipo: 'antes', titulo: ['El problema', 'The problem'],
        texto: ['Las clínicas pedían medicamentos por correo y hojas de cálculo. Nadie sabía en qué iba cada pedido.', 'Clinics ordered medicines by email and spreadsheets. Nobody knew where each order stood.'],
        datos: {canal: 'correo', estado_del_pedido: 'desconocido', responsable: '¿?'},
        log: ['RE: RE: RE: pedido acetaminofén urgente']},
      {titulo: ['La clínica crea la solicitud', 'The clinic creates the request'], paquete: ['cli', 'rutas', 'json', 'POST'],
        texto: ['Una sola llamada con la clínica, la bodega y los medicamentos. Todo documentado en Swagger.', 'One call with the clinic, the warehouse and the medicines. All documented in Swagger.'],
        datos: {endpoint: 'POST /api/requests', clinica: 'Clínica Norte (ejemplo)', items: [{medicamento: 'Acetaminofén 500 mg', cantidad: 200}]},
        log: ['POST /api/requests']},
      {titulo: ['¿Quién eres y qué puedes hacer?', 'Who are you and what can you do?'], paquete: ['rutas', 'mw', 'json', 'JWT'],
        texto: ['El token dice quién pide y su rol decide si puede crear, aprobar o solo consultar.', 'The token says who is asking, and their role decides whether they can create, approve or only read.'],
        datos: {usuario: 'clinica_norte', rol: 'clinic', puede_crear: true, puede_aprobar: false},
        log: ['auth: JWT válido', 'roles: clinic → crear ✓']},
      {titulo: ['El controlador no decide', 'The controller doesn’t decide'], paquete: ['mw', 'ctrl', 'json', 'HTTP'],
        texto: ['Solo traduce la petición HTTP y se la entrega al servicio. Así las reglas no se mezclan con la web.', 'It only translates the HTTP request and hands it to the service. Business rules stay out of the web layer.'],
        datos: {controlador: 'RequestController.create', valida_body: true},
        log: ['controller: body válido']},
      {titulo: ['Las reglas de negocio', 'The business rules'], paquete: ['ctrl', 'srv', 'json', '⚙'],
        texto: ['El servicio revisa stock en la bodega y deja la solicitud en estado pendiente.', 'The service checks warehouse stock and leaves the request as pending.'],
        datos: {stock_disponible: 1200, cantidad_pedida: 200, estado: 'pending'},
        log: ['service: stock suficiente ✓', 'estado → pending']},
      {titulo: ['Queda con historial', 'It keeps a history'], paquete: ['mod', 'db', 'fila', 'SQL'],
        texto: ['Sequelize guarda la solicitud y su relación con clínica, bodega y medicamentos.', 'Sequelize stores the request and its relation to clinic, warehouse and medicines.'],
        datos: {tabla: 'requests', id: 'REQ-0042', estado: 'pending', relaciones: ['clinic', 'warehouse', 'items']},
        log: ['INSERT INTO requests … 1 fila']},
      {tipo: 'final', resultados: [
        ['8', ['capas, una responsabilidad cada una', 'layers, one responsibility each']],
        ['JWT', ['más autorización por roles', 'plus role-based authorization']],
        ['100%', ['de los endpoints en Swagger', 'of endpoints in Swagger']]
      ]}
    ]
  }
];

const tx = par => Array.isArray(par) ? par[idioma === 'en' ? 1 : 0] : par;
const casoPanel = $('caso');
let casoActual = -1, pasoActual = 0, abridor = null;
let reproduciendo = true, temporizador = null, animPaquete = null, datosPrevios = null, valorControl = null;

// ------------------------------------------------------------------ escenario (diagrama)
const COL = 196, FIL = 92, NW = 164, NH = 60, M = 30;
function diagrama(caso){
  const cols = Math.max(...caso.nodos.map(n => n.c)) + 1, filas = Math.max(...caso.nodos.map(n => n.f)) + 1;
  const ancho = M * 2 + (cols - 1) * COL + NW, alto = M * 2 + (filas - 1) * FIL + NH;
  const pos = Object.fromEntries(caso.nodos.map(n => [n.id, {x: M + n.c * COL, y: M + n.f * FIL}]));
  // Conexión en ángulo recto entre los bordes de dos nodos.
  const camino = (a, b) => {
    const p = pos[a], q = pos[b];
    if(p.x === q.x){
      const x = p.x + NW / 2, y1 = q.y > p.y ? p.y + NH : p.y, y2 = q.y > p.y ? q.y : q.y + NH;
      return `M${x} ${y1}V${y2}`;
    }
    const derecha = q.x > p.x;
    const x1 = derecha ? p.x + NW : p.x, x2 = derecha ? q.x : q.x + NW;
    const y1 = p.y + NH / 2, y2 = q.y + NH / 2, xm = (x1 + x2) / 2;
    return y1 === y2 ? `M${x1} ${y1}H${x2}` : `M${x1} ${y1}H${xm}V${y2}H${x2}`;
  };
  const lineas = caso.flechas.map(([a, b]) => `<path class="dg-cable" data-de="${a}" data-a="${b}" d="${camino(a, b)}"/>`).join('');
  // Si un texto no cabe en la caja, se comprime lo justo en vez de salirse.
  const ajuste = (texto, anchoLetra) => texto.length * anchoLetra > NW - 28 ? ` textLength="${NW - 28}" lengthAdjust="spacingAndGlyphs"` : '';
  const cajas = caso.nodos.map(n => {
    const {x, y} = pos[n.id];
    const t = tx(n.t), s = tx(n.s);
    return `<g class="dg-nodo${n.clave ? ' clave' : ''}" data-id="${n.id}">
      <rect class="dg-halo" x="${x - 6}" y="${y - 6}" width="${NW + 12}" height="${NH + 12}" rx="16"/>
      <rect class="dg-caja" x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12"/>
      <circle class="dg-led" cx="${x + NW - 14}" cy="${y + 14}" r="3.5"/>
      <text x="${x + 14}" y="${y + 26}" class="dg-t"${ajuste(t, 8.4)}>${t}</text>
      <text x="${x + 14}" y="${y + 45}" class="dg-s"${ajuste(s, 6.7)}>${s}</text></g>`;
  }).join('');
  return `<svg class="diagrama" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${L('Arquitectura del sistema', 'System architecture')}">
    <g class="dg-cables">${lineas}</g><g class="dg-nodos">${cajas}</g><g class="dg-paquetes"></g></svg>`;
}

// ------------------------------------------------------------------ paquetes de datos
const PAQUETE = {
  pdf: ['#FF6B6B', '#2A0F12'], json: ['#3FD0FF', '#04202A'], fila: ['#34C759', '#06200E'], doc: ['#ECEFF6', '#0B0F17'],
  correo: ['#F5C542', '#2A2006'], ia: ['#A78BFA', '#1A1033'], reloj: ['#F5C542', '#2A2006']
};
function enviarPaquete([de, a, tipo, etiqueta], alLlegar){
  const svg = $('simLienzo').querySelector('svg');
  let cable = svg.querySelector(`.dg-cable[data-de="${de}"][data-a="${a}"]`), reverso = false;
  if(!cable){ cable = svg.querySelector(`.dg-cable[data-de="${a}"][data-a="${de}"]`); reverso = true; }
  if(!cable){ alLlegar?.(); return; }
  $$('.dg-cable', svg).forEach(c => c.classList.toggle('activa', c === cable));
  const [color, fondo] = PAQUETE[tipo] || PAQUETE.json;
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('class', 'dg-paquete');
  const w = Math.max(34, etiqueta.length * 8 + 18);
  g.innerHTML = `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="8" fill="${fondo}" stroke="${color}" stroke-width="2"/>
    <text x="0" y="4.5" text-anchor="middle" fill="${color}">${etiqueta}</text>`;
  g.style.color = color;
  svg.querySelector('.dg-paquetes').appendChild(g);
  const largo = cable.getTotalLength(), dur = MENOS_MOVIMIENTO ? 1 : 1150, t0 = performance.now();
  cancelAnimationFrame(animPaquete);
  const paso = ahora => {
    const k = Math.min((ahora - t0) / dur, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const pt = cable.getPointAtLength((reverso ? 1 - e : e) * largo);
    g.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    if(k < 1){ animPaquete = requestAnimationFrame(paso); return; }
    g.classList.add('llega');
    setTimeout(() => g.remove(), 450);
    encender([a], true);
    tono(1250, .05, 'triangle', .02);
    alLlegar?.();
  };
  animPaquete = requestAnimationFrame(paso);
}
function encender(ids, destello = false){
  $$('#simLienzo .dg-nodo').forEach(n => {
    const on = ids.includes(n.dataset.id);
    n.classList.toggle('activo', on);
    if(on && destello){ n.classList.remove('destello'); void n.getBBox(); n.classList.add('destello'); }
  });
}

// ------------------------------------------------------------------ inspector y consola
function valorJson(v){
  if(v === null) return '<i class="j-nul">null</i>';
  if(typeof v === 'number') return `<i class="j-num">${v}</i>`;
  if(typeof v === 'boolean') return `<i class="j-bool">${v}</i>`;
  if(typeof v === 'string') return `<i class="j-str">"${v.replace(/</g, '&lt;')}"</i>`;
  if(Array.isArray(v)) return `[${v.map(valorJson).join(', ')}]`;
  return `{ ${Object.entries(v).map(([k, x]) => `<i class="j-key">${k}</i>: ${valorJson(x)}`).join(', ')} }`;
}
function pintarDatos(obj){
  const anterior = datosPrevios || {};
  $('simDatos').innerHTML = '{\n' + Object.entries(obj).map(([k, v]) => {
    const cambio = JSON.stringify(anterior[k]) !== JSON.stringify(v);
    return `<span class="j-linea${cambio ? ' cambio' : ''}">  <i class="j-key">"${k}"</i>: ${valorJson(v)}</span>`;
  }).join(',\n') + '\n}';
  datosPrevios = obj;
}
let relojLog = 0;
function registrar(lineas){
  const ol = $('simLog');
  lineas.forEach((l, i) => setTimeout(() => {
    const li = document.createElement('li');
    const base = new Date(Date.now() + (relojLog++) * 1000);
    const hora = new Intl.DateTimeFormat('es-CO', {timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).format(base);
    li.innerHTML = `<span>${hora}</span> ${l.replace(/</g, '&lt;')}`;
    if(/✗|error|#¡REF!/i.test(l)) li.className = 'mal';
    else if(/✓|200|ok\b/i.test(l)) li.className = 'bien';
    ol.appendChild(li);
    while(ol.children.length > 40) ol.firstElementChild.remove();
    ol.scrollTop = ol.scrollHeight;
  }, MENOS_MOVIMIENTO ? 0 : i * 260));
}

// ------------------------------------------------------------------ pasos
function pintarCaso(i){
  const c = CASOS[i];
  $('casoTipo').textContent = `${L('Caso', 'Case')} ${String(i + 1).padStart(2, '0')}/${String(CASOS.length).padStart(2, '0')} · ${tx(c.tipo)}`;
  $('casoTitulo').textContent = tx(c.titulo);
  $('casoLema').textContent = tx(c.lema);
  $('casoStack').textContent = c.stack;
  const codigo = $('casoCodigo');
  codigo.hidden = !c.codigo;
  if(c.codigo) codigo.href = c.codigo;
  $('simLienzo').innerHTML = diagrama(c);
  $('simLog').textContent = '';
  relojLog = 0;
  datosPrevios = null;
  // Barra de pasos, como la de un reproductor de video.
  $('simPista').innerHTML = c.pasos.map((p, n) => `<button type="button" class="sim-seg" data-paso="${n}" aria-label="${L('Paso', 'Step')} ${n + 1}: ${tx(p.titulo || ['Resultado', 'Result'])}"><i></i></button>`).join('');
  $$('#simPista .sim-seg').forEach(b => b.addEventListener('click', () => irAPaso(+b.dataset.paso)));
}

function irAPaso(n){
  const c = CASOS[casoActual], p = c.pasos[n];
  if(!p) return;
  clearTimeout(temporizador);
  pasoActual = n;
  $$('#simPista .sim-seg').forEach((b, k) => { b.classList.toggle('hecho', k < n); b.classList.toggle('actual', k === n); });
  const esc = $('simEscenario');
  esc.classList.toggle('modo-antes', p.tipo === 'antes');
  esc.classList.toggle('modo-final', p.tipo === 'final');
  $('simSello').textContent = p.tipo === 'antes' ? L('Proceso manual', 'Manual process') : p.tipo === 'final' ? L('Sistema en marcha', 'System running') : `${L('Paso', 'Step')} ${n} / ${c.pasos.length - 2}`;

  const relato = $('simPaso'), acciones = $('simAcciones');
  acciones.textContent = '';
  if(p.tipo === 'final'){
    encender(c.nodos.map(x => x.id));
    $$('#simLienzo .dg-cable').forEach(x => x.classList.add('activa'));
    relato.innerHTML = `<span class="sim-num">${L('Resultado', 'Result')}</span>
      <h3>${tx(c.lema)}</h3>
      <div class="sim-resultados">${p.resultados.map(([num, t]) => `<div><b>${num}</b><span>${tx(t)}</span></div>`).join('')}</div>
      ${c.captura ? `<figure class="sim-captura"><img src="${c.captura}" alt="${L('Pantalla real del sistema con datos de ejemplo', 'Real screen of the system with sample data')}" loading="lazy"><figcaption>${c.capturaNota ? tx(c.capturaNota) : L('La aplicación real, con datos de ejemplo', 'The real app, with sample data')}</figcaption></figure>` : ''}`;
    const sig = CASOS[(casoActual + 1) % CASOS.length];
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn-luz';
    b.innerHTML = `<span>${L('Siguiente caso', 'Next case')}: ${tx(sig.titulo)}</span>`;
    b.addEventListener('click', () => mostrarCaso(casoActual + 1));
    const r = document.createElement('button');
    r.type = 'button'; r.className = 'btn btn-borde';
    r.innerHTML = `<span>${L('Ver de nuevo', 'Replay')}</span>`;
    r.addEventListener('click', () => { reproduciendo = true; pintarPlay(); irAPaso(0); });
    acciones.append(b, r);
    pintarDatos({estado: L('en producción', 'in production'), stack: c.stack});
    registrar([L('sistema: todo en marcha ✓', 'system: all running ✓')]);
    if(ANIMA && !MENOS_MOVIMIENTO) gsap.from('.sim-resultados > div', {y: 24, opacity: 0, stagger: .1, duration: .6, ease: 'back.out(1.6)'});
    reproduciendo = false; pintarPlay();
    return;
  }

  relato.innerHTML = `<span class="sim-num">${p.tipo === 'antes' ? L('Antes', 'Before') : String(n).padStart(2, '0')}</span>
    <h3>${tx(p.titulo)}</h3><p>${tx(p.texto)}</p>`;
  if(ANIMA && !MENOS_MOVIMIENTO) gsap.from('#simPaso > *', {y: 18, opacity: 0, stagger: .07, duration: .5, ease: 'power3.out'});

  $$('#simLienzo .dg-cable').forEach(x => x.classList.remove('activa'));
  encender(p.activos || []);
  if(p.paquete) enviarPaquete(p.paquete);
  registrar(p.log || []);

  // Deslizador: el visitante cambia un valor y el inspector se recalcula en vivo.
  if(p.control){
    valorControl = p.control.valor;
    const caja = document.createElement('label');
    caja.className = 'sim-control-valor';
    caja.innerHTML = `<span>${tx(p.control.etiqueta)} <b id="simValor">${valorControl}</b></span>
      <input type="range" min="${p.control.min}" max="${p.control.max}" value="${valorControl}" id="simRango">`;
    acciones.appendChild(caja);
    pintarDatos(p.calcular(valorControl));
    $('simRango').addEventListener('input', e => {
      valorControl = +e.target.value;
      $('simValor').textContent = valorControl;
      pintarDatos(p.calcular(valorControl));
      tono(600 + valorControl * 20, .03, 'sine', .015);
    });
    acciones.appendChild(botonSeguir());
    return;
  }
  pintarDatos(p.datos || {});
  // Decisiones: la simulación espera a que el visitante elija.
  if(p.opciones){
    p.opciones.forEach(([texto, destino]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn-caso sim-opcion';
      b.textContent = tx(texto);
      b.addEventListener('click', () => { registrar([`${L('decisión', 'decision')}: ${tx(texto)}`]); irAPaso(destino); });
      acciones.appendChild(b);
    });
    return;
  }
  if(reproduciendo) temporizador = setTimeout(siguientePaso, p.tipo === 'antes' ? 5200 : 4300);
}
function botonSeguir(){
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'btn-caso';
  b.innerHTML = `${L('Continuar', 'Continue')} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  b.addEventListener('click', siguientePaso);
  return b;
}
function siguientePaso(){
  const p = CASOS[casoActual].pasos[pasoActual];
  irAPaso(p.siguiente ?? pasoActual + 1);
}
function pintarPlay(){
  $('simPlay').innerHTML = reproduciendo
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>';
  $('simPlay').setAttribute('aria-label', reproduciendo ? L('Pausar', 'Pause') : L('Reproducir', 'Play'));
}

// ------------------------------------------------------------------ abrir y cerrar
function mostrarCaso(i, desdeHistorial = false){
  casoActual = (i + CASOS.length) % CASOS.length;
  pintarCaso(casoActual);
  reproduciendo = true; pintarPlay();
  irAPaso(0);
  if(ANIMA && !MENOS_MOVIMIENTO){
    gsap.from('#simLienzo .dg-nodo', {opacity: 0, y: 12, stagger: .06, duration: .5, ease: 'power3.out', delay: .2});
    gsap.from('.caso-id > *', {y: 20, opacity: 0, stagger: .08, duration: .6, ease: 'power3.out'});
  }
  const hash = `#caso-${CASOS[casoActual].id}`;
  if(!desdeHistorial && location.hash !== hash) history.replaceState(null, '', hash);
}
function abrirCaso(id, desdeHistorial = false){
  const i = CASOS.findIndex(c => c.id === id);
  if(i < 0) return;
  if(casoPanel.hidden){
    abridor = document.activeElement;
    casoPanel.hidden = false;
    document.documentElement.classList.add('con-caso');
    if(lenis) lenis.stop();
    if(ANIMA && !MENOS_MOVIMIENTO){
      gsap.fromTo('.caso-fondo', {opacity: 0}, {opacity: 1, duration: .4});
      gsap.fromTo('.caso-panel', {opacity: 0, scale: .96, y: 30}, {opacity: 1, scale: 1, y: 0, duration: .7, ease: 'expo.out'});
    }
  }
  mostrarCaso(i, desdeHistorial);
  $('casoCerrar').focus({preventScroll: true});
}
function cerrarCaso(){
  if(casoPanel.hidden) return;
  clearTimeout(temporizador);
  cancelAnimationFrame(animPaquete);
  const fin = () => {
    casoPanel.hidden = true;
    document.documentElement.classList.remove('con-caso');
    if(lenis) lenis.start();
    history.replaceState(null, '', location.pathname + location.search);
    abridor?.focus?.({preventScroll: true});
  };
  if(!ANIMA || MENOS_MOVIMIENTO) return fin();
  gsap.to('.caso-fondo', {opacity: 0, duration: .3});
  gsap.to('.caso-panel', {opacity: 0, scale: .97, y: 20, duration: .35, ease: 'power3.in', onComplete: fin});
}

// ------------------------------------------------------------------ eventos
$('casoCerrar').addEventListener('click', cerrarCaso);
$('casoPrev').addEventListener('click', () => mostrarCaso(casoActual - 1));
$('casoNext').addEventListener('click', () => mostrarCaso(casoActual + 1));
$('simPlay').addEventListener('click', () => {
  reproduciendo = !reproduciendo; pintarPlay();
  if(reproduciendo){
    const p = CASOS[casoActual].pasos[pasoActual];
    if(p.tipo === 'final') irAPaso(0);
    else if(!p.opciones && !p.control) siguientePaso();
  }else clearTimeout(temporizador);
});
casoPanel.addEventListener('click', e => { if(e.target.closest('[data-cerrar]')) cerrarCaso(); });
addEventListener('keydown', e => {
  if(casoPanel.hidden) return;
  const enCampo = e.target.closest('input');
  if(e.key === 'Escape') cerrarCaso();
  if(enCampo) return;
  if(e.key === 'ArrowRight'){ e.preventDefault(); siguientePaso(); }
  if(e.key === 'ArrowLeft'){ e.preventDefault(); irAPaso(Math.max(pasoActual - 1, 0)); }
  if(e.key === ' ' && !e.target.closest('button')){ e.preventDefault(); $('simPlay').click(); }
  // Mantener el foco dentro del panel.
  if(e.key === 'Tab'){
    const f = $$('.caso-panel button, .caso-panel a[href], .caso-panel input').filter(el => el.offsetParent);
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
addEventListener('idioma-cambiado', () => {
  if(casoPanel.hidden) return;
  const paso = pasoActual;
  pintarCaso(casoActual);
  irAPaso(paso);
});
// Enlaces directos: /portfolio/#caso-facturas abre ese caso al cargar.
function casoDesdeHash(){
  const m = /^#caso-(.+)$/.exec(location.hash);
  if(m) abrirCaso(m[1], true);
}
addEventListener('hashchange', casoDesdeHash);
addEventListener('intro', () => setTimeout(casoDesdeHash, 900), {once: true});

window.Casos = {abrir: abrirCaso, lista: CASOS.map(c => c.id)};
