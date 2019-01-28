export class Cloak extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;
  private jumpingSpeed: number;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initInput();
    this.initAnims();
    this.initCamera();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.walkingSpeed = 100;
    this.jumpingSpeed = 200;
  }

  private initImage(): void {
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  private initInput(): void {
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
  }

  private initAnims(): void {
    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers('cloak', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  private initCamera(): void {
    this.currentScene.cameras.main.startFollow(this);
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.flipX = false;
      this.body.setVelocityX(this.walkingSpeed);
      this.anims.play('right', true);
    } else if (this.cursors.left.isDown) {
      this.flipX = true;
      this.body.setVelocityX(this.walkingSpeed * -1);
      this.anims.play('right', true);
    } else {
      this.body.setVelocityX(0);
      this.anims.stop();
    }

    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.body.setVelocityY(this.jumpingSpeed * -1);
    }
  }
}
