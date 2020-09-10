let config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        width: 2000,
        height: 1000,
    },
    backgroundColor: 0xff00cc,


    //adding a physics engine to our game
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000 //more no means more pull 
            },
            debug: false, //show body shape lines 
        }
    },



    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};
let game = new Phaser.Game(config);
var base5 = 15100;

function preload() {
    this.load.image("ground", "Assets/topground.png");
    this.load.image("sky", "Assets/background.png");
    this.load.spritesheet("dude", "Assets/dude.png", { frameWidth: 32, frameHeight: 48 });  ///if get error check for the size of the spritesheet

    this.load.image("apple", "Assets/apple.png");
    
     this.load.image("ray","Assets/ray.png");
    this.load.image("tree","Assets/tree.png");
    this.load.image("cloud","Assets/cloud.png");
}

function create() {

    W = game.config.width;
    H = game.config.height;

    //create a background 
    let background = this.add.sprite(0, 0, 'sky');
    background.setOrigin(0, 0);
    background.displayWidth = W//expand this sky strip
    background.displayHeight = H;
    background.depth = -2;


    let ground = this.add.tileSprite(0, H - 128, W, 128, 'ground');
    ground.setOrigin(0, 0);


    // let player = this.add.sprite(100,100,'dude',4)   //normal sprite
    //sprite with physics  player 

    this.player = this.physics.add.sprite(100, 100, 'dude', 4);
    console.log(this.player);
    this.player.setDepth(2);
    
    //
   let tree1 = this.add.sprite(580,H-280,'tree');  // if we descrease the value thing will go down 
   let tree2 = this.add.sprite(1450,H-250,'tree');
    tree1.setScale(0.4,0.6);
     tree2.setScale(0.4,0.5);
   let cloud1 = this.add.sprite(200,200,'cloud');
    
     let cloud2 = this.add.sprite(1000,300,'cloud');
     let cloud3 = this.add.sprite(1500,150,'cloud');   // if we descrese value here it will do up 
     let cloud4 = this.add.sprite(1800,450,'cloud');
     
    //Ray of sun 
    
   
    
    //creating multiple rays using arra
    let rays = [];
    
    for(let i = -10 ; i<=10 ; i++){
    let ray =  this.add.sprite(W/2,H-128,"ray");   //100 px from bottom it takes 100 from center of image
    //but we want the bottom of image as center of image so we change the anchor point
    ray.setOrigin(0.5,1);
    ray.displayHeight = 1.5*H;
    ray.alpha  = 0.2; //give transperency 
    ray.angle = i*25;
    ray.depth = -1;
    rays.push(ray);
    }
    
    console.log(rays);
    //so that player cannot go outside the frame
    this.player.setCollideWorldBounds(true);
    
    //create a tween for animation of rays
//    this.tweens.add({
//        targets: rays,
//        probs:{
//            angle:{
//                value : "+=20",
//            }
//        },
//        duration : 9000,
//        repeat : -1,
//    });
      
    this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=20"
            },
        },
        duration : 8000,
        repeat : -1
    });
    
    
    
    
    
    
    //adding physics to the ground
  //  this.physics.add.existing(ground);
   // ground.body.allowGravity = false;
    //this will make ground immovable so any other object wont make it fall because of momentum 
    //ground.body.immovable = true;


    
    
    //creating player animation 
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: "center",
        frames: this.anims.generateFrameNumbers('dude',{start:4,end:4}),
        frameRate: 10,
        
    });
    
    
    
    
    
    
    
    
// taking input from keyboard 
    this.cursors = this.input.keyboard.createCursorKeys();
    


    //apples Group of apples
    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 20,
        setScale: { x: 0.2, y: 0.2 }, //apple will be 20% of its orignal size 
        setXY: { x: 10, y: 10, stepX: 100 }


    });

    //add a collision detection between player and ground 
    //this.physics.add.collider(ground, this.player);
    //between fruits and ground 
    //  this.physics.add.collider(ground,fruits);

    //add a bouncing effect we use setbouce
    this.player.setBounce(0.3); //if 1 player will keep on bouncing 
    //adding bouncing to the apples
    fruits.children.iterate(function (f) {
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7))  //random bounce value 
    })



    //create platform 
    let platforms = this.physics.add.staticGroup();
    // platforms.create(600,400,"ground"); //just adding 
    // platforms.create(600,400,'ground').setScale(2,.5);//changing size of platform //but shape of body wont change
    platforms.create(500, 450, 'ground').setScale(2, .5).refreshBody(); //to change shape also we will do refresh 
    platforms.create(700, 300, 'ground').setScale(2, .5).refreshBody();
    platforms.create(100, 300, 'ground').setScale(2, .5).refreshBody();
    
    platforms.create(1000, 500, 'ground').setScale(2, .5).refreshBody();
     platforms.create(1200, 700, 'ground').setScale(2, .5).refreshBody();
     platforms.create(1650, 750, 'ground').setScale(2, .5).refreshBody();
     platforms.create(300, 650, 'ground').setScale(2, .5).refreshBody();


    platforms.add(ground);//add ground to platform 
        this.physics.add.existing(ground);
    
    
    this.physics.add.collider(platforms, fruits);
    this.physics.add.collider(platforms,this.player);
   
    //this.physics.add.collider(ground, this.player);
    this.physics.add.overlap(fruits,this.player,eatFruit,null,this);
    
    //create camera
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.3);
    
    
    
}
let game_config = {
    player_speed : 150, 
    player_jump_speed : -700
}
function update() {
if(this.cursors.left.isDown){
    this.player.setVelocityX(-game_config.player_speed);
    this.player.anims.play("left",true)  //will create player left animation 
}
    else if (this.cursors.right.isDown){
        this.player.setVelocityX(game_config.player_speed);
         this.player.anims.play("right",true)
    }
    else{
         this.player.setVelocityX(0);
         this.player.anims.play("center",true)
    }
    
    
    //adding jump ability 
    if(this.cursors.up.isDown && this.player.body.touching.down){
    this.player.setVelocityY(game_config.player_jump_speed);
}
}


function eatFruit(player,fruit){
    console.log("Player eating fruit");
      fruit.disableBody(true,true);
    
}