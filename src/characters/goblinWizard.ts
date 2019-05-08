export class GoblinWizard extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private walkingSpeed: number;
  private activeState: string;
  private hasAttacked: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initAnims();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.walkingSpeed = 25;

    this.activeState = 'idle';
    this.hasAttacked = false;
  }

  private initImage(): void {
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  private initAnims(): void {
    this.currentScene.anims.create({
      key: 'goblinWizardIdle',
      frames: this.currentScene.anims.generateFrameNumbers('goblinWizard', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
  }

  private setIdle(): void {
    this.anims.playReverse('goblinWizardIdle', true);
    this.body.setVelocityX(0);
  }

  update(): void {
    this.setIdle();
  }
}
