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
var score = 0;
const DATA_RANTING_KOSONG = 0;
const POSISI_PLAYER_KIRI = 1;
const POSISI_PLAYER_KANAN = 2;

function preload() {
  this.load.image("char", "assets/char-0.png");
  this.load.image("bg", "assets/img_bg.png");
  this.load.image("log", "assets/basic-log.png");
  this.load.image("ranting", "assets/branch-1.png");
}
function create() {
  this.tambahkanBatangPohon = function () {
    var container = this.add.container(0, 0);
    container.setDataEnabled();

    var batangPohon = this.add.image(0, 0, "log");
    var rantingKanan = this.add.image(45, 0, "ranting");
    var rantingKiri = this.add.image(-45, 0, "ranting");
    rantingKiri.setFlip(true);

    container.add(batangPohon);
    container.add(rantingKanan);
    container.add(rantingKiri);

    return container;
  };

  /**
   *
   * @param {number} posisiRanting 0 tidak ada ranting,1 kanan hilang, 2 kiri hilang, default adalah 2
   * @returns Phaser Container batang pohon
   */
  this.mengisiBatangPohon = function (posisiRanting) {
    if (posisiRanting === undefined) posisiRanting = 2;
    var batangPohonBaru = null;
    if (poolArrayBatangPohonTidakTerpakai.length > 0) {
      batangPohonBaru = poolArrayBatangPohonTidakTerpakai[0];
      poolArrayBatangPohonTidakTerpakai.shift();
      batangPohonBaru.iterate(function (child) {
        child.visible = true;
      });
    } else {
      batangPohonBaru = this.tambahkanBatangPohon();
    }

    if (posisiRanting == 0) {
      var rantingKanan = batangPohonBaru.getAt(1);
      rantingKanan.visible = false;
      var rantingKiri = batangPohonBaru.getAt(2);
      rantingKiri.visible = false;
      batangPohonBaru.data.set("ranting", 0);
    } else if (posisiRanting == 2) {
      var rantingKiri = batangPohonBaru.getAt(2);
      rantingKiri.visible = false;
      batangPohonBaru.data.set("ranting", 2);
    } else if (posisiRanting == 1) {
      var rantingKanan = batangPohonBaru.getAt(1);
      rantingKanan.visible = false;
      batangPohonBaru.data.set("ranting", 1);
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

    var pilihRanting = Phaser.Math.Between(1, 2);
    var batangPohonTeratas = arrayBatangPohon[arrayBatangPohon.length - 1];
    var dataRanting = batangPohonTeratas.data.get("ranting");
    if (dataRanting > DATA_RANTING_KOSONG) {
      pilihRanting = 0;
    }
    var batangPohonBaru = this.mengisiBatangPohon(pilihRanting);

    batangPohonBaru.y = batangPohonTeratas.y - 70;
    batangPohonBaru.x = batangPohonTeratas.x;

    //batangPohonBaru.setPosition(batangPohonTeratas.x, batangPohonTeratas.y-70);

    batangPohonBaru.angle = 0;
    arrayBatangPohon.push(batangPohonBaru);
  };

  this.cekTumbukan = function (posisiPlayer) {
    var tumbukan = false;
    var batangPohon = arrayBatangPohon[0];
    var posisiBatangPohon = batangPohon.data.get("ranting");
    if (posisiPlayer == posisiBatangPohon) {
      this.permainanBerakhir();
      tumbukan = true;
    }
    return tumbukan;
  };

  this.permainanBerakhir = function () {
    console.log("permainan berakhir");
    this.input.keyboard.enabled = false;
  };

  this.add.image(config.width * 0.5, config.height * 0.5, "bg");
  var char = this.add.image(200, 570, "char");

  for (var i = 1; i < 10; i++) {
    var batangPohon = this.tambahkanBatangPohon();
    if (i % 2 == 0 || i == 1) {
      var rantingKanan = batangPohon.getAt(1);
      rantingKanan.visible = false;
      var rantingKiri = batangPohon.getAt(2);
      rantingKiri.visible = false;
      batangPohon.data.set("ranting", 0);
    } else {
      var random = Phaser.Math.Between(1, 2);
      var ranting = batangPohon.getAt(random);
      ranting.visible = false;
      batangPohon.data.set("ranting", random);
    }

    batangPohon.setPosition(240, config.height - 70 * i);
    arrayBatangPohon.push(batangPohon);
  }

  //add UI here
  var textDisplay = this.add
    .text(240, 40, score, { fontSize: 50, color: "#000", align: "center" })
    .setOrigin(0.5);
  textDisplay.setDepth(1);

  this.input.keyboard.on("keydown-RIGHT", () => {
    char.x = 280;
    char.flipX = true;
    this.cekTumbukan(POSISI_PLAYER_KANAN);
    //tumbangkan pohon ke kiri
    var batangpohon = arrayBatangPohon[0];
    this.animasiBatangPohon(batangpohon, "kiri");
    arrayBatangPohon.shift();
    this.turunkanBatangPohon();
    //check posisi batang pohon terbawah dan posisi player
    var tumbukan = this.cekTumbukan(POSISI_PLAYER_KANAN);
    if (!tumbukan) {
      score += 1;
      textDisplay.text = score;
    }
  });

  this.input.keyboard.on("keydown-LEFT", () => {
    char.x = 200;
    char.flipX = false;
    this.cekTumbukan(POSISI_PLAYER_KIRI);
    //tumbangkan pohon ke kiri
    var batangpohon = arrayBatangPohon[0];
    this.animasiBatangPohon(batangpohon, "kanan");
    arrayBatangPohon.shift();
    this.turunkanBatangPohon();
    //check posisi batang pohon terbawah dan posisi player
    var tumbukan = this.cekTumbukan(POSISI_PLAYER_KIRI);
    if (!tumbukan) {
      score += 1;
      textDisplay.text = score;
    }
  });
}
function update() {}
