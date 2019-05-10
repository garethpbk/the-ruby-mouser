class GoblinFire extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initAnims();
    this.setIdle();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
  }

  private initAnims(): void {
    this.currentScene.anims.create({
      key: 'goblinFireIdle',
      frames: this.currentScene.anims.generateFrameNumbers('goblinFire', { start: 0, end: 2 }),
      duration: 600,
      repeat: -1,
    });
  }

  private setIdle(): void {
    this.anims.play('goblinFireIdle', true);
  }

  update(): void {}
}

export default GoblinFire;
