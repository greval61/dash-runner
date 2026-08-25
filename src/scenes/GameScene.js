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

    // Animated star background
    this.createStarfield();

    // State
    this.score = 0;
    this.gameOver = false;
    this.playerLane = 1;
    this.gameTime = 0;
    this.difficulty = 1;
    this.hasShield = false;

    this.obstacleSpeed = gameSettings.obstacles.baseSpeed;
    this.spawnRate = gameSettings.obstacles.spawnRate;
    this.lastSpawned = 0;
    this.lastPowerUpSpawn = 0;

    // Player (use numeric color for shapes)
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const playerX = lanePositions[this.playerLane];
    
    this.player = this.add.rectangle(
      playerX,
      height - 200,
      gameSettings.player.width,
      gameSettings.player.height,
      gameSettings.colors.playerNum
    );
    this.physics.add.existing(this.player, false);
    this.player.body.setAllowGravity(false);
    this.player.body.setImmovable(true);

    // Obstacles group (physics-controlled)
    this.obstacles = this.physics.add.group({ allowGravity: false });

    // Power-ups group
    this.powerUps = this.physics.add.group({ allowGravity: false });

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
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);

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

    // Touch controls for mobile
    this.setupTouchControls();

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

    // Removed pointerdown screen division - now using touch buttons instead
  }

  setupTouchControls() {
    const width = this.scale.width;
    const height = this.scale.height;
    const buttonSize = 120;
    const buttonY = height - 80;
    const buttonSpacing = 200;

    // Create a container for buttons to ensure they're on top
    this.buttonContainer = this.add.container();

    // Left button
    const leftButton = this.add.rectangle(
      width / 2 - buttonSpacing,
      buttonY,
      buttonSize,
      buttonSize,
      0x00f0ff,
      0.6
    );
    leftButton.setStrokeStyle(4, 0x00f0ff);
    leftButton.setInteractive({ useHandCursor: true });
    
    // Left arrow icon
    const leftArrow = this.add.text(
      width / 2 - buttonSpacing,
      buttonY,
      '◀',
      {
        fontSize: '60px',
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    // Right button
    const rightButton = this.add.rectangle(
      width / 2 + buttonSpacing,
      buttonY,
      buttonSize,
      buttonSize,
      0xff0055,
      0.6
    );
    rightButton.setStrokeStyle(4, 0xff0055);
    rightButton.setInteractive({ useHandCursor: true });
    
    // Right arrow icon
    const rightArrow = this.add.text(
      width / 2 + buttonSpacing,
      buttonY,
      '▶',
      {
        fontSize: '60px',
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    // Add to container
    this.buttonContainer.add([leftButton, leftArrow, rightButton, rightArrow]);
    this.buttonContainer.setDepth(1000); // Ensure buttons are on top

    // Left button events
    leftButton.on('pointerdown', () => {
      if (this.playerLane > 0) {
        this.playerLane--;
        this.movePlayer();
        leftButton.setFillStyle(0x00f0ff, 0.9);
      }
    });

    leftButton.on('pointerup', () => {
      leftButton.setFillStyle(0x00f0ff, 0.6);
    });

    leftButton.on('pointerout', () => {
      leftButton.setFillStyle(0x00f0ff, 0.6);
    });

    // Right button events
    rightButton.on('pointerdown', () => {
      if (this.playerLane < gameSettings.player.lanes - 1) {
        this.playerLane++;
        this.movePlayer();
        rightButton.setFillStyle(0xff0055, 0.9);
      }
    });

    rightButton.on('pointerup', () => {
      rightButton.setFillStyle(0xff0055, 0.6);
    });

    rightButton.on('pointerout', () => {
      rightButton.setFillStyle(0xff0055, 0.6);
    });
  }

  createStarfield() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    // Create stars
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(1, 3);
      const speed = Phaser.Math.Between(50, 150);
      
      const star = this.add.rectangle(x, y, size, size, 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.8));
      star.speed = speed;
      this.stars.push(star);
    }
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

    // Animate stars
    this.stars.forEach(star => {
      star.y += star.speed * (delta / 1000);
      if (star.y > this.scale.height) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, this.scale.width);
      }
    });

    // Spawn obstacles
    this.lastSpawned += delta;
    if (this.lastSpawned >= this.spawnRate) {
      this.spawnObstacle();
      this.lastSpawned = 0;
    }

    // Spawn power-ups
    this.lastPowerUpSpawn += delta;
    if (this.lastPowerUpSpawn >= gameSettings.powerUps.spawnRate) {
      this.spawnPowerUp();
      this.lastPowerUpSpawn = 0;
    }

    // Clean up off-screen obstacles
    this.obstacles.children.each((obstacle) => {
      if (obstacle.y > this.scale.height + 100) {
        obstacle.destroy();
      }
    }, this);

    // Clean up off-screen power-ups
    this.powerUps.children.each((powerUp) => {
      if (powerUp.y > this.scale.height + 100) {
        powerUp.destroy();
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

    // If player has shield, destroy shield instead of game over
    if (this.hasShield) {
      this.hasShield = false;
      this.player.setStrokeStyle(0); // Remove shield visual
      this.particles.emitParticleAt(player.x, player.y, 15);
      if (obstacle && obstacle.destroy) obstacle.destroy();
      
      // Flash effect
      this.cameras.main.flash(100, 255, 255, 0, 0.5);
      return;
    }

    this.gameOver = true;
    this.particles.emitParticleAt(player.x, player.y, 35);
    if (obstacle && obstacle.destroy) obstacle.destroy();

    // Save high score
    const currentHighScore = localStorage.getItem('dashRunnerHighScore') || 0;
    if (this.score > currentHighScore) {
      localStorage.setItem('dashRunnerHighScore', this.score);
    }

    this.time.delayedCall(450, () => {
      this.scene.start('GameOverScene', { score: this.score, newHighScore: this.score > currentHighScore });
    });
  }

  spawnPowerUp() {
    const width = this.scale.width;
    const randomLane = Phaser.Math.Between(0, gameSettings.player.lanes - 1);
    
    // Use same lane positions as obstacles
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const x = lanePositions[randomLane];

    // Create shield power-up (green circle)
    const powerUp = this.add.circle(
      x,
      -50,
      gameSettings.powerUps.width / 2,
      0x00FF00
    );
    
    // Add shield icon inside
    const shieldIcon = this.add.text(x, -50, '🛡️', {
      fontSize: '32px',
      align: 'center'
    }).setOrigin(0.5);

    // Add to physics world and group
    this.physics.add.existing(powerUp);
    this.powerUps.add(powerUp);
    
    // Configure physics body
    powerUp.body.setAllowGravity(false);
    powerUp.body.setVelocityY(this.obstacleSpeed * 0.8); // Slower than obstacles
    powerUp.body.setImmovable(true);

    // Store icon reference with power-up
    powerUp.icon = shieldIcon;
  }

  collectPowerUp(player, powerUp) {
    if (this.gameOver) return;

    // Activate shield
    this.hasShield = true;
    this.player.setStrokeStyle(6, 0x00FF00); // Green border for shield

    // Destroy power-up and icon
    if (powerUp.icon) powerUp.icon.destroy();
    powerUp.destroy();

    // Particles effect
    this.particles.emitParticleAt(player.x, player.y, 20);

    // Shield expires after duration
    this.time.delayedCall(gameSettings.powerUps.shieldDuration, () => {
      if (!this.gameOver) {
        this.hasShield = false;
        this.player.setStrokeStyle(0);
      }
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
