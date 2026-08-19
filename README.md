# 🎮 Dash Runner - Arcade Endless Runner

Un emocionante juego arcade tipo **endless runner** desarrollado con **Phaser 3** y **Vite**. El jugador debe esquivar obstáculos en tres carriles mientras la dificultad aumenta progresivamente.

**🌐 JUEGA AHORA:** https://greval61.github.io/dash-runner/

## 🎯 Características

- ✅ Diseño minimalista con colores neón
- ✅ Mecánicas de juego fluidas (teclado + touch)
- ✅ Sistema de dificultad progresiva
- ✅ Física y colisiones con Arcade
- ✅ Interfaz responsiva para móvil y desktop
- ✅ Puntuación basada en tiempo sobrevivido
- ✅ Efecto de partículas en colisiones
- ✅ Totalmente funcional en web y dispositivos móviles

## 🚀 Instalación

### Requisitos
- Node.js 14+ y npm

### Clonar y configurar

```bash
git clone https://github.com/greval61/dash-runner.git
cd dash-runner
npm install
```

## 🎮 Ejecutar el juego

### Modo desarrollo (Hot reload)
```bash
npm run dev
```
El juego se abrirá automáticamente en `http://localhost:3000`

### Build para producción
```bash
npm run build
```
Los archivos compilados estarán en la carpeta `dist/`

### Preview del build
```bash
npm run preview
```

## 🕹️ Controles

- **Flecha Izquierda / Tap Izquierda**: Moverse al carril izquierdo
- **Flecha Derecha / Tap Derecha**: Moverse al carril derecho
- **Enter**: Comenzar juego (desde menú)
- **Tap**: Cualquier acción del menú

## 📁 Estructura del Proyecto

```
dash-runner/
├── assets/                      → Build assets
├── public/
│   └── index.html              → HTML principal
├── src/
│   ├── main.js                 → Punto de entrada
│   ├── config.js               → Configuración de Phaser y ajustes
│   └── scenes/
│       ├── BootScene.js        → Escena de carga
│       ├── MenuScene.js        → Menú principal
│       ├── GameScene.js        → Lógica principal del juego
│       └── GameOverScene.js    → Pantalla de fin
├── index.html                  → HTML compilado
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 🎨 Personalización

Edita `src/config.js` para cambiar:

```javascript
gameSettings.colors = {
  bg: '#050510',          // Fondo
  player: '#00f0ff',      // Jugador
  obstacle: '#ff0055',    // Obstáculos
  text: '#ffffff'         // Texto
}

gameSettings.player = {
  width: 80,              // Ancho del jugador
  height: 80,             // Alto del jugador
  speed: 400,             // Velocidad de movimiento
  lanes: 3,               // Número de carriles
  laneWidth: 360          // Ancho de cada carril
}

gameSettings.obstacles = {
  width: 80,              // Ancho de obstáculos
  height: 80,             // Alto de obstáculos
  baseSpeed: 500,         // Velocidad base
  spawnRate: 1200         // Tasa de spawn inicial (ms)
}
```

## 🌐 Desplegar en GitHub Pages

El proyecto ya está desplegado en:
**https://greval61.github.io/dash-runner/**

Para desplegar tu propia versión:

### 1. Hacer push a GitHub

```bash
git push origin main
```

### 2. Habilitar GitHub Pages

- Ir a Settings → Pages
- Seleccionar rama `main` y carpeta `/` (raíz)
- El juego estará disponible automáticamente

## 📱 Usar en Dispositivos Móviles

El juego es **totalmente responsivo** y funciona en cualquier dispositivo móvil:
- iPhone, iPad
- Android phones y tablets
- Tablets con cualquier sistema operativo

Solo abre el URL en el navegador móvil:
```
https://greval61.github.io/dash-runner/
```

## 📱 Exportar a Móvil Nativo con Capacitor (Opcional)

### Instalación de Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### Compilar para la web

```bash
npm run build
```

### Añadir plataformas

```bash
npx cap add ios
npx cap add android
```

### Sincronizar cambios

```bash
npx cap sync
```

### Abrir en Xcode (iOS) o Android Studio

```bash
npx cap open ios
npx cap open android
```

Luego compila en Xcode o Android Studio para generar las apps nativas.

## 🛠️ Tecnologías Usadas

- **Phaser 3.55+**: Framework de juegos HTML5
- **Vite 4.4+**: Herramienta de build moderno y rápido
- **JavaScript ES6+**: Lenguaje principal
- **Canvas API**: Renderizado gráfico

## 📊 Mecánicas de Juego

### Jugador
- Ancho: 80px, Alto: 80px
- Puede moverse entre 3 carriles
- Velocidad: 400px/s
- Color: Azul neón (#00f0ff)

### Obstáculos
- Aparecen desde arriba a velocidad inicial de 500px/s
- Ancho: 80px, Alto: 80px
- Color: Rosa neón (#ff0055)
- Generados aleatoriamente en diferentes carriles

### Dificultad
- Cada 10 segundos aumenta un nivel
- La velocidad de obstáculos aumenta 50px/s por nivel
- La frecuencia de spawn aumenta (reducción de 50ms por nivel)
- El máximo spawn es de 500ms

### Puntuación
- Se calcula como `tiempo_jugado / 100` (redondeado)
- Aumenta continuamente mientras se juega

## 🐛 Problemas Conocidos

- Ninguno en este momento

## 💡 Mejoras Futuras

- [ ] Efectos de sonido
- [ ] Múltiples tipos de obstáculos
- [ ] Power-ups especiales
- [ ] Leaderboard local (localStorage)
- [ ] Animaciones más fluidas
- [ ] Fondos parallax
- [ ] Temas visuales alternativos
- [ ] Modo multijugador

## 📄 Licencia

MIT - Libre para uso personal y comercial

## 👨‍💻 Autor

Creado con ❤️ usando Phaser 3 y Vite

**Repositorio GitHub:** https://github.com/greval61/dash-runner

---

**¿Disfruta jugando? ⭐ Dale una estrella en GitHub!**

