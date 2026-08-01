// Her karakterin "oyun" alani, o karaktere tiklayinca acilacak oyunun adi.
// Bu ad, oyun dosyasinin window.oyunlar icine kaydettigi isimle ayni olmali.
// "oyun" alani olmayan karakterler "yakinda" olarak, tiklanamaz gorunur.
const karakterler = [
  { ad: "Oki", dosya: "oki.png", oyun: "tepki", yildiz: true },
  { ad: "Burki", dosya: "burki.png", oyun: "flappy" },
  { ad: "Çaço", dosya: "caco.png" },
  { ad: "Gaptan", dosya: "gaptan.png" },
  { ad: "Memedim", dosya: "memedim.png" },
  { ad: "Osmi", dosya: "osmi.png" },
  { ad: "Yaso", dosya: "yaso.png" }
];

const yildizAlani = document.getElementById("yildiz");
const digerAlani = document.getElementById("digerleri");
const baslaButonu = document.getElementById("basla");
const menuyeButonu = document.getElementById("menuye");
const secimEkrani = document.getElementById("secim-ekrani");
const oyunEkrani = document.getElementById("oyun-ekrani");
const oyunAdi = document.getElementById("oyun-adi");
const oyunAciklama = document.getElementById("oyun-aciklama");
const tuval = document.getElementById("tuval");

let secilen = null;
let aktifOyun = null;

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

  const oyun = k.oyun ? window.oyunlar[k.oyun] : null;

  if (!oyun) {
    // Oyunu olmayan veya dosyasi yuklenmemis karakter: pasif kart
    kart.classList.add("yakinda");
    kart.disabled = true;
    etiket.textContent = k.ad + " · yakında";
  } else {
    kart.addEventListener("click", function () {
      document.querySelectorAll(".karakter").forEach(function (d) {
        d.classList.remove("secili");
      });
      kart.classList.add("secili");

      secilen = k;
      baslaButonu.disabled = false;
      baslaButonu.textContent = oyun.ad;
    });
  }

  if (k.yildiz) {
    yildizAlani.appendChild(kart);
  } else {
    digerAlani.appendChild(kart);
  }
});

baslaButonu.addEventListener("click", function () {
  const oyun = window.oyunlar[secilen.oyun];
  if (!oyun) return;

  aktifOyun = oyun;
  oyunAdi.textContent = oyun.ad;
  oyunAciklama.textContent = oyun.aciklama;

  secimEkrani.classList.add("gizli");
  oyunEkrani.classList.remove("gizli");

  // Menu oyunun icinde ne oldugunu bilmiyor, sadece sozlesmeyi cagiriyor
  oyun.baslat(tuval, secilen);
});

menuyeButonu.addEventListener("click", function () {
  if (aktifOyun) aktifOyun.durdur();
  aktifOyun = null;

  tuval.getContext("2d").clearRect(0, 0, tuval.width, tuval.height);

  oyunEkrani.classList.add("gizli");
  secimEkrani.classList.remove("gizli");
});
