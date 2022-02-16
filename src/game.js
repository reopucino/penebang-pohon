var config = {
  type: Phaser.CANVAS,
  width: 480,
  height: 640,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var arrayBatangPohon = [];
var poolArrayBatangPohon = [];

function preload() {
  this.load.image("char", "assets/char-0.png");
  this.load.image("bg", "assets/img_bg.png");
  this.load.image("log", "assets/basic-log.png");
}
function create() {
  this.add.image(config.width * 0.5, config.height * 0.5, "bg");
  var char = this.add.image(200, 570, "char");

  for (var i = 1; i < 15; i++) {
    var batangPohon = this.add.image(240, config.height - 70 * i, "log");
    arrayBatangPohon.push(batangPohon);
  }

  this.input.keyboard.on("keydown-RIGHT", () => {
    char.x = 280;
    char.flipX = true;
    //tumbangkan pohon ke kiri
    var batangpohon = arrayBatangPohon[0];
    this.animasiBatangPohon(batangpohon, "kiri");
    arrayBatangPohon.shift();
    this.turunkanBatangPohon();
  });

  this.input.keyboard.on("keydown-LEFT", () => {
    char.x = 200;
    char.flipX = false;
    //tumbangkan pohon ke kiri
    var batangpohon = arrayBatangPohon[0];
    this.animasiBatangPohon(batangpohon, "kanan");
    arrayBatangPohon.shift();
    this.turunkanBatangPohon();
  });

  this.animasiBatangPohon = function (batangpohon, posisilempar) {
    //buat timelinetween
    var timeline = this.tweens.createTimeline();
    var xLemparan = 360;
    if (posisilempar == "kiri") {
      xLemparan = 120;
    }

    timeline.add({
      targets: batangpohon,
      ease: "Linear",
      duration: 300,
      y: 500,
    });
    timeline.add({
      targets: batangpohon,
      ease: "Linear",
      duration: 300,
      y: 700,
      onComplete: () => {
        poolArrayBatangPohon.push(batangpohon);
        //console.log(this.animasiBatangPohon);
      },
    });

    timeline.play();
    this.tweens.add({
      targets: batangpohon,
      ease: "Linear",
      duration: 600,
      x: xLemparan,
      angle: 720,
    });
  };

  this.turunkanBatangPohon = function () {
    for (var i = 0; i < arrayBatangPohon.length; i++) {
      batangPohon = arrayBatangPohon[i];
      batangPohon.y = config.height - 70 * (i + 1);
    }
  };

  this.mengisiBatangPohon = function (obj_batangpohon) {
    var panjangPohon = arrayBatangPohon.length();
    //var
    //obj_batangpohon.x = arr
  };
}
function update() {}
