export class Cloak extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private activeState: string;
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
    this.walkingSpeed = 200;
    this.jumpingSpeed = 200;

    this.activeState = 'idle';
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
      key: 'cloakIdle',
      frames: this.currentScene.anims.generateFrameNumbers('cloak', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: 1,
    });

    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers('cloak', { start: 4, end: 11 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  private initCamera(): void {
    this.currentScene.cameras.main.startFollow(this);
  }

  private checkActiveState(): string {
    if (this.body.velocity.x === 0) {
      return 'idle';
    } else {
      return 'running';
    }
  }

  private setIdle(): void {
    this.anims.play('cloakIdle', true);
  }

  private setRunning(): void {
    this.anims.play('right', true);
  }

  private updateActiveState(currentActiveState): void {
    if (currentActiveState == 'idle') this.activeState = 'idle';

    if (currentActiveState == 'running') this.activeState = 'running';
  }

  update(): void {
    this.handleInput();

    if (this.activeState == 'idle') {
      this.setIdle();
    } else if (this.activeState == 'running') {
      this.setRunning();
    }
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.flipX = false;
      this.body.setVelocityX(this.walkingSpeed);
      this.updateActiveState('running');
    } else if (this.cursors.left.isDown) {
      this.flipX = true;
      this.body.setVelocityX(this.walkingSpeed * -1);
      this.updateActiveState('running');
    } else {
      this.body.setVelocityX(0);
      this.updateActiveState('idle');
    }

    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.body.setVelocityY(this.jumpingSpeed * -1);
    }
  }
}
