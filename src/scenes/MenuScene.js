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

    // Título
    this.add.text(width / 2, height / 2 - 200, 'DASH RUNNER', {
      fontSize: '96px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.player,
      stroke: gameSettings.colors.obstacle,
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(width / 2, height / 2 - 50, 'Arcade Endless Runner', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.7,
      align: 'center'
    }).setOrigin(0.5);

    // Instrucciones
    this.add.text(width / 2, height / 2 + 100, 'TAP PARA JUGAR', {
      fontSize: '48px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.obstacle,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 200, 'Use arrow keys or tap left/right', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.5,
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
}
