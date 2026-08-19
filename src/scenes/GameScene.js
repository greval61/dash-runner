import Phaser from 'phaser';
import { gameSettings } from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.cameras.main.setBackgroundColor(gameSettings.colors.bg);

    this.score = 0;
    this.gameOver = false;
    this.playerLane = 1;
    this.gameTime = 0;
    this.difficulty = 1;

    this.obstacleSpeed = gameSettings.obstacles.baseSpeed;
    this.spawnRate = gameSettings.obstacles.spawnRate;
    this.lastSpawned = 0;

    this.player = this.add.rectangle(
      width / 2,
      height - 150,
      gameSettings.player.width,
      gameSettings.player.height,
      Phaser.Display.Color.HexStringToColor(gameSettings.colors.player).color
    );

    this.physics.add.existing(this.player, false);
    this.player.body.setAllowGravity(false);

    this.obstacles = this.physics.add.group({ allowGravity: false });

    this.particles = this.add.particles(0, 0, {
      speed: { min: -120, max: 120 },
      angle: { min: 220, max: 320 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      gravityY: 200
    });
    this.particles.emitZoneSource = null;

    this.setupControls();

    this.scoreText = this.add.text(50, 50, 'Score: 0', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: gameSettings.colors.player,
      stroke: '#000000',
      strokeThickness: 4
    });

    this.difficultyText = this.add.text(width - 50, 50, 'Lvl: 1', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: gameSettings.colors.obstacle,
      align: 'right',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(1, 0);

    this.drawLanes();

    this.time.addEvent({
      delay: 10000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });
  }

  setupControls() {
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

    this.input.on('pointerdown', (pointer) => {
      const width = this.scale.width;
      if (pointer.x < width / 3 && this.playerLane > 0) {
        this.playerLane--;
        this.movePlayer();
      } else if (pointer.x > (width * 2) / 3 && this.playerLane < gameSettings.player.lanes - 1) {
        this.playerLane++;
        this.movePlayer();
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
      duration: 120,
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
      this.add.line(0, 0, x, 0, x, height, 0x1b1b2d, 0.35);
    }
  }

  update(time, delta) {
    if (this.gameOver) return;

    this.gameTime += delta;
    this.score = Math.floor(this.gameTime / 100);
    this.scoreText.setText(`Score: ${this.score}`);

    this.lastSpawned += delta;
    if (this.lastSpawned >= this.spawnRate) {
      this.spawnObstacle();
      this.lastSpawned = 0;
    }

    for (const obstacle of this.obstacles.getChildren()) {
      if (!obstacle) continue;

      obstacle.y += (this.obstacleSpeed * delta) / 1000;

      if (obstacle.y > this.scale.height + 100) {
        obstacle.destroy();
        continue;
      }

      const playerBounds = this.player.getBounds();
      const obstacleBounds = obstacle.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, obstacleBounds)) {
        this.hitObstacle(this.player, obstacle);
        break;
      }
    }
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
    obstacle.body.setAllowGravity(false);
    obstacle.body.setVelocityY(this.obstacleSpeed);
    this.obstacles.add(obstacle);
  }

  hitObstacle(player, obstacle) {
    if (this.gameOver) return;

    this.gameOver = true;
    this.particles.emitParticleAt(player.x, player.y, 35);
    obstacle.destroy();

    this.time.delayedCall(450, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  increaseDifficulty() {
    if (this.gameOver) return;

    this.difficulty++;
    this.obstacleSpeed += gameSettings.difficulty.speedIncrement;
    this.spawnRate = Math.max(500, this.spawnRate - gameSettings.difficulty.spawnRateDecrement);
    this.difficultyText.setText(`Lvl: ${this.difficulty}`);
    this.cameras.main.flash(120, 255, 0, 0, 0.25);
  }
}
