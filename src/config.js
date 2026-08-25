export const gameConfig = {
  type: Phaser.CANVAS,
  width: 1080,
  height: 1920,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      fps: 60
    }
  },
  scene: []
};

export const gameSettings = {
  colors: {
    // Keep both CSS strings for text/UI and numeric values for shape fills
    bg: '#050510',
    bgNum: 0x050510,
    player: '#00f0ff',
    playerNum: 0x00f0ff,
    obstacle: '#ff0055',
    obstacleNum: 0xff0055,
    text: '#ffffff'
  },
  player: {
    width: 80,
    height: 80,
    speed: 400,
    lanes: 3,
    laneWidth: 360, // Not used anymore with simplified positioning
    lives: 3
  },
  obstacles: {
    width: 80,
    height: 80,
    baseSpeed: 500,
    spawnRate: 1200
  },
  powerUps: {
    width: 60,
    height: 60,
    spawnRate: 6000, // Spawn every 6 seconds (was 8)
    shieldDuration: 8000, // 8 seconds of shield (was 5)
    heartSpawnRate: 15000 // Spawn heart every 15 seconds
  },
  difficulty: {
    speedIncrement: 50,
    spawnRateDecrement: 50,
    interval: 10000
  }
};
