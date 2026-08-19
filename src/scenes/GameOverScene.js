import Phaser from 'phaser';
import { gameSettings } from '../config.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Fondo
    this.cameras.main.setBackgroundColor(gameSettings.colors.bg);

    // Título Game Over
    this.add.text(width / 2, height / 2 - 300, 'GAME OVER', {
      fontSize: '96px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.obstacle,
      stroke: gameSettings.colors.player,
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Puntuación
    this.add.text(width / 2, height / 2 - 100, 'PUNTUACIÓN', {
      fontSize: '48px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.7,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 50, `${this.finalScore}`, {
      fontSize: '96px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.player,
      align: 'center'
    }).setOrigin(0.5);

    // Botón Reiniciar
    this.add.text(width / 2, height / 2 + 250, 'TAP PARA REINICIAR', {
      fontSize: '48px',
      fontFamily: 'Arial Black, sans-serif',
      fill: gameSettings.colors.obstacle,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 350, 'Press ENTER or tap to play again', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: gameSettings.colors.text,
      alpha: 0.5,
      align: 'center'
    }).setOrigin(0.5);

    // Eventos
    this.input.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}
