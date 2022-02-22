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
  this.load.image("branch1", "assets/branch-1.png");
  this.load.image("branch2", "assets/branch-2.png");
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
      var batangPohon = arrayBatangPohon[i];
      batangPohon.y = config.height - 70 * (i + 1);
    }

    var batangpohonbaru = this.mengisiBatangPohon();
    var batangPohonTeratas = arrayBatangPohon[arrayBatangPohon.length - 1];

    batangpohonbaru.y = batangPohonTeratas.y - 70;
    batangpohonbaru.x = batangPohonTeratas.x;
    batangpohonbaru.angle = 0;
    arrayBatangPohon.push(batangpohonbaru);
  };

  this.mengisiBatangPohon = function () {
    var batangpohonbaru = null;
    if (poolArrayBatangPohon.length > 0) {
      batangpohonbaru = poolArrayBatangPohon[0];
      poolArrayBatangPohon.shift();
    } else {
      batangpohonbaru = this.add.image(240, config.height - 70 * i, "log");
    }
    return batangpohonbaru;
  };

  this.testingContainer = function () {
    var container = this.add.container(80, config.height - 70);

    container.add(this.add.image(0, 0, "log"));
    container.add(this.add.image(45, 0, "branch1"));
    container.add(this.add.image(-45, 0, "branch1").setFlip(true));
    container.setData("ranting", "kanan");

    this.tweens.add({
      targets: container,
      ease: "Linear",
      duration: 1000,
      y: 0,
      yoyo: true,
      //repeat: -1,
      onComplete: function (container, objs) {
        //console.log(container.getData("ranting"));
        console.log(objs[0].getData("ranting"));
        console.log(container);
      },
    });

    console.log(container.getData("ranting"));
    //this.add.image(85, config.height - 70, "branch1");
    //this.add.image(0, config.height - 70, "branch1").setFlip(true);
  };

  this.testingContainer();
}
function update() {}
