import Phaser from 'phaser';
import { gameSettings } from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background (use CSS string)
    this.cameras.main.setBackgroundColor(gameSettings.colors.bg);

    // State
    this.score = 0;
    this.gameOver = false;
    this.playerLane = 1;
    this.gameTime = 0;
    this.difficulty = 1;

    this.obstacleSpeed = gameSettings.obstacles.baseSpeed;
    this.spawnRate = gameSettings.obstacles.spawnRate;
    this.lastSpawned = 0;

    // Player (use numeric color for shapes)
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const playerX = lanePositions[this.playerLane];
    
    this.player = this.add.rectangle(
      playerX,
      height - 150,
      gameSettings.player.width,
      gameSettings.player.height,
      gameSettings.colors.playerNum
    );
    this.physics.add.existing(this.player, false);
    this.player.body.setAllowGravity(false);
    this.player.body.setImmovable(true);

    // Obstacles group (physics-controlled)
    this.obstacles = this.physics.add.group({ allowGravity: false });

    // Particles
    this.particles = this.add.particles(0, 0, {
      speed: { min: -120, max: 120 },
      angle: { min: 220, max: 320 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      gravityY: 200
    });

    // Controls
    this.setupControls();

    // Collision handled by physics overlap
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

    // UI texts (use CSS color strings)
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

    // Visual lanes
    this.drawLanes();

    // Difficulty timer
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
    
    // Use same simple positions as obstacles
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const targetX = lanePositions[this.playerLane];

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
    
    // Simple lane dividers at 1/3 and 2/3 of screen width
    this.add.line(0, 0, width * 0.33, 0, width * 0.33, height, 0x1b1b2d, 0.35);
    this.add.line(0, 0, width * 0.66, 0, width * 0.66, height, 0x1b1b2d, 0.35);
  }

  update(time, delta) {
    if (this.gameOver) return;

    this.gameTime += delta;
    this.score = Math.floor(this.gameTime / 100);
    this.scoreText.setText(`Score: ${this.score}`);

    // Spawn obstacles
    this.lastSpawned += delta;
    if (this.lastSpawned >= this.spawnRate) {
      this.spawnObstacle();
      this.lastSpawned = 0;
    }

    // Clean up off-screen obstacles
    this.obstacles.children.each((obstacle) => {
      if (obstacle.y > this.scale.height + 100) {
        obstacle.destroy();
      }
    }, this);
  }

  spawnObstacle() {
    const width = this.scale.width;
    const randomLane = Phaser.Math.Between(0, gameSettings.player.lanes - 1);
    
    // Use simple fixed positions based on lane
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const x = lanePositions[randomLane];

    // Create obstacle with graphics
    const obstacle = this.add.rectangle(
      x,
      -50,
      gameSettings.obstacles.width,
      gameSettings.obstacles.height,
      gameSettings.colors.obstacleNum
    );

    // Add to physics world and group
    this.physics.add.existing(obstacle);
    this.obstacles.add(obstacle);
    
    // Configure physics body
    obstacle.body.setAllowGravity(false);
    obstacle.body.setVelocityY(this.obstacleSpeed);
    obstacle.body.setImmovable(true);
  }

  hitObstacle(player, obstacle) {
    if (this.gameOver) return;

    this.gameOver = true;
    this.particles.emitParticleAt(player.x, player.y, 35);
    if (obstacle && obstacle.destroy) obstacle.destroy();

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
