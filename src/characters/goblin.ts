export class Goblin extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private walkingSpeed: number;
  private activeState: string;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();
    this.initAnims();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.walkingSpeed = 75;

    this.activeState = 'idle';
  }

  private initImage(): void {
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  private initAnims(): void {
    this.currentScene.anims.create({
      key: 'idle',
      frames: this.currentScene.anims.generateFrameNumbers('goblin', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });

    this.currentScene.anims.create({
      key: 'run',
      frames: this.currentScene.anims.generateFrameNumbers('goblin', { start: 4, end: 7 }),
      frameRate: 4,
      repeat: 1,
    });
  }

  private setIdle(): void {
    this.anims.playReverse('idle', true);
    this.body.setVelocityX(0);
  }

  private setRunning(direction): void {
    this.anims.play('run', true);
    console.log(direction);

    if (direction == 'right') {
      this.flipX = false;
      this.body.setVelocityX(this.walkingSpeed * -1);
    } else if (direction == 'left') {
      this.flipX = true;
      this.body.setVelocityX(this.walkingSpeed);
    }
  }

  private getDistanceAndDirectionFromPlayer(scene): object {
    const playerX = scene.cloak.x;
    const distance = Math.abs(this.x - playerX);
    const direction = this.x - playerX > 0 ? 'right' : 'left';

    return { distance, direction };
  }

  private checkIfPlayerNear(distanceFromPlayer): boolean {
    if (distanceFromPlayer > 100) {
      return false;
    }

    return true;
  }

  private updateActiveState(near): void {
    if (near == true) this.activeState = 'running';
    if (near == false) this.activeState = 'idle';
  }

  update(): void {
    const distanceAndDirectionFromPlayer = this.getDistanceAndDirectionFromPlayer(this.currentScene);
    const isPlayerNear = this.checkIfPlayerNear(distanceAndDirectionFromPlayer['distance']);
    this.updateActiveState(isPlayerNear);

    if (this.activeState == 'idle') {
      this.setIdle();
    }
    if (this.activeState == 'running') {
      this.setRunning(distanceAndDirectionFromPlayer['direction']);
    }
  }
}
