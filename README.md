# Imanes

Cada imán de la nevera lleva detrás una pegatina NFC. Al acercar el móvil se abre la página
de ese lugar con las fotos del viaje.

## Cómo funciona

```
Pegatina  →  https://<dominio>/m/donosti        (no cambia nunca)
                     │  307: redirección temporal, el móvil no la recuerda
                     ▼
             /espana/san-sebastian              (puede cambiar sin regrabar la pegatina)
```

- `content/tags.json` decide a dónde lleva cada pegatina. El destino puede ser una página
  (`"/italia/roma"`) o una dirección externa (`"https://photos.app.goo.gl/…"`).
- Si un destino no existe, `npm run build` falla y te dice cuál.

## Añadir un lugar (3 pasos)

1. Crea la carpeta `content/<pais>/<lugar>/` (minúsculas, sin tildes ni espacios: `san-sebastian`).
   Si el país es nuevo, crea también `content/<pais>/pais.json`:

   ```json
   { "nombre": "Francia", "iso": "FR", "iso3": "FRA" }
   ```

2. Dentro, crea `lugar.json` y copia tus fotos (JPG, PNG o WebP):

   ```json
   { "nombre": "París", "fecha": "2025-06" }
   ```

   Opcional: `"fecha"` (`AAAA-MM` o `AAAA-MM-DD`; si falta, se toma de la fecha de las fotos),
   `"sello"` (`"circulo"`, `"rectangulo"` u `"octogono"`), `"portada"` (`"IMG_0042.jpg"`) y
   `"textos"` (`{ "IMG_0042.jpg": "Torre Eiffel al atardecer" }`) y `"coords"`
   (`[48.8566, 2.3522]`, latitud y longitud, para la chincheta del globo; si falta, se calcula
   con el GPS de las fotos). En `pais.json`, `"tinta"`: `"carmin"`, `"violeta"`, `"cobalto"` o
   `"verde"`.

3. Ejecuta `npm run fotos` y añade la pegatina en `content/tags.json`:

   ```json
   { "paris": "/francia/paris" }
   ```

`npm run fotos` reduce cada foto a 2400 px como máximo, la convierte a WebP, le quita los
metadatos (incluida la ubicación GPS) y la guarda en `public/fotos/`. Solo se suben a Git
esas versiones; los originales de `content/` se quedan en tu ordenador.

> Fotos del iPhone: si están en HEIC, expórtalas como JPG
> (Ajustes → Cámara → Formatos → "Más compatible").

Las fotos `provisional-*.jpg` son de prueba. En cuanto una carpeta tiene alguna foto real,
se ignoran (puedes borrarlas).

## El globo (`/mundo`)

Desde el inicio, el enlace **Mundo** abre una bola del mundo que se gira arrastrando, se acerca
pellizcando (o con la rueda y los botones + / −) y tiene en la tinta de su sello los países con
fotos. Al tocar uno, el globo vuela hasta él, aparecen las chinchetas de sus lugares y sube una
ficha con enlace a cada uno. `/mundo?pais=espana` abre directamente un país.

- La posición de cada lugar sale de `"coords"` en `lugar.json` o, si no hay, de la mediana del
  GPS de sus fotos (las fotos publicadas no llevan GPS). `npm test` comprueba que cada lugar cae
  dentro de su país, por si latitud y longitud están al revés.
- El mapa (Natural Earth, dominio público) lo prepara `npm run mapa`, que se ejecuta solo antes
  de `dev`, `build` y `test`: todo el mundo a escala 1:110m y los países con fotos a 1:50m.

## Grabar una pegatina

NFC Tools (iPhone) → Escribir → Añadir registro → URL → `https://<dominio>/m/<id>` → Escribir.
No la bloquees contra escritura hasta estar seguro del dominio: el bloqueo es irreversible.

## Comandos

| Comando                 | Qué hace                                                 |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Web en local: http://localhost:3000                      |
| `npm run fotos`         | Procesa las fotos nuevas de `content/`                   |
| `npm run provisionales` | Crea fotos de prueba para los lugares sin fotos          |
| `npm test`              | Comprueba fechas, etiquetas y que el contenido es válido |
| `npm run build`         | Compila la web como en producción                        |
| `npm run papel`         | Regenera el guilloché y los iconos                       |
| `npm run mapa`          | Regenera el mapa del globo (se ejecuta solo)             |

## Publicar en Vercel

1. Sube el proyecto a GitHub.
2. En vercel.com → Add New → Project → importa el repositorio (no hace falta configurar nada).
3. Cada `git push` publica los cambios.

Si algún día compras un dominio propio, añádelo en Vercel *antes* de grabar las pegatinas
definitivas: el dominio es lo único de la URL que no se puede cambiar después.
