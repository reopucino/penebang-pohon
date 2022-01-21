var config = {
    type:Phaser.AUTO,
    width:480,
    height:640,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('char', 'assets/char-0.png');
    this.load.image('log', 'assets/basic-log.png');
}
function create(){
    var char = this.add.image(200, 200, 'char');
    this.add.image(240, 200, 'log');

    this.input.keyboard.on('keydown-RIGHT', ()=>{
        char.x = 280;
        char.flipX = true;
    });

    this.input.keyboard.on('keydown-LEFT', ()=>{
        char.x = 200;
        char.flipX=false;
    });
}
function update(){
}