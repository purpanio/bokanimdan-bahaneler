const karakterler = [
    { ad: "Oki", dosya: "oki.png", yildiz: true },
    { ad: "Burki", dosya: "burki.png" },
    { ad: "Çaço", dosya: "caco.png" },
    { ad: "Gaptan", dosya: "gaptan.png" },
    { ad: "Memedim", dosya: "memedim.png" },
    { ad: "Osmi", dosya: "osmi.png" },
    { ad: "Yaso", dosya: "yaso.png" }
];

const yildizAlani = document.getElementById("yildiz");
const digerAlani = document.getElementById("digerleri");
const baslaButonu = document.getElementById("basla");
const secimEkrani = document.getElementById("secim-ekrani");
const oyunEkrani = document.getElementById("oyun-ekrani");
const tuval = document.getElementById("tuval");
const ctx = tuval.getContext("2d");

let secilen = null;

karakterler.forEach(function (k) {
    const kart = document.createElement("button");
    kart.className = "karakter";

    const gorsel = document.createElement("img");
    gorsel.src = "resimler/" + k.dosya;
    gorsel.alt = k.ad;

    const etiket = document.createElement("span");
    etiket.textContent = k.ad;

    kart.appendChild(gorsel);
    kart.appendChild(etiket);

    kart.addEventListener("click", function () {
        document.querySelectorAll(".karakter").forEach(function (d) {
            d.classList.remove("secili");
        });
        kart.classList.add("secili");

        secilen = k;
        baslaButonu.disabled = false;
        baslaButonu.textContent = k.ad + " ile başla";
    });

    if (k.yildiz) {
        yildizAlani.appendChild(kart);
    } else {
        digerAlani.appendChild(kart);
    }
});
const YERCEKIMI = 0.45;
const ZIPLAMA = -7.6;
const BORU_ARALIK = 150;
const BORU_GENISLIK = 62;
const BORU_BOSLUK = 145;
const HIZ = 2.4;
const KARE_SURESI = 1000 / 60;
const REKOR_ANAHTARI = "rekor-flappy";

let rekor = Number(localStorage.getItem(REKOR_ANAHTARI) || 0);

let sonZaman = 0, birikim = 0;

let kus, borular, skor, oyunBitti, hazir, kusGorseli, dongu;
let rekor = Number(localStorage.getItem("rekor-flappy") || 0);

function baslat() {
    kus = { x: 96, y: 200, r: 22, hiz: 0 };
    borular = [];
    skor = 0;
    oyunBitti = false;
    hazir = true;
    sonZaman = 0;
    birikim = 0;
    for (let i = 0; i < 3; i++) {
        boruEkle(tuval.width + 140 + i * (BORU_GENISLIK + BORU_ARALIK));
    }

    if (dongu) cancelAnimationFrame(dongu);
    dongu = requestAnimationFrame(kare);
}

function boruEkle(x) {
    const enUst = 70;
    const enAlt = tuval.height - BORU_BOSLUK - 70;
    borular.push({
        x: x,
        ust: enUst + Math.random() * (enAlt - enUst),
        gecildi: false
    });
}

function ziplat() {
    if (oyunBitti) {
        baslat();
        return;
    }
    hazir = false;
    kus.hiz = ZIPLAMA;
}

function guncelle() {
    kus.hiz += YERCEKIMI;
    kus.y += kus.hiz;

    for (const b of borular) {
        b.x -= HIZ;

        if (!b.gecildi && b.x + BORU_GENISLIK < kus.x - kus.r) {
            b.gecildi = true;
            skor++;
            if (skor > rekor) rekor = skor;
        }

        const yatayCakisma = kus.x + kus.r > b.x && kus.x - kus.r < b.x + BORU_GENISLIK;
        const bosluktaDegil = kus.y - kus.r < b.ust || kus.y + kus.r > b.ust + BORU_BOSLUK;
        if (yatayCakisma && bosluktaDegil) bitir();
    }

    if (borular[0].x + BORU_GENISLIK < 0) {
        borular.shift();
        boruEkle(borular[borular.length - 1].x + BORU_GENISLIK + BORU_ARALIK);
    }

    if (kus.y + kus.r > tuval.height || kus.y - kus.r < 0) bitir();
}

function bitir() {
    oyunBitti = true;
    localStorage.setItem(REKOR_ANAHTARI, rekor);
}

function ciz() {
    ctx.clearRect(0, 0, tuval.width, tuval.height);

    ctx.fillStyle = "#2a9d76";
    for (const b of borular) {
        ctx.fillRect(b.x, 0, BORU_GENISLIK, b.ust);
        ctx.fillRect(b.x, b.ust + BORU_BOSLUK, BORU_GENISLIK, tuval.height);
    }

    ctx.save();
    ctx.translate(kus.x, kus.y);
    ctx.rotate(Math.max(-0.5, Math.min(1.2, kus.hiz / 10)));
    ctx.beginPath();
    ctx.arc(0, 0, kus.r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(kusGorseli, -kus.r, -kus.r, kus.r * 2, kus.r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(kus.x, kus.y, kus.r, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffb627";
    ctx.stroke();

    ctx.fillStyle = "#ece8f7";
    ctx.font = "700 34px 'Bricolage Grotesque', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(skor, tuval.width / 2, 56);

    ctx.font = "400 11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#948cb4";
    ctx.fillText("REKOR " + rekor, tuval.width / 2, 78);

    if (hazir) {
        ctx.fillStyle = "#948cb4";
        ctx.font = "400 12px 'IBM Plex Mono', monospace";
        ctx.fillText("TIKLA VEYA BOSLUGA BAS", tuval.width / 2, tuval.height / 2 + 60);
    }

    if (oyunBitti) {
        ctx.fillStyle = "rgba(15, 12, 28, 0.82)";
        ctx.fillRect(0, 0, tuval.width, tuval.height);

        ctx.fillStyle = "#ffb627";
        ctx.font = "700 30px 'Bricolage Grotesque', sans-serif";
        ctx.fillText("Okan yine gelmedi", tuval.width / 2, tuval.height / 2 - 12);

        ctx.fillStyle = "#948cb4";
        ctx.font = "400 12px 'IBM Plex Mono', monospace";
        ctx.fillText("SKOR " + skor + "  ·  TEKRAR ICIN TIKLA", tuval.width / 2, tuval.height / 2 + 22);
    }
}

function kare(zaman) {
    if (!sonZaman) sonZaman = zaman;
    birikim += zaman - sonZaman;
    sonZaman = zaman;
    if (birikim > 200) birikim = 200;

    while (birikim >= KARE_SURESI) {
        if (!oyunBitti && !hazir) guncelle();
        birikim -= KARE_SURESI;
    }

    ciz();
    dongu = requestAnimationFrame(kare);
}
baslaButonu.addEventListener("click", function () {
    secimEkrani.classList.add("gizli");
    oyunEkrani.classList.remove("gizli");

    kusGorseli = new Image();
    kusGorseli.onload = baslat;
    kusGorseli.src = "resimler/" + secilen.dosya;
});

tuval.addEventListener("mousedown", ziplat);
tuval.addEventListener("touchstart", function (e) {
    e.preventDefault();
    ziplat();
});
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        e.preventDefault();
        ziplat();
    }
});