# Acierta la imagen

Videojuego de memoria visual creado con Phaser 3 y Vite. El objetivo es encontrar, entre cuatro opciones, la imagen que coincide con la imagen objetivo antes de que se acaben los 30 segundos.

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior).
- npm, incluido con Node.js.
- Un navegador web moderno.

Puedes comprobar las versiones instaladas con:

```bash
node --version
npm --version
```

## Instalación

Clona o descarga el proyecto y, desde la carpeta que contiene `package.json`, instala las dependencias:

```bash
npm install
```

## Ejecutar en desarrollo

Inicia el servidor local de Vite:

```bash
npm run dev
```

Abre en el navegador la dirección que indique Vite, normalmente <http://localhost:5173/>. Mantén la terminal abierta mientras juegas; para detener el servidor, pulsa `Ctrl+C`.

No abras `index.html` directamente como archivo: el juego necesita servirse mediante Vite para cargar Phaser y sus recursos correctamente.

## Compilar y previsualizar

Genera la versión de producción en `dist/`:

```bash
npm run build
```

Para servir localmente esa compilación y comprobarla:

```bash
npm run preview
```

Abre la dirección que indique Vite (normalmente <http://localhost:4173/>). `preview` sirve la compilación localmente; para publicar el juego, despliega el contenido de `dist/` en un servicio de hosting estático.

## Cómo jugar

1. Pulsa **COMENZAR** en la pantalla inicial.
2. Encuentra cuál de las cuatro opciones coincide con la imagen objetivo.
3. Cada acierto suma 10 puntos; una respuesta incorrecta no suma puntos.
4. Juega hasta que el cronómetro llegue a cero. Usa **VOLVER A JUGAR** para iniciar otra partida.

El récord se guarda en el almacenamiento local del navegador (`localStorage`) y se conserva al recargar la página en el mismo navegador y origen. Para borrarlo, elimina la clave `aciertaImagenRecord` desde las herramientas de almacenamiento del navegador.

## Recursos del juego

Las imágenes se cargan desde `public/assets/` y sus nombres deben coincidir exactamente (incluidas mayúsculas y extensiones):

- `fondo.jpg`: fondo del juego.
- `cara0.png` a `cara6.png`: imágenes objetivo y opciones.

Si reemplazas un recurso, conserva su nombre y formato, o actualiza las rutas de carga en `src/scenes/GameScene.js`.

## Estructura del proyecto

```text
public/assets/          Imágenes y otros recursos estáticos
src/main.js             Configuración e inicio de Phaser
src/scenes/GameScene.js Lógica, interfaz y reglas del juego
index.html              Página HTML que aloja el juego
package.json            Dependencias y comandos npm
```

## Tecnologías

- [Phaser 3](https://phaser.io/): motor del videojuego.
- [Vite](https://vite.dev/): servidor de desarrollo y herramienta de compilación.
- JavaScript, HTML y CSS.
