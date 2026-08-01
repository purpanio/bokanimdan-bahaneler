(function () {

  const REKOR_ANAHTARI = "rekor-tepki";
  const EN_AZ_BEKLEME = 1200;
  const EN_COK_BEKLEME = 4200;

  let tuval, ctx, gorsel;
  let durum, baslangic, sonuc, rekor, zamanlayici;

  // --- Sozlesme ---

  function baslat(t, secilen) {
    tuval = t;
    ctx = tuval.getContext("2d");
    rekor = Number(localStorage.getItem(REKOR_ANAHTARI) || 0);
    durum = "bekle";
    sonuc = 0;

    gorsel = new Image();
    gorsel.onload = ciz;
    gorsel.src = "resimler/" + secilen.dosya;

    tuval.addEventListener("mousedown", tikla);
    tuval.addEventListener("touchstart", dokunma);
    document.addEventListener("keydown", tusa);

    ciz();
  }

  function durdur() {
    clearTimeout(zamanlayici);
    tuval.removeEventListener("mousedown", tikla);
    tuval.removeEventListener("touchstart", dokunma);
    document.removeEventListener("keydown", tusa);
  }

  // --- Girdi ---

  function dokunma(e) {
    e.preventDefault();
    tikla();
  }

  function tusa(e) {
    if (e.code === "Space") {
      e.preventDefault();
      tikla();
    }
  }

  // Tek bir tiklama, o anki duruma gore farkli is yapiyor
  function tikla() {
    if (durum === "hazirlaniyor") {
      clearTimeout(zamanlayici);
      durum = "erken";
      ciz();
      return;
    }

    if (durum === "aktif") {
      sonuc = Math.round(performance.now() - baslangic);
      // Burada kucuk olan iyi, o yuzden karsilastirma ters
      if (!rekor || sonuc < rekor) {
        rekor = sonuc;
        localStorage.setItem(REKOR_ANAHTARI, rekor);
      }
      durum = "sonuc";
      ciz();
      return;
    }

    // bekle / sonuc / erken durumlarindan yeni tur baslar
    durum = "hazirlaniyor";
    ciz();

    const gecikme = EN_AZ_BEKLEME + Math.random() * (EN_COK_BEKLEME - EN_AZ_BEKLEME);
    zamanlayici = setTimeout(function () {
      durum = "aktif";
      baslangic = performance.now();
      ciz();
    }, gecikme);
  }

  // --- Cizim: dongu yok, sadece durum degisince cagriliyor ---

  function ciz() {
    const orta = tuval.width / 2;
    const aktif = durum === "aktif";

    if (aktif) ctx.fillStyle = "#2a9d76";
    else if (durum === "hazirlaniyor") ctx.fillStyle = "#3a2036";
    else ctx.fillStyle = "#0f0c1c";
    ctx.fillRect(0, 0, tuval.width, tuval.height);

    if (gorsel && gorsel.complete) {
      const r = 46;
      ctx.save();
      ctx.beginPath();
      ctx.arc(orta, 150, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(gorsel, orta - r, 150 - r, r * 2, r * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(orta, 150, r, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = aktif ? "#0f0c1c" : "#ffb627";
      ctx.stroke();
    }

    let baslik = "";
    let altYazi = "";
    let ipucu = "";

    if (durum === "bekle") {
      baslik = "Hazır mısın";
      altYazi = "TIKLA VE BEKLE";
    } else if (durum === "hazirlaniyor") {
      baslik = "Bekle...";
      altYazi = "YESIL OLUNCA TIKLA";
    } else if (aktif) {
      baslik = "TIKLA";
    } else if (durum === "erken") {
      baslik = "Acele ettin";
      altYazi = "TEKRAR ICIN TIKLA";
    } else {
      baslik = sonuc + " ms";
      altYazi = yorum(sonuc);
      ipucu = "TEKRAR ICIN TIKLA";
    }

    ctx.textAlign = "center";

    ctx.fillStyle = aktif ? "#0f0c1c" : "#ffb627";
    ctx.font = "700 34px 'Bricolage Grotesque', sans-serif";
    ctx.fillText(baslik, orta, 300);

    if (altYazi) {
      ctx.fillStyle = aktif ? "#0f0c1c" : "#948cb4";
      ctx.font = "400 12px 'IBM Plex Mono', monospace";
      ctx.fillText(altYazi, orta, 336);
    }
    if (ipucu) {
      ctx.fillStyle = "#5f5880";
      ctx.font = "400 11px 'IBM Plex Mono', monospace";
      ctx.fillText(ipucu, orta, 360);
    }
    if (rekor && !aktif) {
      ctx.fillStyle = "#948cb4";
      ctx.font = "400 11px 'IBM Plex Mono', monospace";
      ctx.fillText("EN IYI " + rekor + " MS", orta, 470);
    }
  }

  function yorum(ms) {
    if (ms < 110) return "BRAAAVO OOOOLMMM";
    if (ms < 140) return "MAKARA MI?";
    if (ms < 200) return "GRUP ORTALAMASI";
    if (ms < 250) return "YAŞLANDIN KRAL";
    if (ms < 300) return "UYKULU MUSUN";
    if (ms < 420) return "OKAN SEVIYESI";
    if (ms < 550) return "ABIN GELDI GALIBA";
    return "KUZENIN Mi GELDI";
  }

  // --- Kayit ---

  window.oyunlar = window.oyunlar || {};
  window.oyunlar.tepki = {
    ad: "Okan Ne Zaman Gelir",
    aciklama: "Yeşil olunca tıkla, erken basma",
    baslat: baslat,
    durdur: durdur
  };

})();
