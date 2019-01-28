export class BootScene extends Phaser.Scene {
  //private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload(): void {
    //this.load.image('mockup', './src/assets/trm-mockup.png');
  }

  create(): void {
    //this.phaserSprite = this.add.sprite(400, 240, 'mockup');
  }

  update(): void {
    this.scene.start('GameScene');
  }
}
