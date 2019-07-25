export class Goblin extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private walkingSpeed: number;
  private activeState: string;
  private hasAttacked: boolean;
  private hasIdled: boolean;
  private hasReturned: boolean;
  private initialX: number;

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
    this.hasAttacked = false;
    this.hasIdled = false;
    this.hasReturned = false;

    this.initialX = params.x;
  }

  private initImage(): void {
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  private initAnims(): void {
    this.currentScene.anims.create({
      key: 'goblinIdle',
      frames: this.currentScene.anims.generateFrameNumbers('goblin', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });

    this.currentScene.anims.create({
      key: 'goblinRun',
      frames: this.currentScene.anims.generateFrameNumbers('goblin', { start: 4, end: 7 }),
      frameRate: 4,
      repeat: 1,
    });

    this.currentScene.anims.create({
      key: 'goblinAttack',
      frames: this.currentScene.anims.generateFrameNumbers('goblin', { start: 8, end: 14 }),
      duration: 800,
      repeat: 1,
    });
  }

  private resetActiveState(): void {
    this.activeState = null;
  }

  private setIdle(): void {
    if (!this.hasIdled) {
      this.anims.playReverse('goblinIdle', true);
      this.body.setVelocityX(0);
      this.hasIdled = true;
    }
  }

  private setRunning(direction: string): void {
    this.anims.play('goblinRun', true);

    if (direction == 'right') {
      this.flipX = false;
      this.body.setVelocityX(this.walkingSpeed * -1);
    } else if (direction == 'left') {
      this.flipX = true;
      this.body.setVelocityX(this.walkingSpeed);
    }
  }

  private setReturning(direction: string): void {
    if (this.activeState == 'returning') return;

    this.setIdle();

    setTimeout(() => {
      this.setRunning(direction);
    }, 1500);
  }

  private setHasAttacked(): void {
    if (!this.hasAttacked) {
      this.hasAttacked = true;
      setTimeout(() => {
        this.hasAttacked = false;
      }, 800);
    }
  }

  private setAttacking(direction: string, distance: number): void {
    this.anims.play('goblinAttack', true);
    this.body.setVelocityX(0);

    if (direction == 'right') {
      this.flipX = false;
    } else if (direction == 'left') {
      this.flipX = true;
    }

    if (!this.hasAttacked) {
      console.log('hit player');
    }

    this.setHasAttacked();
  }

  private getDistanceAndDirectionFromPlayer(scene): object {
    const playerX = scene.cloak.x;
    const distance = Math.abs(this.x - playerX);
    const direction = this.x - playerX > 0 ? 'right' : 'left';

    return { distance, direction };
  }

  private getDistanceFromStartingPoint(): number {
    const xDifference = this.x - this.initialX;

    if (xDifference == 0) {
      this.hasReturned = true;
    }

    return xDifference;
  }

  private checkIfPlayerNear(distanceFromPlayer: Number): string {
    if (distanceFromPlayer > 50) {
      const awayFromStartingPoint = this.getDistanceFromStartingPoint();

      if (awayFromStartingPoint !== 0) {
        return 'returning';
      }

      return 'idle';
    }

    if (distanceFromPlayer < 25) {
      return 'attack';
    }

    return 'running';
  }

  private updateActiveState(near: String): void {
    if (near == 'attack') this.activeState = 'attack';
    if (near == 'running') this.activeState = 'running';
    if (near == 'idle') this.activeState = 'idle';
    if (near == 'returning') this.activeState = 'returning';
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
    if (this.activeState == 'returning') {
      const direction = this.getDistanceFromStartingPoint() < 0 ? 'left' : 'right';
      this.setReturning(direction);
    }
    if (this.activeState == 'attack') {
      this.setAttacking(distanceAndDirectionFromPlayer['direction'], distanceAndDirectionFromPlayer['distance']);
    }
  }
}
