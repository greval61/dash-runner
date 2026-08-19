import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Cargar recursos si es necesario
  }

  create() {
    // Transición inmediata al menú
    this.scene.start('MenuScene');
  }
}
