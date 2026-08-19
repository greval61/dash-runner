import Phaser from 'phaser';
import { gameSettings } from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo
    this.cameras.main.setBackgroundColor(gameSettings.colors.bg);

    // Inicializar variables de juego
    this.score = 0;
    this.gameOver = false;
    this.playerLane = 1; // 0, 1, 2
    this.gameTime = 0;
    this.difficulty = 1;

    // Velocidades dinámicas
    this.obstacleSpeed = gameSettings.obstacles.baseSpeed;
    this.spawnRate = gameSettings.obstacles.spawnRate;
    this.lastSpawned = 0;

    // Crear jugador
    this.player = this.add.rectangle(
      width / 2,
      height - 150,
      gameSettings.player.width,
      gameSettings.player.height,
      Phaser.Display.Color.HexStringToColor(gameSettings.colors.player).color
    );
    this.physics.add.existing(this.player, false);

    // Crear grupos
    this.obstacles = this.physics.add.group();
    this.particles = this.add.particles(0, 0, {
      speed: { min: -100, max: 100 },
      angle: { min: 240, max: 300 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      gravityY: 300
    });
    this.particles.emitZoneSource = null;

    // Controles
    this.setupControls();

    // Colisiones
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.hitObstacle,
      null,
      this
    );

    // UI
    this.scoreText = this.add.text(50, 50, 'Score: 0', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: gameSettings.colors.player
    });

    this.difficultyText = this.add.text(width - 50, 50, 'Lvl: 1', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: gameSettings.colors.obstacle,
      align: 'right'
    }).setOrigin(1, 0);

    // Líneas de carril (visual)
    this.drawLanes();

    // Sistema de dificultad
    this.time.addEvent({
      delay: gameSettings.difficulty.interval,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });
  }

  setupControls() {
    // Teclado
    this.input.keyboard.on('keydown-LEFT', () => {
      if (this.playerLane > 0) {
        this.playerLane--;
        this.movePlayer();
      }
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      if (this.playerLane < gameSettings.player.lanes - 1) {
        this.playerLane++;
        this.movePlayer();
      }
    });

    // Touch/Tap
    this.input.on('pointerdown', (pointer) => {
      const width = this.scale.width;
      if (pointer.x < width / 3) {
        if (this.playerLane > 0) {
          this.playerLane--;
          this.movePlayer();
        }
      } else if (pointer.x > (width * 2) / 3) {
        if (this.playerLane < gameSettings.player.lanes - 1) {
          this.playerLane++;
          this.movePlayer();
        }
      }
    });
  }

  movePlayer() {
    const width = this.scale.width;
    const laneWidth = gameSettings.player.laneWidth;
    const targetX = width / 2 - laneWidth + this.playerLane * laneWidth;

    this.tweens.add({
      targets: this.player,
      x: targetX,
      duration: 150,
      ease: 'Power2'
    });
  }

  drawLanes() {
    const width = this.scale.width;
    const height = this.scale.height;
    const laneWidth = gameSettings.player.laneWidth;
    const startX = width / 2 - laneWidth;

    for (let i = 1; i < gameSettings.player.lanes; i++) {
      const x = startX + i * laneWidth;
      this.add.line(0, 0, x, 0, x, height, 0x222233, 0.3);
    }
  }

  update(time, delta) {
    if (this.gameOver) return;

    this.gameTime += delta;
    this.score = Math.floor(this.gameTime / 100);
    this.scoreText.setText(`Score: ${this.score}`);

    // Spawn obstáculos
    this.lastSpawned += delta;
    if (this.lastSpawned >= this.spawnRate) {
      this.spawnObstacle();
      this.lastSpawned = 0;
    }

    // Remover obstáculos fuera de pantalla
    this.obstacles.children.entries.forEach((obstacle) => {
      if (obstacle.y > this.scale.height + 100) {
        obstacle.destroy();
      }
    });
  }

  spawnObstacle() {
    const width = this.scale.width;
    const laneWidth = gameSettings.player.laneWidth;
    const startX = width / 2 - laneWidth;
    const randomLane = Phaser.Math.Between(0, gameSettings.player.lanes - 1);
    const x = startX + randomLane * laneWidth;

    const obstacle = this.add.rectangle(
      x,
      -50,
      gameSettings.obstacles.width,
      gameSettings.obstacles.height,
      Phaser.Display.Color.HexStringToColor(gameSettings.colors.obstacle).color
    );

    this.physics.add.existing(obstacle, false);
    obstacle.body.setVelocityY(this.obstacleSpeed);
    this.obstacles.add(obstacle);
  }

  hitObstacle(player, obstacle) {
    this.gameOver = true;
    obstacle.destroy();

    // Efecto de partículas
    this.particles.emitParticleAt(player.x, player.y, 20);

    // Game Over
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  increaseDifficulty() {
    if (this.gameOver) return;

    this.difficulty++;
    this.obstacleSpeed += gameSettings.difficulty.speedIncrement;
    this.spawnRate = Math.max(
      500,
      this.spawnRate - gameSettings.difficulty.spawnRateDecrement
    );

    this.difficultyText.setText(`Lvl: ${this.difficulty}`);

    // Efecto visual
    this.cameras.main.flash(100, 255, 0, 0, 0.3);
  }
}
