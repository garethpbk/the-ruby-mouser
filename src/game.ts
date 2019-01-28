/// <reference path="./phaser.d.ts" />

import 'phaser';
import { BootScene } from './scenes/bootScene';
import { GameScene } from './scenes/gameScene';

const config: GameConfig = {
  width: 800,
  height: 480,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, GameScene],
  input: {
    keyboard: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
    render: { pixelArt: true, antiAlias: false },
  },
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
});
