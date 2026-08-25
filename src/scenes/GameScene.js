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

    // Create game textures
    this.createSpaceshipTexture();
    this.createMeteoriteTexture();
    this.createShieldPowerUpTexture();
    this.createHeartTexture();

    // State
    this.score = 0;
    this.gameOver = false;
    this.playerLane = 1;
    this.gameTime = 0;
    this.difficulty = 1;
    this.hasShield = false;
    this.lives = gameSettings.player.lives;
    this.shieldEndTime = 0; // When shield expires

    this.obstacleSpeed = gameSettings.obstacles.baseSpeed;
    this.spawnRate = gameSettings.obstacles.spawnRate;
    this.lastSpawned = 0;
    this.lastPowerUpSpawn = 0;
    this.lastHeartSpawn = 0;

    // Player (use spaceship graphic)
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const playerX = lanePositions[this.playerLane];
    
    this.player = this.add.sprite(playerX, height - 200, 'spaceship');
    this.player.setScale(1.2);
    this.physics.add.existing(this.player, false);
    this.player.body.setAllowGravity(false);
    this.player.body.setImmovable(true);

    // Obstacles group (physics-controlled)
    this.obstacles = this.physics.add.group({ allowGravity: false });

    // Power-ups group
    this.powerUps = this.physics.add.group({ allowGravity: false });

    // Hearts group
    this.hearts = this.physics.add.group({ allowGravity: false });

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
    this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

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

    // Lives display
    this.livesContainer = this.add.container(50, 120);
    this.livesSprites = [];
    this.updateLivesDisplay();

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

  createSpaceshipTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Main body - futuristic triangle shape
    graphics.fillStyle(0x00f0ff, 1);
    graphics.beginPath();
    graphics.moveTo(40, 0);   // Tip
    graphics.lineTo(20, 60);  // Left bottom
    graphics.lineTo(30, 50);  // Left inner
    graphics.lineTo(30, 35);  // Left middle
    graphics.lineTo(0, 40);  // Left wing tip
    graphics.lineTo(25, 25); // Left wing connection
    graphics.lineTo(40, 35);  // Center
    graphics.lineTo(55, 25); // Right wing connection
    graphics.lineTo(80, 40); // Right wing tip
    graphics.lineTo(50, 35); // Right middle
    graphics.lineTo(50, 50); // Right inner
    graphics.lineTo(60, 60); // Right bottom
    graphics.closePath();
    graphics.fillPath();
    
    // Cockpit (use circle instead of ellipse)
    graphics.fillStyle(0x00a0cc, 0.8);
    graphics.fillCircle(40, 25, 10);
    
    // Engine glow
    graphics.fillStyle(0xff6600, 0.9);
    graphics.beginPath();
    graphics.moveTo(30, 55);
    graphics.lineTo(40, 75);
    graphics.lineTo(50, 55);
    graphics.closePath();
    graphics.fillPath();
    
    // Inner engine
    graphics.fillStyle(0xffff00, 1);
    graphics.beginPath();
    graphics.moveTo(35, 58);
    graphics.lineTo(40, 70);
    graphics.lineTo(45, 58);
    graphics.closePath();
    graphics.fillPath();
    
    // Add metallic shine
    graphics.lineStyle(2, 0xffffff, 0.5);
    graphics.beginPath();
    graphics.moveTo(40, 5);
    graphics.lineTo(40, 20);
    graphics.strokePath();
    
    graphics.generateTexture('spaceship', 80, 80);
    graphics.destroy();
  }

  createMeteoriteTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Main asteroid body
    graphics.fillStyle(0x8B4513, 1);
    graphics.beginPath();
    graphics.moveTo(20, 10);
    graphics.lineTo(35, 5);
    graphics.lineTo(55, 12);
    graphics.lineTo(70, 25);
    graphics.lineTo(75, 40);
    graphics.lineTo(68, 55);
    graphics.lineTo(52, 68);
    graphics.lineTo(35, 72);
    graphics.lineTo(18, 65);
    graphics.lineTo(8, 50);
    graphics.lineTo(5, 32);
    graphics.lineTo(12, 18);
    graphics.closePath();
    graphics.fillPath();
    
    // Craters
    graphics.fillStyle(0x5D3A1A, 0.8);
    graphics.fillCircle(25, 25, 8);
    graphics.fillCircle(50, 35, 6);
    graphics.fillCircle(35, 55, 5);
    
    // Highlights
    graphics.fillStyle(0xA0522D, 0.6);
    graphics.fillCircle(30, 20, 4);
    graphics.fillCircle(55, 28, 3);
    
    // Rocky texture dots
    graphics.fillStyle(0x4A3728, 0.7);
    graphics.fillCircle(40, 40, 2);
    graphics.fillCircle(20, 45, 2);
    graphics.fillCircle(60, 50, 2);
    graphics.fillCircle(45, 60, 2);
    
    graphics.generateTexture('meteorite', 80, 80);
    graphics.destroy();
  }

  createShieldPowerUpTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Outer glow ring
    graphics.fillStyle(0x00FF00, 0.3);
    graphics.fillCircle(30, 30, 28);
    
    // Main shield body (semicircle using circle clipped)
    graphics.fillStyle(0x00FF00, 0.8);
    graphics.fillCircle(30, 30, 20);
    
    // Shield border
    graphics.lineStyle(3, 0x00CC00, 1);
    graphics.strokeCircle(30, 30, 20);
    
    // Inner shine
    graphics.fillStyle(0x66FF66, 0.6);
    graphics.fillCircle(30, 30, 12);
    
    // Plus symbol
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRect(27, 18, 6, 24);
    graphics.fillRect(18, 27, 24, 6);
    
    graphics.generateTexture('shieldPowerUp', 60, 60);
    graphics.destroy();
  }

  createHeartTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Heart shape using two circles and a triangle
    graphics.fillStyle(0xFF0000, 1);
    
    // Left circle
    graphics.fillCircle(20, 20, 15);
    
    // Right circle
    graphics.fillCircle(40, 20, 15);
    
    // Bottom triangle
    graphics.beginPath();
    graphics.moveTo(10, 25);
    graphics.lineTo(30, 50);
    graphics.lineTo(50, 25);
    graphics.closePath();
    graphics.fillPath();
    
    // Shine effect
    graphics.fillStyle(0xFF6666, 0.6);
    graphics.fillCircle(25, 15, 5);
    
    graphics.generateTexture('heart', 60, 60);
    graphics.destroy();
  }

  updateLivesDisplay() {
    // Clear existing hearts
    this.livesSprites.forEach(heart => heart.destroy());
    this.livesSprites = [];

    // Add hearts for current lives
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.sprite(i * 50, 0, 'heart');
      heart.setScale(0.8);
      this.livesContainer.add(heart);
      this.livesSprites.push(heart);
    }
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

    // Move shield circle with player if active
    if (this.shieldCircle) {
      this.tweens.add({
        targets: this.shieldCircle,
        x: targetX,
        duration: 120,
        ease: 'Power2'
      });
    }
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

    // Check if shield has expired
    if (this.hasShield && this.gameTime >= this.shieldEndTime) {
      this.hasShield = false;
      if (this.shieldCircle) {
        this.shieldCircle.destroy();
        this.shieldCircle = null;
      }
    }

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

    // Spawn hearts
    this.lastHeartSpawn += delta;
    if (this.lastHeartSpawn >= gameSettings.powerUps.heartSpawnRate) {
      this.spawnHeart();
      this.lastHeartSpawn = 0;
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

    // Clean up off-screen hearts
    this.hearts.children.each((heart) => {
      if (heart.y > this.scale.height + 100) {
        heart.destroy();
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

    // Create meteorite obstacle
    const obstacle = this.add.sprite(x, -50, 'meteorite');
    obstacle.setScale(1.0);

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

    // If player has shield, destroy shield instead of losing life
    if (this.hasShield) {
      this.hasShield = false;
      if (this.shieldCircle) {
        this.shieldCircle.destroy();
        this.shieldCircle = null;
      }
      this.particles.emitParticleAt(player.x, player.y, 15);
      if (obstacle && obstacle.destroy) obstacle.destroy();
      
      // Flash effect
      this.cameras.main.flash(100, 255, 255, 0, 0.5);
      return;
    }

    // Reduce lives
    this.lives--;
    this.updateLivesDisplay();
    this.particles.emitParticleAt(player.x, player.y, 20);
    if (obstacle && obstacle.destroy) obstacle.destroy();

    // Flash red effect
    this.cameras.main.flash(150, 255, 0, 0, 0.6);

    // Check if game over
    if (this.lives <= 0) {
      this.gameOver = true;
      this.particles.emitParticleAt(player.x, player.y, 35);

      // Save high score
      const currentHighScore = localStorage.getItem('dashRunnerHighScore') || 0;
      if (this.score > currentHighScore) {
        localStorage.setItem('dashRunnerHighScore', this.score);
      }

      this.time.delayedCall(450, () => {
        this.scene.start('GameOverScene', { score: this.score, newHighScore: this.score > currentHighScore });
      });
    }
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

    // Create shield power-up with new texture
    const powerUp = this.add.sprite(x, -50, 'shieldPowerUp');
    powerUp.setScale(1.0);

    // Add to physics world and group
    this.physics.add.existing(powerUp);
    this.powerUps.add(powerUp);
    
    // Configure physics body
    powerUp.body.setAllowGravity(false);
    powerUp.body.setVelocityY(this.obstacleSpeed * 0.8); // Slower than obstacles
    powerUp.body.setImmovable(true);
  }

  collectPowerUp(player, powerUp) {
    if (this.gameOver) return;

    // Activate shield with green circle around player
    this.hasShield = true;
    this.shieldEndTime = this.gameTime + gameSettings.powerUps.shieldDuration;
    
    // Create or update shield circle
    if (!this.shieldCircle) {
      this.shieldCircle = this.add.circle(player.x, player.y, 50, 0x00FF00, 0.3);
      this.shieldCircle.setStrokeStyle(3, 0x00FF00, 0.8);
      this.shieldCircle.setDepth(999); // Ensure it's visible above everything
    } else {
      // Just update position if circle already exists
      this.shieldCircle.setPosition(player.x, player.y);
    }

    // Destroy power-up
    powerUp.destroy();

    // Particles effect
    this.particles.emitParticleAt(player.x, player.y, 20);
  }

  increaseDifficulty() {
    if (this.gameOver) return;

    this.difficulty++;
    this.obstacleSpeed += gameSettings.difficulty.speedIncrement;
    this.spawnRate = Math.max(500, this.spawnRate - gameSettings.difficulty.spawnRateDecrement);
    this.difficultyText.setText(`Lvl: ${this.difficulty}`);
    this.cameras.main.flash(120, 255, 0, 0, 0.25);
  }

  spawnHeart() {
    const width = this.scale.width;
    const randomLane = Phaser.Math.Between(0, gameSettings.player.lanes - 1);
    
    // Use same lane positions as obstacles
    const lanePositions = [
      width * 0.25,  // Left lane
      width * 0.5,   // Center lane  
      width * 0.75   // Right lane
    ];
    const x = lanePositions[randomLane];

    // Create heart power-up
    const heart = this.add.sprite(x, -50, 'heart');
    heart.setScale(1.0);
    
    // Add to physics world and group
    this.physics.add.existing(heart);
    this.hearts.add(heart);
    
    // Configure physics body
    heart.body.setAllowGravity(false);
    heart.body.setVelocityY(this.obstacleSpeed * 0.7); // Slower than obstacles
    heart.body.setImmovable(true);
  }

  collectHeart(player, heart) {
    if (this.gameOver) return;

    // Add life (max 5 lives)
    this.lives = Math.min(this.lives + 1, 5);
    this.updateLivesDisplay();

    // Destroy heart
    heart.destroy();

    // Particles effect
    this.particles.emitParticleAt(player.x, player.y, 15);

    // Flash green effect
    this.cameras.main.flash(100, 0, 255, 0, 0.4);
  }
}
