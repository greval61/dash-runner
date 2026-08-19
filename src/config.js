export const gameConfig = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1920,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
    expandParent: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: []
};

export const gameSettings = {
  colors: {
    bg: '#050510',
    player: '#00f0ff',
    obstacle: '#ff0055',
    text: '#ffffff'
  },
  player: {
    width: 80,
    height: 80,
    speed: 400,
    lanes: 3,
    laneWidth: 360
  },
  obstacles: {
    width: 80,
    height: 80,
    baseSpeed: 500,
    spawnRate: 1200
  },
  difficulty: {
    speedIncrement: 50,
    spawnRateDecrement: 50,
    interval: 10000
  }
};
