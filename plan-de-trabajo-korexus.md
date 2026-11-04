# Plan de trabajo: web de Korexus

Fecha: 3 de noviembre de 2026. Estado: pendiente de aprobación.

Este documento dice qué vamos a construir y en qué orden. Todavía no elige tecnologías: eso se decide después de aprobarlo.

## 1. Para qué sirve la web

Korexus es una startup de software de 3 personas. La web debe conseguir que empresas interesadas **los contacten**. Los sistemas ya hechos son la prueba de que saben hacer el trabajo.

Hay dos públicos: empresas del país de Korexus (en español) y empresas del extranjero (en inglés).

**Lo que la web debe lograr**

- Que en pocos segundos se entienda qué hace Korexus y para quién.
- Que los sistemas se vean sin tener que hacer clic.
- Que se pueda contactar desde cualquier parte de la web.
- Que funcione bien en teléfono y en computadora, en ambos idiomas.

**Lo que no incluye esta primera versión**

- Blog, área privada para clientes, precios publicados ni panel para editar textos.

**Lo que haría fracasar la web, aunque funcione**

- Clientes, cifras, testimonios o fotos de equipo inventados.
- Textos, imágenes o diseño copiados de IkyStudio, de la imagen de referencia o de otra web.
- Enlaces rotos o secciones vacías.
- Capturas de sistemas privados con datos reales de personas o clientes.

## 2. Situación de partida

- Pueden mostrar 1 o 2 sistemas, con permiso de sus dueños. Algunos se abren sin contraseña y otros no.
- Nombre: Korexus. Aún no hay logo.
- Colores y detalles visuales: salen de la imagen de referencia que aportaron (sección 5).
- Imágenes: por ahora ninguna. Se definen más adelante.
- Referencia de estructura: [IkyStudio](https://www.ikystudio.com.mx/). Se toma su organización y su idea, no su contenido ni su aspecto exacto.

## 3. Forma elegida: mixta

| Opción                         | A favor                                                     | En contra                                      | Decisión                |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------------- | ----------------------- |
| Mixta                          | Los sistemas se ven sin clic y hay espacio para explicarlos | Algo más de texto que una sola página          | **Elegida por ustedes** |
| Una sola página larga          | Lo más rápido, con menos texto                              | Poco espacio para explicar cada sistema        | Descartada              |
| Varias páginas, como IkyStudio | Lo más parecido a la referencia                             | 5 páginas en 2 idiomas y Portafolio casi vacío | Descartada              |

## 4. Qué tendrá cada página

Todas las páginas existen en español y en inglés.

### Inicio

| Sección            | Qué contiene                                                                                                                                                                          | De dónde sale la idea                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Cabecera           | Barra negra con logo al centro, menú, cambio de idioma y acceso a contacto siempre visible                                                                                            | Imagen de referencia, IkyStudio                                       |
| Presentación       | Titular claro con una palabra destacada, una frase, dos botones (contactar y ver sistemas) y un arco de color que más adelante puede llevar una imagen                                | Imagen de referencia, IkyStudio                                       |
| Sistemas           | 1 o 2 bloques grandes sobre fondo negro: tipo de sistema, frase, dirección web si es público y botón circular con flecha. Dejan lugar para una captura cuando se definan las imágenes | Imagen de referencia, IkyStudio (captura), Octane (dirección visible) |
| Servicios          | Hasta 4 servicios, cada uno en pocas líneas                                                                                                                                           | IkyStudio, We The Folks                                               |
| Qué queremos hacer | Propósito de la empresa y hasta 3 razones para elegirlos, todas comprobables                                                                                                          | IkyStudio                                                             |
| Proceso            | De 4 a 5 pasos en lenguaje simple                                                                                                                                                     | IkyStudio, We The Folks                                               |
| Equipo             | Las 3 personas con nombre, cargo, una línea personal y enlace a su perfil. Iniciales hasta que se definan las fotos                                                                   | Octane; mejora a IkyStudio, que destaca el cargo sobre el nombre      |
| Contacto breve     | Invitación a escribir, con botón, correo y WhatsApp                                                                                                                                   | IkyStudio                                                             |
| Pie                | Datos de contacto, aviso de privacidad y cambio de idioma                                                                                                                             | We The Folks                                                          |

### Página de cada sistema

Una por sistema: qué problema resuelve, qué hizo Korexus, capturas y botón para contactar.

- **Si el sistema es público:** botón "Ver en vivo".
- **Si es privado:** capturas con datos de prueba o un video corto, y una nota de que el acceso es privado. No lleva botón de acceso.

En las tarjetas del Inicio, la tarjeta lleva a esta página y, si el sistema es público, hay además un botón directo al sistema. Así se combinan las dos formas de enlazar.

La web debe verse bien con 1 o con 2 sistemas, y permitir agregar más sin rehacerla.

### Contacto

Formulario con nombre, correo, tipo de proyecto (opcional) y mensaje. Además, correo y WhatsApp.

Debe avisar con claridad si el mensaje se envió o si falló, y protegerse de mensajes automáticos no deseados. Solo prometerá un plazo de respuesta si ustedes pueden cumplirlo.

Los mensajes llegan a un correo de Korexus. La web no los guarda, así que no necesita una base de datos ni un panel para consultarlos.

### Páginas de apoyo

- **Aviso de privacidad:** hace falta porque el formulario recoge datos personales. Yo preparo un borrador según el país de Korexus y los mercados a los que venden. Conviene que lo revise un profesional legal, porque este plan no es asesoría legal.
- **Página no encontrada:** para direcciones equivocadas, con camino de vuelta al Inicio.

## 5. Identidad visual

La imagen que aportaron marca los colores y algunos detalles. Es inspiración: no se copian su diseño, sus textos ni sus imágenes.

### Colores

Medidos en la imagen, salvo los marcados como ajuste. Sirven de punto de partida y se confirman en la etapa 1.

| Color                       | Código                | Para qué se usa                                          |
| --------------------------- | --------------------- | -------------------------------------------------------- |
| Naranja Korexus             | `#EC8C4E`             | Botones y acentos sobre negro                            |
| Durazno                     | `#F3B47E`             | Arco de la presentación y zonas grandes de color         |
| Negro                       | `#141414`             | Barra de menú, secciones oscuras y letra sobre naranja   |
| Carbón                      | `#242424`             | Bloques sobre fondo negro                                |
| Gris de borde               | `#4C4C4C`             | Líneas finas sobre fondo negro                           |
| Blanco                      | `#FCFCFC`             | Fondo claro y letra sobre negro                          |
| Naranja oscuro (ajuste)     | `#D0681C`             | Solo palabras destacadas en títulos grandes sobre blanco |
| Naranja para texto (ajuste) | `#B8500D`             | Texto pequeño y enlaces sobre blanco                     |
| Gris de texto (ajuste)      | `#5A5A5A` y `#B0B0B0` | Texto secundario sobre blanco y sobre negro              |

El azul noche de los botones de flecha (`#202838`) queda reservado para cuando esos botones vayan sobre imágenes. Sobre fondo negro casi no se vería, así que ahí se usa el naranja.

### Para que todo se lea bien

El contraste mide qué tan bien se lee un color sobre otro. Lo mínimo recomendado es 4.5 para texto normal y 3 para títulos grandes.

| Combinación                                                | Contraste | Decisión                                              |
| ---------------------------------------------------------- | --------- | ----------------------------------------------------- |
| Naranja Korexus sobre blanco, o letra blanca sobre naranja | 2.4       | No se usa para texto, aunque aparece así en la imagen |
| Letra negra sobre naranja Korexus                          | 7.4       | Se usa en los botones                                 |
| Naranja Korexus sobre negro                                | 7.4       | Se usa libremente                                     |
| Naranja oscuro sobre blanco                                | 3.6       | Solo en títulos grandes                               |
| Naranja para texto sobre blanco                            | 4.9       | Se usa en texto pequeño                               |

### Detalles que tomamos

- Barra de menú negra en forma de píldora, con el logo al centro y la sección activa en naranja.
- Título grande con una palabra destacada en naranja.
- Arco durazno grande en la presentación. Por ahora es solo una forma de color.
- Dos botones juntos: el principal en naranja con flecha diagonal y el secundario discreto.
- Paso de blanco a negro con las esquinas superiores redondeadas.
- Títulos de sección en dos colores.
- Líneas finas, esquinas redondeadas y botón circular con flecha.
- Datos a los lados del arco, solo con hechos comprobables.
- Logo inicial: círculo naranja con la letra K y el nombre al lado.
- Letra geométrica y redondeada de uso libre. Candidata: Urbanist.

### Detalles que cambiamos o dejamos fuera

| En la imagen                            | Qué haremos                                            | Por qué                                                |
| --------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Cinco estrellas, "14 años" y testimonio | Hechos reales, como "equipo de 3" o "español e inglés" | No se pueden inventar valoraciones ni experiencia      |
| Letra blanca sobre naranja              | Letra negra                                            | La blanca se lee mal                                   |
| Carrusel con puntos                     | Mostrar todo a la vista                                | Un carrusel esconde contenido, y hay pocos elementos   |
| Tres tarjetas iguales con imagen        | Bloques anchos con borde fino                          | Sin imágenes, las tarjetas iguales se verían genéricas |
| Etiqueta "Hello!" y trazos decorativos  | Sin etiqueta                                           | El título funciona solo                                |
| Manchas naranjas y fondo con textura    | Fondo negro liso                                       | Son imágenes; se deciden después                       |
| Efecto de vidrio en los botones         | Botones sólidos                                        | Se leen mejor                                          |
| Texto de relleno                        | Solo textos reales                                     | Lo provisional se marca y no se publica                |

### Imágenes

La web debe verse completa sin imágenes, solo con color y forma. Cada lugar que más adelante pueda llevar una imagen queda previsto. Antes de publicar habrá que decidir las capturas de los sistemas, porque son la prueba del trabajo, y las fotos del equipo.

## 6. Criterios de calidad

Estas condiciones se comprueban antes de publicar:

- **Teléfono y computadora:** sin desbordes ni textos cortados, probado en un navegador real.
- **Rapidez:** las mediciones estándar de velocidad de Google deben dar "bueno" en teléfono.
- **Accesibilidad:** se puede usar con teclado, con buen contraste y descripciones en las imágenes.
- **Idiomas:** una prueba automática avisa si falta un texto en alguno de los dos.
- **Enlaces:** una prueba automática revisa que todos abran.
- **Animaciones:** discretas. Todo el contenido se ve aunque no se ejecuten.
- **Google:** título, descripción y dirección propios por página e idioma.
- **Ortografía:** textos revisados, con acentos, en ambos idiomas.

## 7. Etapas de trabajo

| Etapa                | Qué se hace                                                                                                                                                                                           | Quién                   | Se termina cuando                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| 0. Materiales        | Reunir lo de la sección 8 y comprobar que el nombre y la dirección web estén libres                                                                                                                   | Ustedes y yo            | La lista está completa o se acuerda qué falta                             |
| 1. Identidad visual  | Confirmar los colores y detalles de la sección 5, el tipo de letra y el logo inicial, preparar el ícono de la pestaña y la imagen para compartir en redes, y mostrar una muestra de pantalla completa | Yo; ustedes aprueban    | Aprueban la muestra                                                       |
| 2. Tecnologías       | Investigar opciones, compararlas por costo y mantenimiento, y dejar la decisión por escrito. Después, plan técnico detallado                                                                          | Yo; ustedes eligen      | Aprueban la opción                                                        |
| 3. Base              | Crear el proyecto con ambos idiomas, cabecera, pie y una versión de prueba privada                                                                                                                    | Yo                      | Se navega en ambos idiomas, con pruebas en verde                          |
| 4. Inicio            | Construir las secciones con textos provisionales marcados como tales                                                                                                                                  | Yo                      | Inicio completo en teléfono y computadora                                 |
| 5. Sistemas          | Construir la página de cada sistema, pública o privada                                                                                                                                                | Yo                      | Ambos casos funcionan                                                     |
| 6. Contacto          | Formulario, envío, protección, WhatsApp y aviso de privacidad                                                                                                                                         | Yo                      | Llega un mensaje de prueba a su correo                                    |
| 7. Textos e imágenes | Ustedes dan los datos; yo redacto en español e inglés, sin inventar nada. Definimos juntos las imágenes y las coloco                                                                                  | Ustedes y yo            | Ustedes aprueban cada texto, y alguien con buen inglés revisa esa versión |
| 8. Pulido            | Animaciones discretas, velocidad, accesibilidad y Google                                                                                                                                              | Yo                      | Se cumple la sección 6                                                    |
| 9. Revisión final    | Revisión independiente del código y de seguridad                                                                                                                                                      | Yo                      | Sin problemas graves abiertos                                             |
| 10. Publicación      | Dirección web, publicación y comprobación final                                                                                                                                                       | Yo, con su autorización | La web está visible y el contacto funciona                                |

Publicar y usar servicios externos siempre requiere su autorización previa. Las etapas 0, 1 y 7 dependen de sus materiales y respuestas, así que ese ritmo marca la fecha final.

## 8. Qué necesito de ustedes

1. La lista de sistemas: nombre, una frase, qué hizo Korexus en él, si es público y su dirección.
2. El permiso de cada dueño para mostrarlo, idealmente por escrito.
3. Más adelante, cuando se definan las imágenes: capturas o acceso de prueba, sin datos reales de personas, y fotos del equipo.
4. La imagen de referencia para los colores. Ya la tengo.
5. Nombre, cargo, línea personal y enlace a un perfil de los 3.
6. Qué servicios ofrecen, cuál es su propósito y su historia corta.
7. El país, el correo y el WhatsApp de contacto.
8. Quién recibirá y contestará los mensajes, incluidos los que lleguen en inglés.
9. La compra de la dirección web a nombre de Korexus, con mi guía, para que la cuenta sea de ustedes. Si ya tienen una dirección o un correo, díganmelo.

## 9. Cómo voy a programarla

- **Pruebas primero:** antes de cada función se escribe la prueba automática que demuestra que sirve, como una lista de control que debe cumplirse.
- **Trabajo separado:** cada parte se construye en su propia copia de trabajo y solo se une a la versión principal con las pruebas superadas.
- **Revisión:** una revisión independiente por etapa. La revisión de seguridad se hace una vez, en la etapa 9.
- **Navegador real:** además de las pruebas, reviso la web como la vería un visitante.
- **Sin publicar nada** sin su autorización.

## 10. Riesgos y cómo se manejan

| Riesgo                                      | Qué pasaría                       | Qué haremos                                                                                                                                                                              |
| ------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Solo hay 1 o 2 sistemas                     | La sección puede verse pobre      | Tarjetas grandes y páginas bien explicadas; la web admite agregar más sin rehacerla                                                                                                      |
| Sin imágenes, la web puede verse incompleta | Menos fuerza para convencer       | Diseñarla para que funcione solo con color y forma, y decidir las capturas antes de publicar                                                                                             |
| Un sistema público deja de funcionar        | Mala impresión                    | Prueba de enlaces antes de publicar y capturas como respaldo                                                                                                                             |
| Capturas con datos reales                   | Problema legal y de confianza     | Usar solo datos de prueba y revisar cada captura                                                                                                                                         |
| Dos idiomas                                 | Se duplican textos y correcciones | Prueba automática y aprobación de ambos textos                                                                                                                                           |
| El nombre ya está en uso                    | Cambiarlo después sería costoso   | Comprobarlo en la etapa 0. Una búsqueda rápida no encontró una empresa de software llamada Korexus, pero sí nombres parecidos como KORE Software; eso no sustituye una revisión de marca |

## 11. Decisiones que tomé yo

Pueden cambiarlas al revisar este plan:

1. **Lugar de los sistemas:** justo después de la presentación, porque son la prueba y ustedes los quieren visibles. Lo habían dejado para después y se puede mover con facilidad.
2. **Ambos idiomas desde el primer día,** con español como idioma inicial. Lanzar primero en español adelantaría la publicación.
3. **Nosotros y Servicios como secciones del Inicio,** no como páginas aparte, para que se escriban menos textos.
4. **Sin precios publicados:** el botón invita a pedir una cotización, como en IkyStudio.
5. **Sin agenda de llamadas** en esta versión. Se puede agregar para clientes del extranjero.
6. **Equipo con iniciales mientras no haya fotos.** Cuando se definan las imágenes, recomiendo fotos reales.
7. **Panel para editar textos fuera de esta versión:** los cambios los haría yo. Se puede revisar al elegir tecnologías.
8. **Mensajes de contacto solo por correo:** no se guardan en la web, lo que la hace más simple y reduce los datos que hay que proteger.
9. **Yo redacto los textos con los datos que ustedes den,** y ustedes los aprueban. Lo que no se pueda comprobar no se publica.
10. **Idioma:** la web abre en español y cada visitante cambia de idioma con un botón visible. Cada idioma tiene sus propias direcciones, sin cambios automáticos.
11. **Sin medición de visitas en esta versión:** evita cookies no esenciales y simplifica el aviso de privacidad. Por ahora, el resultado se mide por los mensajes recibidos. Se puede agregar después.
12. **Logo de texto como logo inicial,** que se puede reemplazar más adelante.
13. **Colores ajustados para que se lean:** botones con letra negra y un naranja más oscuro para el texto sobre blanco.
14. **Hechos reales en vez de estrellas y años de experiencia,** y los demás cambios a la imagen de la sección 5.

## 12. Lo que falta decidir más adelante

- Qué tecnologías usar (etapa 2).
- Cuánto pueden gastar al mes en servicios externos (etapa 2, con costos concretos a la vista).
- Qué dirección web comprar (etapa 0, según las que estén libres).
- Qué imágenes usar: capturas, fotos del equipo y formas decorativas (etapa 7).
