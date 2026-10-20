# Worldtour

Todos mis viajes en una web, para el ordenador y para el móvil. Se entra por un pasaporte que
se abre solo y se hojea, con un sello por cada lugar; también se pueden buscar en un globo
terráqueo o en una lista por país.

## Las tres vistas

- **Pasaporte (`/`)**: la primera vez de cada visita se abre solo; después se pasan las hojas
  arrastrando, tocando a un lado de la página, con las flechas ‹ › de debajo o con las del
  teclado (Inicio y Fin van a la primera y a la última). En pantallas anchas se ve a doble
  página; en el móvil, una página cada vez. Cada sello lleva a su viaje, y desde el viaje
  «Pasaporte» devuelve a la misma página (`/?p=3`).
- **Mundo (`/mundo`)**: una bola del mundo que se gira arrastrando, se acerca pellizcando (o con
  la rueda y los botones + / −) y tiene en la tinta de su sello los países con fotos. Al tocar
  uno, el globo vuela hasta él y aparecen sus lugares. `/mundo?pais=espana` abre un país.
- **Lista (`/lista`)**: los países plegados; al tocar uno se despliegan sus lugares.

El pasaporte empieza siempre por España; después van el resto de países por la fecha del primer
viaje, y dentro de cada país, los lugares por fecha. Caben cuatro sellos por página: si un país
tiene más, sigue en la siguiente.

## Añadir un lugar (3 pasos)

1. Crea la carpeta `content/<pais>/<lugar>/` (minúsculas, sin tildes ni espacios: `san-sebastian`).
   Si el país es nuevo, crea también `content/<pais>/pais.json`:

   ```json
   { "nombre": "Francia", "iso": "FR", "iso3": "FRA" }
   ```

   La carpeta de un país no puede llamarse `mundo`, `lista` ni `m` (son páginas de la web).

2. Dentro, crea `lugar.json` y copia tus fotos (JPG, PNG o WebP):

   ```json
   { "nombre": "París", "fecha": "2025-06" }
   ```

   Opcional: `"fecha"` (`AAAA-MM` o `AAAA-MM-DD`; si falta, se toma de la fecha de las fotos),
   `"sello"` (`"circulo"`, `"rectangulo"` u `"octogono"`), `"portada"` (`"IMG_0042.jpg"`) y
   `"textos"` (`{ "IMG_0042.jpg": "Torre Eiffel al atardecer" }`) y `"coords"`
   (`[48.8566, 2.3522]`, latitud y longitud, para el punto en el globo; si falta, se calcula
   con el GPS de las fotos). En `pais.json`, `"tinta"`: `"carmin"`, `"violeta"`, `"cobalto"` o
   `"verde"`.

3. Ejecuta `npm run fotos`.

`npm run fotos` reduce cada foto a 2400 px como máximo, la convierte a WebP, le quita los
metadatos (incluida la ubicación GPS) y la guarda en `public/fotos/`. Solo se suben a Git
esas versiones; los originales de `content/` se quedan en tu ordenador.

Las fotos de cada lugar se muestran en el orden en que se hicieron (la fecha y hora que guarda la
cámara), y la portada es la primera salvo que elijas otra con `"portada"`. Las que no tienen esa
información (capturas, fotos reenviadas por WhatsApp) van al final, por nombre. La foto de la
página de datos del pasaporte es la portada del viaje más reciente.

> Fotos del iPhone: si están en HEIC, expórtalas como JPG
> (Ajustes → Cámara → Formatos → "Más compatible").

Las fotos `provisional-*.jpg` son de prueba. En cuanto una carpeta tiene alguna foto real,
se ignoran (puedes borrarlas).

## El mapa del globo

- La posición de cada lugar sale de `"coords"` en `lugar.json` o, si no hay, de la mediana del
  GPS de sus fotos (las fotos publicadas no llevan GPS). `npm test` comprueba que cada lugar cae
  dentro de su país, por si latitud y longitud están al revés.
- El mapa (Natural Earth, dominio público) lo prepara `npm run mapa`, que se ejecuta solo antes
  de `dev`, `build` y `test`: todo el mundo a escala 1:110m y los países con fotos a 1:50m.

## Comandos

| Comando                 | Qué hace                                                    |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Web en local: http://localhost:3000                         |
| `npm run fotos`         | Procesa las fotos nuevas de `content/`                      |
| `npm run provisionales` | Crea fotos de prueba para los lugares sin fotos             |
| `npm test`              | Comprueba fechas, el pasaporte y que el contenido es válido |
| `npm run build`         | Compila la web como en producción                           |
| `npm run papel`         | Regenera el guilloché y los iconos                          |
| `npm run mapa`          | Regenera el mapa del globo (se ejecuta solo)                |

## Publicar en Vercel

1. Sube el proyecto a GitHub.
2. En vercel.com → Add New → Project → importa el repositorio (no hace falta configurar nada).
3. Cada `git push` publica los cambios.

## Mantenimiento: direcciones antiguas `/m/<id>`

La web no las enlaza en ningún sitio, pero siguen funcionando para que no se rompa ningún enlace
antiguo: `content/tags.json` dice a dónde lleva cada una (`{ "roma": "/italia/roma" }`) y la
redirección es temporal (307). Si un destino no existe, `npm run build` falla y dice cuál.
