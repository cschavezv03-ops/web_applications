import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';
const config = {
    type: Phaser.AUTO,
    parent: 'juego',
    width: 800,
    height: 600,
    backgroundColor: '#0b1020',
    scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
},
    scene: [GameScene]
};

new Phaser.Game(config);