interface Near {
  isNear: boolean;
  animation: string;
}

export class Goblin extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private walkingSpeed: number;
  private initialX: number;
  private activeState: string;
  private isIdle: boolean;
  private isRunning: boolean;
  private isAttacking: boolean;
  private hasAttacked: boolean;
  private isReturning: boolean;
  private hasReturned: boolean;

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
    this.initialX = params.x;

    this.activeState = 'idle';
    this.isIdle = false;
    this.isRunning = false;
    this.isAttacking = false;
    this.hasAttacked = false;
    this.isReturning = false;
    this.hasReturned = false;
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

  private resetIs(activeState: string): void {
    switch (activeState) {
      case 'idle':
        this.isRunning = false;
        this.isReturning = false;
        this.isAttacking = false;
        return;
      case 'returning':
        this.isIdle = false;
        this.isAttacking = false;
        return;
      case 'attacking':
        this.isIdle = false;
        this.isRunning = false;
        this.isReturning = false;
        return;
    }
  }

  private setIdle(): void {
    // console.log('is idle');
    this.anims.playReverse('goblinIdle', true);
    this.body.setVelocityX(0);

    this.isIdle = true;
  }

  private setRunning(direction: string): void {
    console.log('is running');
    this.anims.play('goblinRun', true);

    if (direction == 'right') {
      this.flipX = false;
      this.body.setVelocityX(this.walkingSpeed * -1);
    } else if (direction == 'left') {
      this.flipX = true;
      this.body.setVelocityX(this.walkingSpeed);
    }

    this.isRunning = true;
  }

  private checkIfHasReturned(distance: number) {
    /**
     * doesn't hit exactly 0...tweak this
     */
    if (distance > 0 && distance < 2) {
      this.isReturning = false;
      this.hasReturned = true;
      // so as not to have to do this
      this.x = this.initialX;
    }
  }

  private setReturning(direction: string): void {
    console.log('is returning');
    // this.setIdle();

    this.setRunning(direction);
    this.resetIs('returning');
    // setTimeout(() => {
    // }, 1500);

    this.hasReturned = false;
    this.isReturning = true;
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
    console.log('is attacking');
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

    this.resetIs('attacking');
    this.setHasAttacked();
    this.isAttacking = true;
  }

  private getDistanceAndDirectionFromPlayer(scene): object {
    const playerX = scene.cloak.x;
    const distance = Math.abs(this.x - playerX);
    const direction = this.x - playerX > 0 ? 'right' : 'left';

    return { distance, direction };
  }

  private getDistanceFromStartingPoint(): number {
    const xDifferenceFromStartingPoint = this.x - this.initialX;

    return xDifferenceFromStartingPoint;
  }

  private checkIfPlayerNear(distanceFromPlayer: Number): Near {
    if (distanceFromPlayer > 100) {
      const xDifferenceFromStartingPoint = this.getDistanceFromStartingPoint();

      if (xDifferenceFromStartingPoint !== 0) {
        return { isNear: false, animation: 'returning' };
      }

      return { isNear: false, animation: 'idle' };
    }

    if (distanceFromPlayer < 5) {
      return { isNear: true, animation: 'attack' };
    }

    return { isNear: true, animation: 'running' };
  }

  private updateActiveState(near: Near): void {
    if (near.isNear == false) {
      switch (near.animation) {
        case 'idle':
          this.activeState = 'idle';
          return;
        case 'returning':
          this.activeState = 'returning';
          return;
        default:
          this.activeState = 'idle';
          return;
      }
    } else if (near.isNear == true) {
      switch (near.animation) {
        case 'running':
          this.activeState = 'running';
          return;
        case 'attack':
          this.activeState = 'attack';
          return;
        default:
          this.activeState = 'running';
          return;
      }
    }
  }

  update(): void {
    const distanceAndDirectionFromPlayer = this.getDistanceAndDirectionFromPlayer(this.currentScene);
    const isPlayerNear = this.checkIfPlayerNear(distanceAndDirectionFromPlayer['distance']);
    this.updateActiveState(isPlayerNear);

    const isObj = {
      idle: this.isIdle,
      running: this.isRunning,
      returning: this.isReturning,
      attacking: this.isAttacking,
    };

    if (this.activeState == 'idle' && this.isIdle == false) {
      console.log('setting idle');
      this.resetIs('idle');
      this.setIdle();
    }

    if (this.activeState == 'running' && this.isRunning == false) {
      this.isIdle = false;
      this.setRunning(distanceAndDirectionFromPlayer['direction']);
    }

    if (this.activeState == 'returning') {
      const xDifferenceFromStartingPoint = this.getDistanceFromStartingPoint();
      if (this.hasReturned) {
        this.resetIs('returning');
        this.activeState = 'idle';
      }

      if (this.isReturning == false) {
        const direction = xDifferenceFromStartingPoint < 0 ? 'left' : 'right';

        this.setReturning(direction);
      } else {
        this.checkIfHasReturned(xDifferenceFromStartingPoint);
      }
    }

    /**
     * ok to call setAttacking() in every update tick
     * needs to check if it has attacked within the timeout and attack again if not
     */
    if (this.activeState == 'attack') {
      this.setAttacking(distanceAndDirectionFromPlayer['direction'], distanceAndDirectionFromPlayer['distance']);
    }
  }
}
