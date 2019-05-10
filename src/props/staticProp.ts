class StaticProp extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
  }

  update(): void {}
}

export default StaticProp;
