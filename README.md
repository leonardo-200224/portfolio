# Portafolio de Leonardo Ayala

Sitio estático (HTML, CSS y JavaScript, sin compilar ni instalar nada), en español e inglés.
Las librerías se cargan desde CDN: Three.js (3D), GSAP con ScrollTrigger (animaciones de scroll) y Lenis (desplazamiento suave).

```
index.html            La página
404.html              Página para enlaces que no existen
assets/styles.css     Estilos (Unbounded, Geist y Geist Mono)
assets/main.js        Datos de contacto, idioma, terminal, chat, proyectos de GitHub y animaciones
assets/escena.js      Escena 3D del chip con pulsos de corriente
assets/mascota.js     Volt, la mascota 3D: cara animada, expresiones, gestos, física de resortes y hora de Colombia
assets/casos.js       Casos de estudio con diagramas de arquitectura animados (enlace directo: #caso-<id>)
sitemap.xml           Mapa del sitio para Google
assets/favicon.svg    Ícono de la pestaña
assets/og-image.png   Imagen que sale al compartir el enlace (LinkedIn, WhatsApp)
```

## Cosas para probar

- Haz clic en Volt para abrir el chat. Si le das 5 clics rápidos, se marea.
- Si no mueves el mouse por 14 segundos, Volt se duerme.
- En la terminal: `help`, `github` (datos en vivo) y `sudo contratar`.
- El código Konami (↑ ↑ ↓ ↓ ← → ← → B A) en cualquier parte hace bailar a Volt.
- El botón del parlante activa sonidos sintetizados (vienen apagados).

## Datos de contacto

Están en el bloque `CONTACTO` al principio de `assets/main.js`. Ya tiene LinkedIn y GitHub; lo que quede vacío no aparece.
Para agregar la hoja de vida, copia el PDF en `assets/` y pon su ruta en `cv`.

## Publicado en

https://leonardo-200224.github.io/portfolio/ (repositorio `leonardo-200224/portfolio`, GitHub Pages desde `main` / raíz).
Para actualizarlo, sube los cambios a la rama `main` y GitHub Pages lo republica en uno o dos minutos.

## Verlo en tu equipo

```bash
npx http-server . -p 4321
```

Y abre http://localhost:4321.
