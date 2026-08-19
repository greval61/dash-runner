import Phaser from 'phaser';
import { gameConfig } from './config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

gameConfig.scene = [BootScene, MenuScene, GameScene, GameOverScene];

const game = new Phaser.Game(gameConfig);
