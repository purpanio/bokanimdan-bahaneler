const bahaneler = [
            "Abim geldi",
            "Dedemlerin bahçeye gidecez",
            "Kuzenim geldi",
            "Unexpected misafir geldi ustam",
            "Yediklerimi sindiriyorum",
            "Odayı süpürdüm",
            "ÇOCUKLARLA VALO",
            "Anneyle sohbet",
            "Kuzenime Gidecez",
            "Düğündeyim-nişandayım"
        ];
        const jackpotBahane = "ÇOCUKLARLA VALO";
        const renkler = ["#6e5bd6", "#2a9d76", "#d1712c", "#c2455f", "#3f5bbf"];

        const cark = document.getElementById("cark");
        const buton = document.getElementById("btn");
        const sonuc = document.getElementById("sonuc");
        const mesaj = document.getElementById("mesaj");
        const saat = document.getElementById("saat");

        const dilimAcisi = 360 / bahaneler.length;

        const dilimler = [];
        for (let i = 0; i < bahaneler.length; i++) {
            const renk = renkler[i % renkler.length];
            dilimler.push(renk + " " + (i * dilimAcisi) + "deg " + ((i + 1) * dilimAcisi) + "deg");
        }
        cark.style.background = "conic-gradient(" + dilimler.join(", ") + ")";
        let turSayisi = 0;
        let doniyor = false;

        buton.addEventListener("click", function () {
            if (doniyor) return;
            doniyor = true;
            sonuc.textContent = "...";
            mesaj.classList.remove("jackpot");
            saat.textContent = "";

            const i = Math.floor(Math.random() * bahaneler.length);
            const dilimOrtasi = i * dilimAcisi + dilimAcisi / 2;

            turSayisi++;
            cark.style.transform = "rotate(" + (360 * 5 * turSayisi + (360 - dilimOrtasi)) + "deg)";

            setTimeout(function () {
                sonuc.textContent = bahaneler[i];
                saat.textContent = new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"});
                doniyor = false;

                if (bahaneler[i] === jackpotBahane) {
                    mesaj.classList.add("jackpot");
                    confetti({particleCount: 120, spread: 80, origin: {y: 0.6}});
                    setTimeout(function () {
                        confetti({particleCount: 70, spread: 110, origin: {x: 0.15, y: 0.6}});
                        confetti({particleCount: 70, spread: 110, origin: {x: 0.85, y: 0.6}});
                    }, 250);
                }
            }, 4000);
        });