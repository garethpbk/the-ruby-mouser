import { Cloak } from '../characters/cloak';

export class GameScene extends Phaser.Scene {
  /** background */
  private skyBackground: Phaser.GameObjects.Image;
  private mountainsFarBackground: Phaser.GameObjects.TileSprite;
  private mountainsNearBackground: Phaser.GameObjects.TileSprite;
  private castleBackground: Phaser.GameObjects.TileSprite;
  private bushesBackground: Phaser.GameObjects.TileSprite;
  private moonBackground: Phaser.GameObjects.TileSprite;

  /** tilemaps */
  private darkForestMap: Phaser.Tilemaps.Tilemap;
  private grassTileset: Phaser.Tilemaps.Tileset;
  private collisionTileset: Phaser.Tilemaps.Tileset;
  private grassTileLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private decorationTileLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private collisionTileLayer: Phaser.Tilemaps.StaticTilemapLayer;

  /** characters */
  private cloak: Cloak;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload(): void {
    /** load background images */
    this.load.image('sky-background', './src/assets/backgrounds/sky-background.png');
    this.load.image('mountains-far-background', './src/assets/backgrounds/mountains-far-background.png');
    this.load.image('mountains-near-background', './src/assets/backgrounds/mountains-near-background.png');
    this.load.image('moon-background', './src/assets/backgrounds/moon-background.png');
    this.load.image('castle-background', './src/assets/backgrounds/castle-background.png');
    this.load.image('bushes-background', './src/assets/backgrounds/bushes-background.png');

    /** load tileset images and data */
    this.load.image('grass-tileset', './src/assets/tilesets/grass-tileset.png');
    this.load.image('collision-tileset', './src/assets/tilesets/collision-tileset.png');
    this.load.tilemapTiledJSON('dark-forest-map', './src/assets/tilesets/dark-forest-map.json');

    /** load character images */
    this.load.spritesheet('cloak', './src/assets/characters/cloak.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    /** create tilemaps */
    this.darkForestMap = this.make.tilemap({
      key: 'dark-forest-map',
      tileWidth: 32,
      tileHeight: 32,
    });

    //tilemap modifiers for scaling
    const darkForestWidthMod = this.darkForestMap.widthInPixels * 0.5;
    const darkForestHeightMod = this.darkForestMap.heightInPixels * 0.5;

    /** create background images */
    this.skyBackground = this.add.image(darkForestWidthMod, darkForestHeightMod, 'sky-background');
    this.skyBackground.setDisplaySize(this.darkForestMap.widthInPixels, this.darkForestMap.heightInPixels);

    // this.mountainsFarBackground = this.add.tileSprite(
    //   400,
    //   240,
    //   this.darkForestMap.widthInPixels,
    //   this.darkForestMap.heightInPixels,
    //   'mountains-far-background'
    // );
    // this.mountainsNearBackground = this.add.tileSprite(
    //   400,
    //   240,
    //   this.darkForestMap.widthInPixels,
    //   this.darkForestMap.heightInPixels,
    //   'mountains-near-background'
    // );
    this.moonBackground = this.add.tileSprite(400, 240, 800, this.darkForestMap.heightInPixels, 'moon-background');
    this.moonBackground.scrollFactorX = 0.1;
    this.castleBackground = this.add.tileSprite(400, 240, 800, this.darkForestMap.heightInPixels, 'castle-background');
    this.castleBackground.scrollFactorX = 0.05;
    this.bushesBackground = this.add.tileSprite(
      darkForestWidthMod,
      darkForestHeightMod,
      this.darkForestMap.widthInPixels,
      this.darkForestMap.heightInPixels,
      'bushes-background'
    );

    /** create tilesets */
    this.grassTileset = this.darkForestMap.addTilesetImage('grass-tileset');
    this.grassTileLayer = this.darkForestMap.createStaticLayer('grassLayer', this.grassTileset, 0, 0);
    this.decorationTileLayer = this.darkForestMap.createStaticLayer('decorationLayer', this.grassTileset, 0, 0);
    this.collisionTileset = this.darkForestMap.addTilesetImage('collision-tileset');
    this.collisionTileLayer = this.darkForestMap.createStaticLayer('collisionLayer', this.collisionTileset, 0, 0);
    this.darkForestMap.setCollisionByExclusion([-1], true, false);
    this.collisionTileLayer.visible = false;

    /** create characters */
    this.cloak = new Cloak({
      scene: this,
      x: 32,
      //y: 336,
      y: 300,
      key: 'cloak',
    });

    /** physics */
    // set world bounds
    this.physics.world.setBounds(
      0,
      0,
      this.darkForestMap.widthInPixels,
      this.darkForestMap.heightInPixels,
      true,
      true,
      true,
      true
    );
    // cloak collider
    this.physics.add.collider(this.cloak, this.collisionTileLayer);

    // set up camera
    this.cameras.main.setBounds(0, 0, this.darkForestMap.widthInPixels, this.darkForestMap.heightInPixels);
  }

  update(): void {
    this.cloak.update();

    // this.mountainsFarBackground.tilePositionX += 0.05;
    // this.mountainsNearBackground.tilePositionX += 0.1;
    //this.mountainsFarBackground.setTilePosition(this.cameras.main.scrollX / 16, 0);
    //this.mountainsNearBackground.setTilePosition(this.cameras.main.scrollX / 8, 0);
    this.moonBackground.tilePositionX += 0.01;
  }
}
