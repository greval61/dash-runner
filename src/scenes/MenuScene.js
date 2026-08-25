import Phaser from 'phaser';
import { gameSettings } from '../config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo
    this.cameras.main.setBackgroundColor(gameSettings.colors.bg);

    // Get high score from localStorage
    const highScore = localStorage.getItem('dashRunnerHighScore') || 0;

    // Título
    this.add.text(width / 2, height / 2 - 250, 'DASH RUNNER', {
      fontSize: '96px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.player,
      stroke: gameSettings.colors.obstacle,
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(width / 2, height / 2 - 120, 'Arcade Endless Runner', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.7,
      align: 'center'
    }).setOrigin(0.5);

    // High Score
    this.add.text(width / 2, height / 2 - 40, `🏆 MEJOR PUNTUACIÓN: ${highScore}`, {
      fontSize: '36px',
      fontFamily: 'Arial Black',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5);

    // Instrucciones
    this.add.text(width / 2, height / 2 + 60, 'TAP PARA JUGAR', {
      fontSize: '48px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.obstacle,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 140, 'CONTROLES:', {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      fill: gameSettings.colors.player,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 200, '🖥️ PC: Flechas ← →', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.8,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 240, '📱 Móvil: Toca izquierda/derecha', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.8,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 300, '¡Esquiva los obstáculos rojos!', {
      fontSize: '22px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.obstacle,
      alpha: 0.6,
      align: 'center'
    }).setOrigin(0.5);

    // Eventos de entrada
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // También permitir Enter
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }

  shutdown() {
    // Limpiar listeners para evitar fugas si se vuelven a crear escenas
    this.input.off('pointerdown');
    this.input.keyboard.off('keydown-ENTER');
  }
}

