---
name: Imanes
description: Cada imán de la nevera es un sello de entrada; su página es la hoja de visado donde se estampó.
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
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 12vw, 3.75rem)"
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
  hueco-galeria: "8px"
  objetivo-tactil: "44px"
  cabecera: "56px"
  hoja: "576px"
  ficha-panel: "380px"
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

# Design System: Imanes

## Overview

**Creative North Star: "La hoja de visado"**

Cada imán es un sello de entrada y cada página es la hoja del pasaporte donde se estampó; las fotos son lo que volvió del viaje. El sistema es papel de seguridad, no interfaz: un fondo verde menta grisáceo y frío con una trama de guilloché en mosaico, reglas finas, una línea de microimpresión bajo la cabecera, un número de página perforado con láser y, al pie de la página de lugar, la zona de lectura mecánica (MRZ). Sobre ese papel la única tinta saturada es la de los sellos de goma, con bordes irregulares y una tinta por país.

La densidad es baja y vertical: una sola columna de 576px como máximo, un eje izquierdo que gobierna cada línea de texto, y las fotos ocupando casi todo el ancho entre medianiles de 16px. La profundidad nace solo del solapamiento (el sello se pisa sobre la esquina de la portada, los sellos del pliego se montan unos sobre otros, la roseta queda detrás), nunca de sombras. El visor a pantalla completa es la tapa del pasaporte: burdeos casi negro, sin papel ni trama.

El sistema rechaza, de forma confirmada en el contrato de dirección, la app de fotos oscura a sangre con un título sans sobre un degradado y el álbum de recortes con polaroids y cinta adhesiva.

**Key Characteristics:**
- Papel de seguridad frío (nunca crema) con trama de guilloché en todas las hojas.
- Cuatro tintas de sello como único color saturado; una tinta por país.
- Archivo extracondensado en mayúsculas para nombres; Azeret Mono para datos, etiquetas y MRZ.
- Profundidad solo por solapamiento y multiplicación de tinta; cero sombras.
- El visor es la tapa del pasaporte (`tapa-hondo`), el único lugar oscuro del sistema.
- Movimiento escaso y físico: el sello se estampa una vez, cada foto se revela una vez.
- El globo de /mundo es el mismo papel grabado: océano en `papel-hondo` con la trama, tierra en `papel` con filetes finos y los países visitados entintados como su sello.

## Colors

Una base neutra de papel de seguridad verde grisáceo y tinta azul pizarra, cuatro tintas de sello saturadas y una tapa burdeos para el visor.

### Primary
- **Tinta Carmín** (`carmin`): tinta de sello. Las tintas se reparten por país (`carmin`, `violeta`, `cobalto`, `verde`; asignada en `content/<pais>/pais.json` o derivada del slug), y nunca colorean texto corrido, fondos ni bordes de interfaz.
- **Tinta Violeta** (`violeta`): tinta de sello; también la del sello "Sin registrar" de la página 404.
- **Tinta Cobalto** (`cobalto`): tinta de sello y, además, el único color de interacción de la interfaz: anillo de foco, selección de texto, hover del botón primario y de los enlaces de país del índice.
- **Tinta Verde** (`verde`): tinta de sello.

### Secondary
- **Guilloché Verde Azulado** (`guilloche`): el color de la línea de microimpresión. La trama de fondo (`ondas.svg`) y la roseta (`roseta.svg`) se dibujan con un verde azulado y un lila más claros, fijados en `scripts/papel.mjs` y nunca usados fuera de esos recursos.

### Neutral
- **Papel de Visado** (`papel`): fondo de toda hoja, siempre bajo la trama de guilloché. También es el `theme-color` del navegador.
- **Papel Hondo** (`papel-hondo`): el hueco de una foto mientras carga, las miniaturas del índice y la banda de la MRZ (al 80%).
- **Regla** (`regla`): reglas de 1px (bajo el nombre, entre filas del índice, en la microimpresión) y el color de la barra de desplazamiento.
- **Perforado** (`perforado`): los agujeros del número de página y el borde discontinuo del estado sin fotos.
- **Tinta de Texto** (`texto`): todo el texto principal; fondo del botón primario.
- **Texto Suave** (`texto-suave`): etiquetas de campo, datos en mono, enlace de volver y textos de estado.
- **Tapa** (`tapa`): fondo del `html`; en pantallas anchas enmarca la hoja central como la tapa alrededor de la página.
- **Tapa Honda** (`tapa-hondo`): fondo del visor.
- **Texto de Tapa** (`tapa-texto`) y **Tapa Suave** (`tapa-suave`): iconos y contador del visor.

### Named Rules
**The Una Tinta Rule.** El color saturado es tinta de sello y nada más. Cada país lleva una sola tinta; la interfaz solo toma prestado el cobalto para foco, selección y hover.

**The Nunca Crema Rule.** El papel es verde menta grisáceo y frío. Un papel cálido o crema rompe el mundo.

**The Tinta del País Rule.** En /mundo, la tinta de un país puede marcar lo que pertenece a ese país y a nada más: su relleno en el globo, su chip, sus chinchetas y su nombre en la ficha. Nunca colorea controles genéricos (zoom, cerrar, cabecera), que siguen en `texto` / `texto-suave` sobre `papel`. En el frontmatter, `chip-pais` y `etiqueta-chincheta` muestran `carmin` como ejemplo; cada país usa la suya.

## Typography

**Display Font:** Archivo variable con eje `wdth` (con ui-sans-serif, system-ui)
**Body Font:** Archivo
**Label/Mono Font:** Azeret Mono (con ui-monospace)

**Character:** Un grotesco condensado en mayúsculas pesadas, como los nombres y sellos impresos en un visado, frente a un mono técnico de documento oficial para datos, contadores y la MRZ. Las cifras son tabulares en todo el sitio (`tnum`).

### Hierarchy
- **Display** (800, `wdth` 62.5, clamp(3rem, 15.5vw, 5.25rem), interlineado 0.86, mayúsculas, `text-balance`): el nombre del lugar y del país, una vez por página.
- **Headline** (800, `wdth` 62.5, clamp(2.5rem, 12vw, 3.75rem), 0.9, mayúsculas): el titular de la 404.
- **Title** (800, `wdth` 62.5, 30px, 1, mayúsculas): nombres de lugar en las filas del índice.
- **Title pequeño** (800, `wdth` 62.5, 17px, tracking 0.2em, mayúsculas): la marca "Imanes", el enlace de volver y el botón primario (este último a 0.12em). Los nombres de país del índice usan la variante condensada (`wdth` 75, 700, 15px, 0.12em).
- **Body** (400–600, 17px, 1.625, máximo 34ch): textos de estado y valores de campo (País, Fecha) en 600.
- **Label** (Azeret Mono 600, 11px, tracking 0.12em, mayúsculas): las etiquetas de campo del bloque de datos, como en un visado.
- **Data** (Azeret Mono 500, 12–13px, tracking 0.06em): fechas en el índice, recuentos, contador del visor `01 / 05`.
- **MRZ** (Azeret Mono 500, min(3.15vw, 15px), 1.5, al 80% de opacidad): las dos líneas de lectura mecánica.
- **Microimpresión** (Azeret Mono 600, 5px, interlineado 7px, `guilloche`): textura, decorativa y `aria-hidden`.
- **Label en versalitas condensadas** (`label-caps`: Archivo 700, `wdth` 75, 15px, tracking 0.1em, mayúsculas): el paso de 15px para nombrar países y avisos cortos. Lo usan los chips de país del globo, los encabezados de país del índice (a 0.12em) y el aviso "sin fotos" (en `texto-suave`). La etiqueta de una chincheta usa la variante extracondensada (800, `wdth` 62.5, 15px, tracking 0.08em, interlineado 1), porque es un nombre de lugar.
- **Nombre de país en la ficha** (800, `wdth` 62.5, 40px, interlineado 1.05, mayúsculas, en la tinta del país): el título de la ficha del globo, truncado a una línea.

### Named Rules
**The Nombre Condensado Rule.** Los nombres propios (lugar, país, marca) van en Archivo extracondensado 800 en mayúsculas. Ningún otro texto usa ese registro a tamaño display.

**The Dato en Mono Rule.** Todo lo que un funcionario sellaría o leería por máquina (fechas, códigos ISO3, recuentos, número de foto, MRZ) va en Azeret Mono.

## Layout

Una única columna centrada, `max-width` 576px (`hoja`), con medianiles de 16px (`medianil`) y respeto a las zonas seguras (`env(safe-area-inset-*)`) arriba y abajo. En pantallas más anchas la hoja no crece: la tapa (`tapa`) aparece a los lados.

Cada hoja abre con una cabecera de 56px (volver a la izquierda, número perforado a la derecha) y, debajo, la línea de microimpresión entre dos reglas. En la página de lugar, la portada ocupa el ancho completo en proporción 4:5; el sello (44% del ancho, máximo 210px) se monta sobre su esquina inferior derecha y sobresale 32px; debajo, el nombre en display, una regla y una rejilla de dos campos (País, Fecha). El resto de fotos se reparte en dos columnas de mampostería con 8px de hueco. La MRZ cierra la página a sangre dentro de la hoja.

La página de inicio y la de país muestran el pliego de sellos (dos columnas en móvil, tres desde 640px, solapados con desplazamientos derivados de la semilla de cada lugar) sobre una roseta, y después el índice agrupado por país.

Ritmo vertical: los saltos entre bloques usan 32–56px (`mt-8` a `mt-14`); dentro de un bloque, 4–20px. Todo objetivo táctil mide al menos 44px.

En la cabecera de inicio, a la derecha, el enlace "Mundo" (icono de globo en trazo + título pequeño, hover en `cobalto`) sigue al recuento en mono; por debajo de 420px el recuento se oculta y el enlace se queda solo.

**/mundo** es la única pantalla fija: ocupa todo el viewport sin desplazamiento (`overflow: hidden` en el `html`), y el globo se queda con todos los gestos. Arriba, una banda de `papel` al 90% con la cabecera y la microimpresión (en la columna de 576px en móvil; desde 768px, alineada al eje izquierdo de 16px de los controles). Abajo, con la zona segura, los chips de país envuelven a la izquierda (8px de hueco) y la pila de zoom queda a la derecha. El globo se centra en la banda libre entre ambas y mide el 90% del ancho en vertical o el 88% del alto libre en horizontal. Con un país elegido, el globo se recentra en el hueco que deja la ficha: encima de ella en el móvil (ficha a todo el ancho, máximo 54dvh) o a su izquierda desde 768px (panel de 380px a 16px del borde derecho, 96px desde arriba).

### Named Rules
**The Un Eje Rule.** Todo el texto de una hoja se alinea a un único eje izquierdo; solo los sellos se salen de él.

## Elevation & Depth

El sistema es plano y sin sombras. La profundidad se construye por solapamiento físico: el sello se pisa sobre la foto con `mix-blend-mode: multiply` (la tinta se mezcla con lo que hay debajo, al 92% de opacidad y con un filtro SVG de grano y manchas que rompe el borde), los sellos del pliego se montan unos sobre otros, y la roseta de guilloché se coloca detrás del contenido con un contexto de apilamiento aislado. El visor no flota sobre la hoja: la sustituye por la tapa.

### Named Rules
**The Tinta No Sombra Rule.** Ningún elemento lleva `box-shadow` ni `drop-shadow`. Si algo necesita destacar, se solapa o se estampa.

**The Globo Grabado Rule.** El globo es un grabado sobre papel, no una esfera en 3D: proyección ortográfica plana, sin sombras, brillo, relieve, degradados ni texturas de satélite. El océano es `papel-hondo` con la trama `ondas.svg` encima al 70%, fija a la pantalla como el propio papel, y la retícula de 10° en `guilloche` (0.5px al 45%). La tierra es `papel` con filetes de 0.5px en `texto-suave` al 55%. Los países con fotos llevan su tinta como un grano con manchas y poros multiplicado sobre el papel (patrón de 384px, alfa 0.14–0.38, al 70%; 85% en hover, doble pasada al elegirlo) y anclado al país, para que viaje con él al girar; su contorno es la tinta plena (1px, 1.6px al elegirlo). Cada lugar es un punto de tinta. El borde es un doble aro de sello: 1.4px en `texto` y un segundo aro de 0.6px al 50% a 5px por fuera.

## Shapes

Formas de documento impreso: esquinas casi rectas en fotos (2px) y en el botón (3px), banderas con 1px. Las únicas formas redondas son los controles del visor (círculos de 44px) y los sellos. Los sellos tienen tres siluetas, círculo, octógono y rectángulo de esquinas redondeadas, siempre con un doble trazo (exterior grueso de 4.5, interior fino de 1.4) y girados unos grados según su semilla. Los iconos son trazos SVG en línea de 1.8 con puntas redondeadas (chevron y aspa), sin librería.

En /mundo se suman como formas redondas el propio globo con su doble aro, el punto de la chincheta (14px, anillo de 2px en `papel`) y el botón de cerrar de la ficha (círculo de 44px); los chips, la pila de zoom, la ficha en escritorio y el aviso mantienen las esquinas de 3px, y la etiqueta de la chincheta, las de 2px. Los iconos nuevos (más, menos, globo) siguen siendo trazos en línea.

## Components

### Botón primario
Sólido y sobrio, como un sello de tinta oscura sobre el papel.
- **Shape:** esquinas casi rectas (3px), 48px de alto, 20px de padding lateral.
- **Primary:** fondo `texto`, texto `papel`, Archivo extracondensado 800 en mayúsculas a 17px, tracking 0.12em.
- **Hover / Focus:** el fondo pasa a `cobalto`; foco con el anillo global; presión a escala 0.97.

### Enlace de volver
- **Style:** chevron SVG + texto en registro de título pequeño, `texto-suave`, 44px de alto, pasa a `texto` en hover.

### Foto (portada y galería)
- **Corner Style:** 2px.
- **Background:** `papel-hondo` como hueco mientras carga.
- **Shadow Strategy:** ninguna.
- **Comportamiento:** es un botón completo que abre el visor; se revela de borrosa (blur 12px, saturación 0.6) a nítida en 520ms al cargar, una sola vez; presión a 0.97.

### Sello
El componente firma del sistema. SVG con tres formas (círculo con nombre en arco y código ISO3 al centro, octógono, rectángulo), texto en Archivo extracondensado 800 ajustado al espacio disponible, fecha y código en mono 600, tinta del país, giro y grano deterministas por semilla. Al llegar a una página de lugar se estampa una vez: de escala 1.12 y blur 1.5px a 1, 260ms con `ease-out` tras 220ms de espera. En el pliego, el sello es un enlace que crece a 1.03 en hover.

### Índice
- **Style:** grupos por país con bandera SVG, nombre condensado, una regla que llena la fila y el recuento en mono. Cada fila: miniatura de 56px a 2px de radio, nombre en título 30px, fecha en mono; filas separadas por reglas de 1px.

### Visor
La tapa del pasaporte a pantalla completa (`dialog` modal) sobre `tapa-hondo`. Pasa de foto con scroll-snap nativo, se cierra arrastrando hacia abajo (110px o 0.11 px/ms) mientras la foto se encoge hasta un 8% y el fondo se aclara hasta un 60%, o con Esc o el botón atrás. Contador `01 / 05` en mono `tapa-suave`; cerrar y flechas (solo con puntero fino) son círculos de 44px en `tapa-texto` con hover `white/8%`. Aparece en 220ms y se va en 180ms.

### Globo
Lienzo 2D con proyección ortográfica, dibujado solo cuando algo cambia (ver The Globo Grabado Rule). Gira solo a 4°/s, a 30 fotogramas por segundo para ahorrar batería; el giro se detiene para siempre al primer toque, rueda o tecla. Se arrastra punto a punto bajo el dedo, con inclinación limitada a ±80°, y al soltar sigue por inercia con rozamiento 0.94 por fotograma de 60 Hz (sin inercia si el dedo se paró más de 80ms). Zoom de 1× a 8× con pellizco, rueda o +/−. Un toque (menos de 6px y 500ms) sobre un país con fotos lo elige; sobre uno sin fotos muestra el aviso; sobre el océano con un país elegido, cierra. Con ratón, el país con fotos bajo el cursor se aviva y el cursor pasa a mano. Al cargar, la tierra aparece por opacidad en 300ms. Teclado: flechas giran, + y − acercan; foco con el anillo global hacia dentro (-4px).

**Vuelo al país:** gira por el arco más corto y acerca con zoom geométrico, con una curva de entrada y salida cuártica; dura de 450 a 950ms según la distancia y el cambio de zoom. Los botones +/− usan el mismo vuelo (×1.6) sin mover el centro.

### Chip de país
La etiqueta de un país en su tinta, como el nombre en el borde de un sello.
- **Style:** 44px de alto, 12px de padding lateral, esquinas de 3px, borde de 1.5px y texto en la tinta del país sobre `papel`; bandera SVG de 18×12 y nombre en `label-caps`.
- **State:** pulsado (`aria-pressed`), el chip se llena de tinta y el nombre pasa a `papel`; presión a 0.97.

### Zoom del globo
Pila vertical de dos botones de 44px (más y menos, trazo 1.8 en `texto`) dentro de un marco de `papel` con borde `regla` de 1px y esquinas de 3px, separados por una regla de 1px; hover en `papel-hondo`.

### Chincheta
Un punto de tinta de 14px con anillo de 2px en `papel`, centrado en un objetivo táctil de 44px, y a su derecha (a 34px) la etiqueta: borde de 1px y texto en tinta sobre `papel`, esquinas de 2px. Solo aparecen al terminar el vuelo, una tras otra cada 40ms (200ms de opacidad y escala 0.9 a 1). Primer toque: la chincheta se llena de tinta (texto en `papel`) y resalta su fila en la ficha; segundo toque: abre la página del lugar.

### Ficha
Una hoja de `papel` con la trama. En el móvil sube desde abajo (máximo 54dvh, regla superior de 1px, tirador de 40×4px en `regla`) y se cierra arrastrándola hacia abajo: 90px o 0.11 px/ms, como el visor; hacia arriba se resiste (15% del recorrido). Desde 768px es un panel de 380px a la derecha con borde `regla` y esquinas de 3px, que entra de lado. Cabecera: bandera, nombre del país en su tinta y cerrar; debajo, el recuento en mono y las filas del índice (la misma fila que el índice), con la fila activa sobre `papel-hondo`. Entra y sale en 320ms con `ease-drawer`. Esc, atrás o tocar el océano la cierran.

### Aviso
Una tira de `papel` con borde `regla` y esquinas de 3px, en `label-caps` `texto-suave` ("Francia · sin fotos"), centrada bajo la cabecera. Aparece, se mantiene y se desvanece en 1800ms.

### Papel de seguridad
Los recursos del mundo, reutilizados en cada hoja: trama `ondas.svg` en mosaico de 240×96px, roseta de guilloché detrás de los sellos, línea de microimpresión con el nombre de la página repetido, número de página perforado (rejilla de 5×7 agujeros de radio 1.2 en `perforado`) y la banda MRZ.

## Do's and Don'ts

### Do:
- **Do** asentar toda hoja nueva sobre `papel` con la trama de guilloché, la cabecera de 56px y la microimpresión con el nombre de la página.
- **Do** reservar el color saturado para la tinta de los sellos, una tinta por país, y el cobalto para foco, selección y hover.
- **Do** dar profundidad por solapamiento y `multiply`, como el sello pisando la esquina de la portada.
- **Do** escribir nombres en Archivo extracondensado 800 en mayúsculas y datos en Azeret Mono con cifras tabulares.
- **Do** mantener el anillo de foco global: 2px `cobalto`, separación de 3px.
- **Do** respetar `prefers-reduced-motion`: el sello solo aparece por opacidad en 200ms, las fotos no se revelan y la presión no escala.
- **Do** dibujar cualquier mapa como el globo: papel, trama, filetes finos y tinta multiplicada con grano, con el doble aro de sello.
- **Do** en /mundo, con `prefers-reduced-motion`: sin giro automático, sin inercia ni aparición de la tierra, vuelos y zoom como cortes directos, chinchetas y aviso solo por opacidad y la ficha por opacidad en 200ms.
- **Do** detener todo movimiento automático en cuanto el usuario toca el globo.

### Don't:
- **Don't** usar sombras de ningún tipo; la tinta no proyecta sombra.
- **Don't** usar un papel crema o cálido, ni degradados detrás de los títulos.
- **Don't** usar tintas de sello para texto corrido, fondos o bordes de interfaz.
- **Don't** poner etiquetas pequeñas encima de los titulares; las etiquetas en mono solo nombran campos de datos (País, Fecha).
- **Don't** convertir el visor en una pantalla con papel o trama; es la tapa, oscura y vacía salvo la foto.
- **Don't** usar iconos de fuente ni emoji (tampoco banderas emoji); los iconos son SVG en línea y las banderas, SVG.
- **Don't** convertir el globo en una Tierra brillante en 3D, con texturas de satélite, sombras, halo o aspecto de Google Maps.
- **Don't** usar la tinta de un país en controles que no son de ese país.
