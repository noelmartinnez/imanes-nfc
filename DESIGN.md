---
name: Worldtour
description: El pasaporte de los viajes; un sello por lugar, y cada sello abre la hoja con las fotos de ese viaje.
colors:
  papel: "#e9efeb"
  papel-hondo: "#dde6e1"
  regla: "#b4c4bd"
  perforado: "#7c918a"
  guilloche: "#4f8c86"
  texto: "#1b2830"
  texto-suave: "#4a5b62"
  carmin: "#b02a3e"
  violeta: "#5a3d98"
  cobalto: "#2348a3"
  verde: "#2c7651"
  tapa: "#24121a"
  tapa-hondo: "#170b10"
  tapa-texto: "#f0e6e3"
  tapa-suave: "#b9a5a6"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 15.5vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "normal"
    fontVariation: "'wdth' 62.5"
  display-vista:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 12vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    fontVariation: "'wdth' 62.5"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 12vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.9
    fontVariation: "'wdth' 62.5"
  headline-pais:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 7vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.9
    fontVariation: "'wdth' 62.5"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 62.5"
  title-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.2em"
    fontVariation: "'wdth' 62.5"
  label-vista:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 62.5"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'tnum' 1"
  body-strong:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.12em"
  data:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.06em"
  mrz:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "min(3.15vw, 15px)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
  label-caps:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 75"
rounded:
  bandera: "1px"
  foto: "2px"
  boton: "3px"
  control: "9999px"
spacing:
  medianil: "16px"
  medianil-ancho: "32px"
  hueco-galeria: "8px"
  objetivo-tactil: "44px"
  cabecera: "56px"
  hoja: "576px"
  ficha-panel: "380px"
  barra-vistas: "400px"
  lugar-ancho: "1280px"
  portada-columna: "416px"
  portada-columna-xl: "480px"
components:
  boton-primario:
    backgroundColor: "{colors.texto}"
    textColor: "{colors.papel}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.boton}"
    padding: "0 20px"
    height: "48px"
  boton-primario-hover:
    backgroundColor: "{colors.cobalto}"
  enlace-volver:
    textColor: "{colors.texto-suave}"
    typography: "{typography.title-sm}"
    height: "{spacing.objetivo-tactil}"
    padding: "0 8px"
  enlace-volver-hover:
    textColor: "{colors.texto}"
  barra-vistas:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.boton}"
    padding: "4px"
    width: "{spacing.barra-vistas}"
  barra-vistas-opcion:
    textColor: "{colors.texto-suave}"
    typography: "{typography.label-vista}"
    rounded: "{rounded.foto}"
    height: "{spacing.objetivo-tactil}"
  barra-vistas-opcion-movil:
    height: "56px"
  barra-vistas-activa:
    backgroundColor: "{colors.texto}"
    textColor: "{colors.papel}"
    rounded: "{rounded.foto}"
  tapa-pasaporte:
    backgroundColor: "{colors.tapa}"
    textColor: "{colors.tapa-texto}"
    rounded: "{rounded.boton}"
  boton-pagina:
    textColor: "{colors.texto}"
    rounded: "{rounded.control}"
    size: "{spacing.objetivo-tactil}"
  boton-pagina-hover:
    backgroundColor: "{colors.papel}"
  boton-pagina-desactivado:
    textColor: "{colors.regla}"
  pais-desplegable:
    textColor: "{colors.texto}"
    typography: "{typography.headline-pais}"
    padding: "20px 0"
  foto:
    backgroundColor: "{colors.papel-hondo}"
    rounded: "{rounded.foto}"
  control-visor:
    textColor: "{colors.tapa-texto}"
    rounded: "{rounded.control}"
    size: "{spacing.objetivo-tactil}"
  etiqueta-campo:
    textColor: "{colors.texto-suave}"
    typography: "{typography.label}"
  chip-pais:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.carmin}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.boton}"
    padding: "0 12px"
    height: "{spacing.objetivo-tactil}"
  chip-pais-pulsado:
    backgroundColor: "{colors.carmin}"
    textColor: "{colors.papel}"
  zoom-globo:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.texto}"
    rounded: "{rounded.boton}"
    size: "{spacing.objetivo-tactil}"
  zoom-globo-hover:
    backgroundColor: "{colors.papel-hondo}"
  etiqueta-chincheta:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.carmin}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.foto}"
    padding: "2px 6px"
  ficha:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.boton}"
    width: "{spacing.ficha-panel}"
---

# Design System: Worldtour

## Overview

**Creative North Star: "El pasaporte es la interfaz"**

La entrada no es un dibujo de un pasaporte sino el objeto: una libreta de piel burdeos con grano y un emblema estampado en lámina, que descansa sobre una mesa de papel de seguridad, se abre sola la primera vez, se inclina bajo la mano y se hojea página a página. Cada hoja de visado es el mundo de siempre: papel verde menta grisáceo y frío con trama de guilloché, microimpresión, número de página perforado con láser y, en la página de datos, la zona de lectura mecánica (MRZ). Sobre ese papel la única tinta saturada es la de los sellos de goma, una por país; cada sello es un lugar y al tocarlo vuela hasta la página de ese viaje.

Tres vistas comparten una misma cáscara: una banda fina arriba con la marca y los recuentos, y una barra de vistas abajo (Pasaporte · Mundo · Lista) al alcance del pulgar. El pasaporte y el globo son pantallas fijas que se quedan con los gestos; la lista y las páginas de lugar son hojas que se desplazan. Escritorio y móvil son iguales: a doble página y a dos columnas en pantallas anchas, a una página con el lomo a la izquierda y una columna de 576px en el móvil.

La profundidad nace del objeto, no de la interfaz: solapamiento, cantos de páginas apiladas, el filo de piel alrededor de las páginas abiertas, el pliegue junto al lomo y la sombra de la hoja que gira. El sistema rechaza, de forma confirmada en el contrato de dirección, la rejilla de tarjetas de fotos con un título sobre un degradado, la app de fotos oscura a sangre y el álbum de recortes con polaroids y cinta adhesiva.

**Key Characteristics:**
- El pasaporte es un objeto físico con física de muelle: se abre, se inclina, sus hojas giran sobre el lomo.
- Papel de seguridad frío (nunca crema) con trama de guilloché en todas las hojas; la mesa es el mismo papel, más hondo.
- Cuatro tintas de sello como único color saturado; una tinta por país.
- La tapa es piel burdeos con grano; su rotulación y su emblema son lámina que recoge la luz al inclinarse.
- Archivo extracondensado en mayúsculas para nombres; Azeret Mono para datos, etiquetas y MRZ.
- Profundidad por solapamiento y por el propio libro; ninguna sombra de interfaz.
- Una barra de vistas compartida; la opción activa es un recorte de tinta oscura que se desliza.
- El globo de /mundo es el mismo papel grabado: océano en `papel-hondo` con la trama, tierra en `papel` con filetes finos y los países visitados entintados como su sello.

## Colors

Una base neutra de papel de seguridad verde grisáceo y tinta azul pizarra, cuatro tintas de sello saturadas y una piel burdeos para la tapa del pasaporte y el visor.

### Primary
- **Tinta Carmín** (`carmin`): tinta de sello. Las tintas se reparten por país (`carmin`, `violeta`, `cobalto`, `verde`; asignada en `content/<pais>/pais.json` o derivada del slug) y nunca colorean texto corrido, fondos ni controles genéricos.
- **Tinta Violeta** (`violeta`): tinta de sello; también la del sello "Sin registrar" de la página 404.
- **Tinta Cobalto** (`cobalto`): tinta de sello y, además, el único color de interacción de la interfaz: anillo de foco, selección de texto, hover del botón primario y de los nombres de lugar en las filas.
- **Tinta Verde** (`verde`): tinta de sello.

### Secondary
- **Guilloché Verde Azulado** (`guilloche`): el color de la línea de microimpresión. La trama de fondo (`ondas.svg`) y la roseta (`roseta.svg`) se dibujan con un verde azulado y un lila más claros, fijados en `scripts/papel.mjs` y nunca usados fuera de esos recursos.

### Neutral
- **Papel de Visado** (`papel`): fondo del `html` y de toda hoja (lista, lugar, país, 404, páginas de visado), siempre bajo la trama de guilloché. También es el `theme-color` del navegador, el fondo de la banda superior (al 90%) y el de la barra de vistas.
- **Papel Hondo** (`papel-hondo`): la mesa sobre la que descansa el pasaporte y las guardas de su interior (con la trama y la roseta), el hueco de una foto mientras carga, las miniaturas, la banda de la MRZ (al 80%) y la fila activa de la ficha.
- **Regla** (`regla`): reglas de 1px (bajo el nombre, entre filas, en la microimpresión), el borde de la barra de vistas, el filo de cada página, las líneas de los cantos y el color de la barra de desplazamiento. También es el color de un botón de página desactivado.
- **Perforado** (`perforado`): los agujeros del número de página y el borde discontinuo del estado sin fotos.
- **Tinta de Texto** (`texto`): todo el texto principal; fondo del botón primario y del recorte activo de la barra de vistas. Al 11% es la sombra del pliegue junto al lomo.
- **Texto Suave** (`texto-suave`): etiquetas de campo, datos en mono, enlace de volver, opciones inactivas de la barra y textos de estado.
- **Tapa** (`tapa`): la piel de la tapa y la contratapa del pasaporte, con su grano.
- **Tapa Honda** (`tapa-hondo`): fondo del visor y el tono con que se oscurece la hoja que gira.
- **Texto de Tapa** (`tapa-texto`) y **Tapa Suave** (`tapa-suave`): la lámina de la tapa (degradado de `tapa-suave` a `tapa-texto` con un reflejo casi blanco en el centro), y los iconos y el contador del visor.

### Named Rules
**The Una Tinta Rule.** El color saturado es tinta de sello y nada más. Cada país lleva una sola tinta; la interfaz solo toma prestado el cobalto para foco, selección y hover.

**The Nunca Crema Rule.** El papel es verde menta grisáceo y frío. Un papel cálido o crema rompe el mundo.

**The Tinta del País Rule.** La tinta de un país puede marcar lo que pertenece a ese país y a nada más: sus sellos, su nombre en la cabecera de sus páginas de visado, su relleno en el globo, su chip, sus chinchetas, su nombre en la ficha y su nombre en la lista (al pasar por encima y desplegado). Nunca colorea controles genéricos (barra de vistas, paginador, zoom, cerrar, cabecera), que siguen en `texto` / `texto-suave` sobre `papel`. En el frontmatter, `chip-pais` y `etiqueta-chincheta` muestran `carmin` como ejemplo; cada país usa la suya.

**The Burdeos Es Tapa Rule.** Los burdeos (`tapa`, `tapa-hondo`) son la piel del pasaporte: tapa, contratapa, el filo alrededor de las páginas abiertas y el visor. Nunca son el fondo de una hoja ni del `html`.

## Typography

**Display Font:** Archivo variable con eje `wdth` (con ui-sans-serif, system-ui)
**Body Font:** Archivo
**Label/Mono Font:** Azeret Mono (con ui-monospace)

**Character:** Un grotesco condensado en mayúsculas pesadas, como los nombres y sellos impresos en un visado, frente a un mono técnico de documento oficial para datos, contadores y la MRZ. Las cifras son tabulares en todo el sitio (`tnum`).

### Hierarchy
- **Display** (800, `wdth` 62.5, clamp(3rem, 15.5vw, 5.25rem), interlineado 0.86, mayúsculas, `text-balance`): el nombre del lugar y del país, una vez por página.
- **Display de vista** (800, `wdth` 62.5, clamp(3rem, 12vw, 6rem), 0.86, mayúsculas): el título de la lista, "Por país".
- **Headline** (800, `wdth` 62.5, clamp(2.5rem, 12vw, 3.75rem), 0.9, mayúsculas): el titular de la 404.
- **Headline de país** (800, `wdth` 62.5, clamp(2.25rem, 7vw, 4rem), 0.9, mayúsculas, con 0.14em de aire arriba para la tilde de la Ñ): el nombre de cada país en la lista desplegable.
- **Title** (800, `wdth` 62.5, 30px, 1, mayúsculas): nombres de lugar en las filas (lista, índice de país, ficha) y en "Pasar página".
- **Title pequeño** (800, `wdth` 62.5, 17px, tracking 0.2em, mayúsculas): la marca "Worldtour", el enlace de volver y el botón primario (este último a 0.12em).
- **Label de vista** (800, `wdth` 62.5, 15px, tracking 0.14em, mayúsculas; 12px en el móvil, bajo el icono): las opciones de la barra de vistas y el enlace "Ver en el globo".
- **Body** (400–600, 17px, 1.625, máximo 34ch): textos de estado y valores de campo (País, Fecha) en 600.
- **Label** (Azeret Mono 600, 11px, tracking 0.12em, mayúsculas): las etiquetas de campo del bloque de datos, como en un visado.
- **Data** (Azeret Mono 500, 12px, tracking 0.06em, mayúsculas): recuentos de la banda superior, rótulo del paginador (`DATOS · PÁG. 01 · ESPAÑA`), fechas, contador del visor `01 / 05`.
- **MRZ** (Azeret Mono 500, min(3.15vw, 15px), 1.5, al 80% de opacidad): las dos líneas de lectura mecánica.
- **Microimpresión** (Azeret Mono 600, 5px, interlineado 7px, `guilloche`): textura, decorativa y `aria-hidden`.
- **Label en versalitas condensadas** (`label-caps`: Archivo 700, `wdth` 75, 15px, tracking 0.1em, mayúsculas): chips de país del globo, encabezados de país del índice (a 0.12em) y el aviso "sin fotos". La etiqueta de una chincheta usa la variante extracondensada (800, `wdth` 62.5, 15px, tracking 0.08em, interlineado 1), porque es un nombre de lugar.
- **Nombre de país en la ficha** (800, `wdth` 62.5, 40px, interlineado 1.05, mayúsculas, en la tinta del país): el título de la ficha del globo, truncado a una línea.
- **Impreso del pasaporte** (en `cqw`, unidades del contenedor de la página): todo lo impreso en las caras del libro escala con la página. "Pasaporte" a 7cqw (800, `wdth` 62.5), nombre del país a 5cqw (700, `wdth` 75, tracking 0.12em, en su tinta), etiquetas de campo en mono a 2.3cqw y valores en mono a 3.6cqw, MRZ a 3.25cqw.

### Named Rules
**The Nombre Condensado Rule.** Los nombres propios (lugar, país, marca) van en Archivo extracondensado 800 en mayúsculas. Ningún otro texto usa ese registro a tamaño display.

**The Dato en Mono Rule.** Todo lo que un funcionario sellaría o leería por máquina (fechas, códigos ISO3, recuentos, número de foto, número de página, MRZ) va en Azeret Mono.

**The Página Es Un Objeto Rule.** Lo impreso en el pasaporte se mide en `cqw` de la página, nunca en px ni en `vw`: una página se ve igual en un móvil que en una pantalla grande.

## Layout

**La cáscara.** El pasaporte, el globo y la lista comparten una banda superior fija de 56px (`cabecera`) en `papel` al 90%, con la marca a la izquierda y los recuentos en mono a la derecha (dentro de un máximo de 90rem, medianil de 16px; 32px desde 1024px), y la microimpresión debajo a todo el ancho. Abajo, la barra de vistas: en el móvil a 16px de cada borde y 12px sobre la zona segura; desde 640px, centrada y de 400px (`barra-vistas`). En el móvil, cuando sube la ficha de un país, la barra baja fuera de la pantalla (320ms, `ease-drawer`) y le cede su sitio.

**El pasaporte.** Pantalla fija (`overflow: hidden` en el `html`) sobre la mesa (`papel-hondo` con la trama y una roseta al 50% detrás). El libro llena el hueco entre la banda y la barra: las páginas tienen la proporción de un pasaporte ICAO TD3 (88 × 125), ocupan hasta el 90% del alto libre y el 92% del ancho. Si caben dos páginas de al menos 280px, se ve a doble página (datos a la izquierda, primera página de España a la derecha); si no, una sola página con el lomo a la izquierda. Bajo el libro, a 12px, el paginador. La página que se ve queda en la URL (`?p=`) para volver a ella desde un viaje.

**La lista.** Hoja que se desplaza, máximo 72rem, medianil de 16px (32px desde 1024px). Título de vista y, debajo, los países separados por reglas; al desplegarse, sus lugares en una columna, o en dos con 48px de hueco desde 1024px. Hueco inferior de 7rem para que la barra no tape la última fila.

**La página de lugar.** En el móvil, una sola columna de 576px (`hoja`) con medianiles de 16px: cabecera de 56px (volver a la izquierda, número perforado a la derecha), microimpresión, portada a 4:5 a todo el ancho con el sello (44% del ancho, máximo 210px) montado sobre su esquina inferior derecha y sobresaliendo 32px, el nombre en display, una regla y la rejilla de dos campos (País, Fecha); después, el resto de fotos en dos columnas de mampostería con 8px de hueco. Desde 1024px la hoja crece hasta 1280px (`lugar-ancho`) con medianil de 32px y se parte en dos columnas: a la izquierda, fija al desplazar (sticky a 24px), la portada con su sello y los datos (416px, `portada-columna`; 480px desde 1280px); a la derecha, a 48px (64px desde 1280px), la mampostería en tres columnas. Cierran "Pasar página" (anterior y siguiente, entre reglas) y la MRZ a sangre dentro de la hoja.

**La página de país** mantiene su columna de 48rem con el pliego de sellos sobre la roseta y el índice del país.

**/mundo** es pantalla fija dentro de la cáscara: el globo se queda con todos los gestos. Abajo, sobre la barra de vistas, los chips de país envuelven a la izquierda (8px de hueco) y la pila de zoom queda a la derecha. El globo se centra en la banda libre y mide el 90% del ancho en vertical o el 88% del alto libre en horizontal. Con un país elegido, se recentra en el hueco que deja la ficha: encima de ella en el móvil (ficha a todo el ancho, máximo 54dvh) o a su izquierda desde 768px (panel de 380px a 16px del borde derecho, 96px desde arriba).

Ritmo vertical: los saltos entre bloques usan 32–56px; dentro de un bloque, 4–20px. Todo objetivo táctil mide al menos 44px.

### Named Rules
**The Un Eje Rule.** Todo el texto de una hoja se alinea a un único eje izquierdo; solo los sellos se salen de él.

**The Pulgar Rule.** La navegación entre vistas vive abajo, en la barra; arriba solo hay marca, recuentos y, en una hoja, volver.

## Elevation & Depth

Ningún elemento de interfaz lleva sombra. La profundidad se construye por solapamiento físico (el sello se pisa sobre la foto con `mix-blend-mode: multiply`, al 92% y con un filtro SVG de grano que rompe el borde; los sellos del pliego se montan unos sobre otros; la roseta queda detrás con un contexto de apilamiento aislado) y por el propio pasaporte, que es un objeto con grosor:

- **Filo de piel:** las tapas miden un 2% más que las páginas (sobresalen por arriba, por abajo y por el canto, nunca por el lomo), así que con el pasaporte abierto queda un filo burdeos alrededor de las páginas. La guarda y la página de datos van pegadas a la tapa, con el mismo filo.
- **Cantos:** con el libro abierto, a cada lado asoma el grosor de las hojas que quedan: rayas de 1px alternando `papel` y `regla`, de 3 a 7px según cuántas hojas queden por ese lado.
- **Filo y pliegue de la página:** cada página de papel tiene un filo de 1px en `regla` (abierto por el lomo) y, junto al lomo, el papel se curva hacia dentro: `texto` al 11% que se desvanece en el primer 9% del ancho.
- **Hoja que gira:** al levantarse deja de recibir la luz de frente y se oscurece con `tapa-hondo` hasta un 22% de opacidad (proporcional al seno del ángulo); quieta, no lleva nada.
- **Perspectiva:** el escenario tiene 2600px de perspectiva; las hojas giran sobre el lomo y el libro se inclina hacia el puntero.

El visor no flota sobre la hoja: la sustituye por la tapa.

### Shadow Vocabulary
- **Pliegue del lomo** (`linear-gradient(to right, rgb(27 40 48 / 0.11), rgb(27 40 48 / 0) 9%)`, en espejo en las páginas de la izquierda): solo en las páginas del pasaporte.
- **Sombra de hoja** (capa `tapa-hondo`, opacidad `sin(ángulo) × 0.22`, la mueve el motor): solo en la hoja que está girando.

### Named Rules
**The Tinta No Sombra Rule.** Ningún elemento de interfaz lleva `box-shadow` ni `drop-shadow`. Si algo necesita destacar, se solapa o se estampa. Las dos únicas sombras del sistema son las del libro (el pliegue junto al lomo y la hoja que gira), y no salen del pasaporte.

**The Libro Con Grosor Rule.** El pasaporte enseña su grosor con materiales, no con sombras proyectadas: el filo de piel de las tapas, los cantos rayados de las hojas y el filo de 1px de cada página.

**The Globo Grabado Rule.** El globo es un grabado sobre papel, no una esfera en 3D: proyección ortográfica plana, sin sombras, brillo, relieve, degradados ni texturas de satélite. El océano es `papel-hondo` con la trama `ondas.svg` encima al 70%, fija a la pantalla como el propio papel, y la retícula de 10° en `guilloche` (0.5px al 45%). La tierra es `papel` con filetes de 0.5px en `texto-suave` al 55%. Los países con fotos llevan su tinta como un grano con manchas y poros multiplicado sobre el papel (patrón de 384px, alfa 0.14–0.38, al 70%; 85% en hover, doble pasada al elegirlo) y anclado al país, para que viaje con él al girar; su contorno es la tinta plena (1px, 1.6px al elegirlo). Cada lugar es un punto de tinta. El borde es un doble aro de sello: 1.4px en `texto` y un segundo aro de 0.6px al 50% a 5px por fuera.

## Shapes

Formas de documento impreso: esquinas casi rectas en fotos (2px), en el botón, la barra de vistas y los paneles (3px), banderas con 1px. Las páginas del pasaporte solo redondean el canto (3px), nunca el lomo; el recorte activo de la barra, 2px. Las únicas formas redondas son los controles circulares de 44px (visor, paginador, cerrar la ficha), el globo con su doble aro, el punto de la chincheta y los sellos. Los sellos tienen tres siluetas, círculo, octógono y rectángulo de esquinas redondeadas, siempre con un doble trazo (exterior grueso de 4.5, interior fino de 1.4) y girados unos grados según su semilla.

La tapa lleva su propio grabado en lámina: "PASAPORTE" en condensada 700 espaciada, un emblema de globo en aros y meridianos de trazo fino, "WORLDTOUR" en extracondensada 800 y el símbolo de chip biométrico. Los iconos son trazos SVG en línea con puntas redondeadas, sin librería: 1.8 en chevrons, aspas y más/menos; 1.5 en los iconos de la barra de vistas (libreta, globo, líneas).

## Components

### Pasaporte
El componente firma del sistema: un libro de hojas que giran sobre el lomo, en un escenario que se queda con los gestos horizontales (los verticales siguen siendo de la página).
- **Caras:** tapa y contratapa de piel (`tapa` con grano de ruido fractal claro en mosaico de 180px); la tapa con su grabado en lámina, cuyo reflejo se desplaza con la inclinación. Guardas en `papel-hondo` con la trama y la roseta. Página de datos: "Pasaporte", código, microimpresión, retrato en escala de grises multiplicado sobre el papel (3:4, 2px), campos en mono (Países, Lugares, Primer viaje, Último viaje) y la MRZ. Páginas de visado: bandera y nombre del país en su tinta, número perforado, microimpresión y de uno a cuatro sellos en ranuras fijas que como mucho se rozan por el aro. En una sola página, el dorso de cada hoja es papel con la trama.
- **Apertura:** la primera vez en la sesión, el pasaporte cerrado aparece (opacidad 400ms y 14px de subida en 600ms, `ease-out`), espera 600ms, la tapa gira en 1000ms y las primeras cuatro hojas se levantan con su aire y vuelven a caer (26°, 17°, 10° y 5°, una cada 45ms, 560ms cada una). Después los sellos de la primera doble página se estampan uno a uno (280ms, 80ms entre uno y otro). Cualquier gesto interrumpe la apertura. En la misma sesión, o llegando con `?p=`, aparece ya abierto en 200ms.
- **Pasar página:** arrastrar (6px de zona muerta; 1.5 páginas de recorrido para media vuelta a doble página, una a una página), tocar a un lado o el paginador. Al soltar, la hoja termina de pasar si va a más de 0.11 px/ms (medidos en los últimos 100ms) o si ha pasado la mitad; si no, vuelve. La hoja se mueve con un muelle de 0.5s sin rebote.
- **Inclinación:** con ratón, el libro se inclina hacia el puntero (hasta 4° en vertical y 6° en horizontal; al 60% mientras se arrastra) con un muelle de 0.7s y rebote 0.2; con el dedo vuelve a reposo al soltar.
- **Teclado:** flechas, Inicio y Fin pasan páginas al instante, sin animación.
- **Cursor:** mano abierta; cerrada al arrastrar.

### Paginador
Bajo el libro: dos botones circulares de 44px (chevron 1.8 en `texto`, hover sobre `papel`, desactivado en `regla`) y entre ellos el rótulo de lo que se ve en `data` (`DATOS · PÁG. 01 · ESPAÑA`, mínimo 17ch, `aria-live`). Aparece cuando termina la apertura (300ms).

### Barra de vistas
Navegación entre Pasaporte, Mundo y Lista. Un marco de `papel` con borde `regla` de 1px, esquinas de 3px y 4px de relleno; tres casillas iguales con icono de 18px y `label-vista`: en el móvil, 56px de alto con el icono sobre el texto a 12px; desde 640px, 44px en fila a 15px. Inactivas en `texto-suave`, `texto` en hover. La activa es una copia de la barra en `texto` con letra `papel`, recortada a su casilla con `clip-path` (esquinas de 2px): al cambiar de vista el recorte se desliza en 260ms (`ease-out`) y el color cambia a la vez. Presión a 0.97.

### Lista desplegable
Los países, plegados, entre reglas de 1px. Cada país es un botón de al menos 44px (20px de relleno vertical): bandera de 27×18, nombre en `headline-pais` (toma su tinta al pasar por encima y al desplegarse), rango de fechas en `data` desde 768px, recuento en `data` y un chevron que gira 180° en 200ms. Al desplegarse, la altura crece hasta la de sus lugares (filas de grid de 0fr a 1fr en 240ms y opacidad en 200ms, `ease-out`); dentro, las filas de registro y el enlace "Ver en el globo" en `label-vista`, `texto-suave`. Plegado, el contenido es `inert`.

### Fila de registro
- **Style:** miniatura de 56px a 2px de radio sobre `papel-hondo`, nombre en `title` (pasa a `cobalto` en hover, 200ms) y fecha en mono 12px; filas separadas por reglas de 1px al 80%. La misma fila sirve en la lista, en el índice del país y en la ficha del globo.

### Botón primario
Sólido y sobrio, como un sello de tinta oscura sobre el papel.
- **Shape:** esquinas casi rectas (3px), 48px de alto, 20px de padding lateral.
- **Primary:** fondo `texto`, texto `papel`, Archivo extracondensado 800 en mayúsculas a 17px, tracking 0.12em.
- **Hover / Focus:** el fondo pasa a `cobalto`; foco con el anillo global; presión a escala 0.97.

### Enlace de volver
- **Style:** chevron SVG + texto en registro de título pequeño, `texto-suave`, 44px de alto, pasa a `texto` en hover. En la página de lugar dice "Pasaporte" y vuelve a la página del pasaporte donde está su sello.

### Foto (portada y galería)
- **Corner Style:** 2px.
- **Background:** `papel-hondo` como hueco mientras carga.
- **Shadow Strategy:** ninguna.
- **Comportamiento:** es un botón completo que abre el visor; se revela de borrosa (blur 12px, saturación 0.6) a nítida en 520ms al cargar, una sola vez; presión a 0.97.

### Sello
SVG con tres formas (círculo con nombre en arco y código ISO3 al centro, octógono, rectángulo), texto en Archivo extracondensado 800 ajustado al espacio disponible, fecha y código en mono 600, tinta del país, giro y grano deterministas por semilla. Al llegar a una página de lugar se estampa una vez: de escala 1.12 y blur 1.5px a 1, 260ms con `ease-out` tras 220ms de espera. En el pasaporte, cada sello es un enlace que crece a 1.04 en hover.
- **Vuelo:** al tocar un sello del pasaporte, el mismo sello vuela hasta la esquina de la portada de su lugar (transición de vista compartida, 420ms `ease-in-out`, con un blur de 1.5px a mitad de camino) y allí no se vuelve a estampar. Entre vistas de la cáscara, la vista saliente se desvanece en 120ms y la entrante aparece en 200ms tras 60ms.

### Visor
La tapa del pasaporte a pantalla completa (`dialog` modal) sobre `tapa-hondo`. Pasa de foto con scroll-snap nativo, se cierra arrastrando hacia abajo (110px o 0.11 px/ms) mientras la foto se encoge hasta un 8% y el fondo se aclara hasta un 60%, o con Esc o el botón atrás. Contador `01 / 05` en mono `tapa-suave`; cerrar y flechas (solo con puntero fino) son círculos de 44px en `tapa-texto` con hover `white/8%`. Aparece en 220ms y se va en 180ms.

### Globo
Lienzo 2D con proyección ortográfica, dibujado solo cuando algo cambia (ver The Globo Grabado Rule). Gira solo a 4°/s, a 30 fotogramas por segundo; el giro se detiene para siempre al primer toque, rueda o tecla. Se arrastra punto a punto bajo el dedo, con inclinación limitada a ±80°, y al soltar sigue por inercia con rozamiento 0.94 por fotograma de 60 Hz (sin inercia si el dedo se paró más de 80ms). Zoom de 1× a 8× con pellizco, rueda o +/−. Un toque (menos de 6px y 500ms) sobre un país con fotos lo elige; sobre uno sin fotos muestra el aviso; sobre el océano con un país elegido, cierra. Con ratón, el país con fotos bajo el cursor se aviva y el cursor pasa a mano. Al cargar, la tierra aparece por opacidad en 300ms. Teclado: flechas giran, + y − acercan; foco con el anillo global hacia dentro (-4px). Llegando desde la lista con `?pais=`, vuela a ese país.

**Vuelo al país:** gira por el arco más corto y acerca con zoom geométrico, con una curva de entrada y salida cuártica; dura de 450 a 950ms según la distancia y el cambio de zoom. Los botones +/− usan el mismo vuelo (×1.6) sin mover el centro.

### Chip de país
- **Style:** 44px de alto, 12px de padding lateral, esquinas de 3px, borde de 1.5px y texto en la tinta del país sobre `papel`; bandera SVG de 18×12 y nombre en `label-caps`.
- **State:** pulsado (`aria-pressed`), el chip se llena de tinta y el nombre pasa a `papel`; presión a 0.97.

### Zoom del globo
Pila vertical de dos botones de 44px (más y menos, trazo 1.8 en `texto`) dentro de un marco de `papel` con borde `regla` de 1px y esquinas de 3px, separados por una regla de 1px; hover en `papel-hondo`.

### Chincheta
Un punto de tinta de 14px con anillo de 2px en `papel`, centrado en un objetivo táctil de 44px, y a su derecha (a 34px) la etiqueta: borde de 1px y texto en tinta sobre `papel`, esquinas de 2px. Solo aparecen al terminar el vuelo, una tras otra cada 40ms (200ms de opacidad y escala 0.9 a 1). Primer toque: la chincheta se llena de tinta (texto en `papel`) y resalta su fila en la ficha; segundo toque: abre la página del lugar.

### Ficha
Una hoja de `papel` con la trama. En el móvil sube desde abajo (máximo 54dvh, regla superior de 1px, tirador de 40×4px en `regla`), ocupa el sitio de la barra de vistas y se cierra arrastrándola hacia abajo: 90px o 0.11 px/ms, como el visor; hacia arriba se resiste (15% del recorrido). Desde 768px es un panel de 380px a la derecha con borde `regla` y esquinas de 3px, que entra de lado. Cabecera: bandera, nombre del país en su tinta y cerrar; debajo, el recuento en mono y las filas de registro, con la fila activa sobre `papel-hondo`. Entra y sale en 320ms con `ease-drawer`. Esc, atrás o tocar el océano la cierran.

### Aviso
Una tira de `papel` con borde `regla` y esquinas de 3px, en `label-caps` `texto-suave` ("Francia · sin fotos"), centrada bajo la cabecera. Aparece, se mantiene y se desvanece en 1800ms.

### Papel de seguridad
Los recursos del mundo, reutilizados en cada hoja: trama `ondas.svg` en mosaico de 240×96px, roseta de guilloché detrás de los sellos y del pasaporte, línea de microimpresión con el nombre de la página repetido, número de página perforado (rejilla de 5×7 agujeros de radio 1.2 en `perforado`) y la banda MRZ.

## Do's and Don'ts

### Do:
- **Do** asentar toda hoja nueva sobre `papel` con la trama de guilloché, la cabecera de 56px y la microimpresión con el nombre de la página.
- **Do** colgar toda vista nueva de la cáscara: banda superior con marca y recuentos, barra de vistas abajo.
- **Do** reservar el color saturado para la tinta de los sellos, una tinta por país, y el cobalto para foco, selección y hover.
- **Do** dar profundidad por solapamiento y `multiply`, como el sello pisando la esquina de la portada; en el pasaporte, por su grosor: filo de piel, cantos y pliegue.
- **Do** escribir nombres en Archivo extracondensado 800 en mayúsculas y datos en Azeret Mono con cifras tabulares.
- **Do** medir lo impreso en el pasaporte en `cqw` de la página.
- **Do** mover el pasaporte con muelles (hoja 0.5s sin rebote, inclinación 0.7s con rebote 0.2) y pasar la hoja con un gesto rápido de más de 0.11 px/ms.
- **Do** dejar que el teclado pase páginas al instante.
- **Do** abrir el pasaporte solo una vez por sesión; después aparece abierto donde se dejó.
- **Do** mantener el anillo de foco global: 2px `cobalto`, separación de 3px.
- **Do** respetar `prefers-reduced-motion`: el pasaporte aparece abierto sin apertura ni subida, los sellos solo aparecen por opacidad en 200ms, el recorte de la barra salta sin deslizarse, la lista y la barra cambian solo por opacidad en 200ms, el vuelo del sello es un corte directo, las fotos no se revelan y la presión no escala.
- **Do** dibujar cualquier mapa como el globo: papel, trama, filetes finos y tinta multiplicada con grano, con el doble aro de sello.
- **Do** en /mundo, con `prefers-reduced-motion`: sin giro automático, sin inercia ni aparición de la tierra, vuelos y zoom como cortes directos, chinchetas y aviso solo por opacidad y la ficha por opacidad en 200ms.
- **Do** detener todo movimiento automático en cuanto el usuario toca el pasaporte o el globo.

### Don't:
- **Don't** usar sombras de interfaz de ningún tipo; la tinta no proyecta sombra. Las únicas sombras son el pliegue y la hoja que gira, dentro del pasaporte.
- **Don't** usar un papel crema o cálido, ni degradados detrás de títulos o fotos. Los únicos degradados son materiales: la lámina de la tapa y el pliegue del lomo.
- **Don't** usar tintas de sello para texto corrido, fondos o controles genéricos.
- **Don't** usar el burdeos como fondo de una hoja o del `html`; es la piel del pasaporte y el visor.
- **Don't** poner etiquetas pequeñas encima de los titulares; las etiquetas en mono solo nombran campos de datos (País, Fecha, Países, Lugares).
- **Don't** convertir el visor en una pantalla con papel o trama; es la tapa, oscura y vacía salvo la foto.
- **Don't** usar iconos de fuente ni emoji (tampoco banderas emoji); los iconos son SVG en línea y las banderas, SVG.
- **Don't** convertir el globo en una Tierra brillante en 3D, con texturas de satélite, sombras, halo o aspecto de Google Maps.
- **Don't** usar la tinta de un país en controles que no son de ese país.
- **Don't** montar las vistas como una rejilla de tarjetas de fotos con el título sobre un degradado.
