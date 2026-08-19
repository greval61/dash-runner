# 🎮 Dash Runner - Arcade Endless Runner

Un emocionante juego arcade tipo **endless runner** desarrollado con **Phaser 3** y **Vite**. El jugador debe esquivar obstáculos en tres carriles mientras la dificultad aumenta progresivamente.

## 🎯 Características

- ✅ Diseño minimalista con colores neón
- ✅ Mecánicas de juego fluidas (teclado + touch)
- ✅ Sistema de dificultad progresiva
- ✅ Física y colisiones con Arcade
- ✅ Interfaz responsiva para móvil y desktop
- ✅ Puntuación basada en tiempo sobrevivido
- ✅ Efecto de partículas en colisiones

## 🚀 Instalación

### Requisitos
- Node.js 14+ y npm

### Clonar y configurar

```bash
git clone https://github.com/tu-usuario/dash-runner.git
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
├── public/
│   └── index.html              # Archivo HTML principal
├── src/
│   ├── main.js                 # Punto de entrada
│   ├── config.js               # Configuración de Phaser y ajustes
│   └── scenes/
│       ├── BootScene.js        # Escena de carga inicial
│       ├── MenuScene.js        # Menú principal
│       ├── GameScene.js        # Lógica principal del juego
│       └── GameOverScene.js    # Pantalla de fin de juego
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
```

## 🌐 Desplegar en GitHub Pages

### 1. Hacer push a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/dash-runner.git
git push -u origin main
```

### 2. Habilitar GitHub Pages

- Ir a Settings → Pages
- Seleccionar rama `main` y carpeta `/root` (o `/docs` si compilas ahí)
- El juego estará en: `https://tu-usuario.github.io/dash-runner/`

### 3. (Opcional) Cambiar la carpeta de output

En `vite.config.js`:
```javascript
build: {
  outDir: 'docs'
}
```

Luego en GitHub Pages selecciona `/docs` en lugar de `/root`.

## 📱 Exportar a Móvil con Capacitor

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

## 🛠️ Tecnologías Usadas

- **Phaser 3.55+**: Framework de juegos HTML5
- **Vite 4.4+**: Herramienta de build moderno
- **JavaScript ES6+**: Lenguaje principal

## 📊 Mecánicas de Juego

### Jugador
- Ancho: 80px, Alto: 80px
- Puede moverse entre 3 carriles
- Velocidad: 400px/s

### Obstáculos
- Aparecen desde arriba a velocidad inicial de 500px/s
- Ancho: 80px, Alto: 80px
- Color rosa neón

### Dificultad
- Cada 10 segundos aumenta un nivel
- La velocidad de obstáculos aumenta 50px/s por nivel
- La frecuencia de spawn aumenta (reducción de 50ms por nivel)

### Puntuación
- Se calcula como `tiempo_jugado / 100` (redondeado)
- Aumenta continuamente mientras se juega

## 🐛 Problemas Conocidos

- Ninguno en este momento

## 💡 Mejoras Futuras

- [ ] Efectos de sonido
- [ ] Múltiples tipos de obstáculos
- [ ] Power-ups
- [ ] Leaderboard local
- [ ] Animaciones más fluidas
- [ ] Fondos parallax

## 📄 Licencia

MIT - Libre para uso personal y comercial

## 👨‍💻 Autor

Creado con ❤️ usando Phaser 3 y Vite

---

**¿Disfruta jugando? ⭐ Dale una estrella en GitHub!**
