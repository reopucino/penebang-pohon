var config = {
  type: Phaser.AUTO,
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
var poolArrayBatangPohonTidakTerpakai = [];

function preload() {
  this.load.image("char", "assets/char-0.png");
  this.load.image("bg", "assets/img_bg.png");
  this.load.image("log", "assets/basic-log.png");
  this.load.image("ranting", "assets/branch-1.png");
}
function create() {
  this.tambahkanBatangPohon = function () {
    var container = this.add.container(0, 0);

    var batangPohon = this.add.image(0, 0, "log");
    var rantingKanan = this.add.image(45, 0, "ranting");
    var rantingKiri = this.add.image(-45, 0, "ranting");
    rantingKiri.setFlip(true);

    container.add(batangPohon);
    container.add(rantingKanan);
    container.add(rantingKiri);

    return container;
  };

  this.mengisiBatangPohon = function () {
    var batangPohonBaru = null;
    if (poolArrayBatangPohonTidakTerpakai.length > 0) {
      batangPohonBaru = poolArrayBatangPohonTidakTerpakai[0];
      poolArrayBatangPohonTidakTerpakai.shift();
    } else {
      batangPohonBaru = this.tambahkanBatangPohon();
    }
    return batangPohonBaru;
  };

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
      onComplete: function () {
        poolArrayBatangPohonTidakTerpakai.push(batangpohon);
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

    var batangPohonBaru = this.mengisiBatangPohon();
    var batangPohonTeratas = arrayBatangPohon[arrayBatangPohon.length - 1];

    batangPohonBaru.y = batangPohonTeratas.y - 70;
    batangPohonBaru.x = batangPohonTeratas.x;

    //batangPohonBaru.setPosition(batangPohonTeratas.x, batangPohonTeratas.y-70);

    batangPohonBaru.angle = 0;
    arrayBatangPohon.push(batangPohonBaru);
  };

  this.add.image(config.width * 0.5, config.height * 0.5, "bg");
  var char = this.add.image(200, 570, "char");

  for (var i = 1; i < 10; i++) {
    var batangPohon = this.tambahkanBatangPohon();

    batangPohon.setPosition(240, config.height - 70 * i);
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
}
function update() {}
