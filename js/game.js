//super class for menu
class Menu extends Phaser.Scene{
    
    constructor ()
    {
        super('Menu');

        this.active;
        this.currentScene;
        this.backgroundMenu;
    }
    
    preload() {
        this.load.image('backgroundMenu', 'assets/backgroundMenu.jpg');
        this.load.image('button', 'assets/startButton.jpg');

    }
    
    create(){
        
        let backgroundMenu = this.add.sprite(0, 0, 'backgroundMenu').setScale(1,1);
        let button = this.add.sprite(this.sys.game.config.width/3, 320, 'button').setScale(0.5,0.5);
        
        backgroundMenu.setOrigin(0, 0);
        button.setOrigin(0, 0);
        
        //button calls the game scene
        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));
        this.resize();
        
    }
    
    resize () {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
    }


}

class gameover extends Phaser.Scene{
    
    constructor ()
    {
        super('gameover');

        this.active;
        this.currentScene;
        this.gameover;
    }
    
    preload() {
        this.load.image('gameover', 'assets/gameover.jpg');
        this.load.image('restartBtn', 'assets/restart.jpg');
        
      
    }
    
    create(){
        
        let gameover = this.add.sprite(0, 0, 'gameover');
        let restartBtn = this.add.sprite(this.sys.game.config.width/3, 300, 'restartBtn').setScale(0.5,0.5);
        //displays score
        this.scoreText = this.add.text(this.sys.game.config.width/3,40,'score: ' + score,{
        fontSize: '25px',
        fill: '#ffffff'
        });
        
        gameover.setOrigin(0, 0);
        restartBtn.setOrigin(0, 0);
        
        //calls the game scene
        score = 0;
        restartBtn.setInteractive();
        restartBtn.on('pointerdown', () => this.scene.start('Game'));
              
    }
}


//set score to zero to begin
var score=0;
var frames=0;
var seconds=0;

//new scene called game
let gameScene = new Phaser.Scene('Game');
// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 360,
  height: 640,
  scene: [Menu,gameScene,gameover]
};


// create a new game, pass the configuration
let game = new Phaser.Game(config);

// some parameters for our scene
gameScene.init = function() {
  this.shipSpeed = 1.5;
  this.cometMaxY = 280;
  this.cometMinY = 80;
    
}

// load assets
gameScene.preload = function(){
    
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0xDAA520, 0.8);
    progressBox.fillRect(80, 270, 200, 50);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 70,
        text: 'Launching!',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'    
        }
    });
    assetText.setOrigin(0.5, 1);
    this.load.on('progress', function (value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xFFD700, 1);
        progressBar.fillRect(80, 280, 200 * value, 30);
        percentText.setText(parseInt(value * 100) + '%');
    });
    this.load.on('fileprogress', function (file) {
    assetText.setText('Loading asset: ' + file.key);
        
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    loadingText.setOrigin(0.5, 0.5);
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(80, 270, 200, 50);
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 25,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('ship', 'assets/ship.png');
  this.load.image('comet', 'assets/comet.png');
  this.load.image('muteBtn', 'assets/mute.png');
  this.load.audio('music', 'assets/music.mp3');
    
};

// called once after the preload ends

gameScene.create = function() {
    
    image0 = this.add.tileSprite(400, 300, 1000, 800, 'background');
    //console.log(image0);

    // create the ship
    this.ship = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.2, 'ship');

    // we are reducing the width and height by 50%
    this.ship.setScale(0.4);
    
    
    
    soundName=this.sound.add('music');
    soundName.play();
    
    this.muteBtn = this.add.sprite(20,20, 'muteBtn');
    this.muteBtn.setScale(0.25);
    this.muteBtn.setOrigin(0, 0);
    this.muteBtn.setInteractive();
    this.muteBtn.on('pointerdown', () => soundName.stop());



    // group of comets
    this.comets = this.add.group({
        key: 'comet',
        repeat: 7,
        setXY: {
        x: 0,
        y: -350,
        stepX: 90,
        stepY: 0,
        }
    });
    
    this.scoreText = this.add.text(this.sys.game.config.width/2.5,40,'score:0',{
        fontSize: '25px',
        fill: '#ffffff'
    });
    

    // scale comets down
     Phaser.Actions.ScaleXY(this.comets.getChildren(), -0.6, -0.6);

     // set random speeds
     Phaser.Actions.Call(this.comets.getChildren(), function(comet) {
        comet.speed = Math.random() * 4.5 + 2;
     }, this);

     //  ship is alive
    this.isShipAlive = true;

    //  reset camera effects. Not sure if this is needed
    this.cameras.main.resetFX();
};


// this is called up to 60 times per second
gameScene.update = function(){
    
    if(frames<=20){
        frames++
            console.log(frames);
    } else {
        
        if (score % 20 == 0){
        
        
        Phaser.Actions.Call(this.comets.getChildren(), function(comet) {
            comet.speed += 1.2;
     }, this);
        
    }
        score++
        frames=0
    }
    

    if (!this.isShipAlive) {
        return;
    }
    
    
    // stops player going off screen left
    if (this.ship.x < 24){
                
        this.ship.x = 24;
        
    }
    
    // stops player going off screen right
    if (this.ship.x > 336){

        
        this.ship.x = 336;
        
    }
    
    //console.log(image0.tilePositionY);
    image0.tilePositionY -= 2;
    
    //check is ship isShip dead -> exit the update loop
    if (!this.isShipAlive) {
    return;
    }
    
    //Loop allows the player to keep the ship still if needed
    if(this.input.activePointer.isDown){
        
            // check for active input
      if (this.input.activePointer.downX > this.sys.game.config.width / 2) {

            // player moves right
            this.ship.x += 5;
            
        }

        else if (this.input.activePointer.downX < this.sys.game.config.width / 1) {

            // player moves left
            this.ship.x += -5;
        }       
    }
    
 
  // 07: add collision detection for each member of the comets group
  let comets = this.comets.getChildren();
  let numComets = comets.length;

    for (let i = 0; i < numComets; i++) {

        // move enemies
        comets[i].y += comets[i].speed;


        if (comets[i].y >= 800) {
            
            comets[i].y = -800;
            comets[i].x= (Math.random() * 320 + 20);
        }

        //  enemy collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.ship.getBounds(), comets[i].getBounds())) {
            this.gameOver();
            break;
        }

    }
     
    
    this.scoreText.setText("Score:" + score);
    //console.log(score);

};

// end the game
gameScene.gameOver = function() {
    

    Phaser.Actions.Call(this.comets.getChildren(), function(comet) {
        comet.speed = Math.random() * 4.5 + 2;
     }, this);

    //ship alive flag set to  dead
    this.isShipAlive = false;
    soundName.destroy();


    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(500);

   //fading out

    this.time.delayedCall(250, function() {
        this.cameras.main.fade(250);
    }, [], this);
    
  
    // call gamover scene
    this.time.delayedCall(500, function() {
        score--;
        this.scene.start('gameover');
    }, [], this);
}

