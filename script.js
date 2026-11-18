/* ============================================
   UNDANGAN PERNIKAHAN KATOLIK — Nadia & Raka
   ============================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ---------- 1. NAMA TAMU DARI URL ---------- */
const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get("to");
if (guest) $("#guestName").textContent = guest;

/* ---------- 2. BUKA UNDANGAN ---------- */
$("#openBtn").addEventListener("click", () => {
  const cover = $("#cover-section");
  const main = $("#main");

  cover.classList.add("open");
  document.body.classList.remove("locked");
  music.play(); // mulai musik

  setTimeout(() => {
    cover.style.display = "none";
    main.style.display = "block";
    window.scrollTo(0, 0);
  }, 900);

  // Efek bunga jatuh saat dibuka 🌸
  createPetals(35);
});

/* ---------- 3. EFEK BUNGA JATUH ---------- */
function createPetals(count = 35) {
  const container = document.createElement("div");
  container.className = "petals-container";
  document.body.appendChild(container);

  const colors = ["%23e6d3a6", "%23f4e8d0", "%23d4c093"]; // nuansa emas/ivory

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    const color = colors[i % colors.length];
    petal.style.backgroundImage =
      `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0 C70 20 70 50 50 80 C30 50 30 20 50 0" fill="${color}" opacity="0.9"/></svg>')`;
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDelay = Math.random() * 6 + "s";
    petal.style.animationDuration = (Math.random() * 6 + 6) + "s";
    petal.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
    petal.style.opacity = Math.random() * 0.4 + 0.5;
    container.appendChild(petal);
  }

  // Hentikan setelah 18 detik agar tidak berlebihan
  setTimeout(() => container.remove(), 18000);
}

/* ---------- 4. COUNTDOWN ---------- */
const targetDate = new Date("2026-12-30T09:00:00+07:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = targetDate - now;

  if (diff <= 0) {
    $("#countdown").innerHTML = "<p class='lead'>Hari Bahagia Telah Tiba! 🎉</p>";
    return;
  }

  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);

  $("#cd-d").textContent = String(d).padStart(2, "0");
  $("#cd-h").textContent = String(h).padStart(2, "0");
  $("#cd-m").textContent = String(m).padStart(2, "0");
  $("#cd-s").textContent = String(s).padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ---------- 5. MUSIK LATAR ---------- */
const music = {
  audio: new Audio("music.mp3"), // ganti dengan file lagu rohani
  playing: false,
  play() {
    this.audio.loop = true;
    this.audio.play().then(() => {
      this.playing = true;
      $("#musicBtn").classList.add("playing");
    }).catch(() => console.log("Autoplay diblokir browser."));
  },
  toggle() {
    if (this.playing) {
      this.audio.pause();
      this.playing = false;
      $("#musicBtn").classList.remove("playing");
    } else {
      this.audio.play();
      this.playing = true;
      $("#musicBtn").classList.add("playing");
    }
  }
};
$("#musicBtn").addEventListener("click", () => music.toggle());

/* ---------- 6. REVEAL ON SCROLL ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach((el) => observer.observe(el));

/* ---------- 7. SALIN NOMOR REKENING ---------- */
$$(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const number = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(number);
      showToast("✅ Nomor rekening berhasil disalin!");
    } catch {
      // Fallback untuk browser lama
      const ta = document.createElement("textarea");
      ta.value = number;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("✅ Nomor rekening berhasil disalin!");
    }
  });
});

/* ---------- 8. TOAST NOTIFIKASI ---------- */
function showToast(message, duration = 2500) {
  let toast = $(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ---------- 9. FORM RSVP ---------- */
$("#rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#rsvpName").value.trim();
  const attend = document.querySelector('input[name="att"]:checked').value;
  const guests = $("#rsvpGuests").value;
  const note = $("#rsvpNote").value.trim();

  if (!name || !guests) {
    showToast("⚠️ Mohon lengkapi nama dan jumlah orang.");
    return;
  }

  simpanKeUcapan({ name, attend, guests, note, date: new Date().toLocaleString("id-ID") });
  $("#rsvpMsg").textContent = "Terima kasih! Konfirmasi kehadiran Anda telah diterima. 🙏";
  $("#rsvpMsg").classList.add("success");
  e.target.reset();
  showToast("🙏 Terima kasih atas konfirmasinya!");
});

/* ---------- 10. UCAPAN & DOA ---------- */
const storageKey = "ucapan_nadia_raka";
const KATA_DOA = ["Tuhan memberkati", "Semoga langgeng", "Ampunilah", "Sakinah", "restu Tuhan"];

function simpanKeUcapan(data) {
  const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
  list.unshift(data);
  localStorage.setItem(storageKey, JSON.stringify(list));
  renderUcapan();
}

function renderUcapan() {
  const wrapper = $("#wishList");
  if (!wrapper) return;
  const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (list.length === 0) {
    wrapper.innerHTML = "<p class='muted center'>Belum ada ucapan. Jadilah yang pertama! ✨</p>";
    return;
  }
  wrapper.innerHTML = list.map((w) => `
    <div class="wish">
      <div class="wish__head">
        <b>${escapeHTML(w.name)}</b>
        <small>${w.date}</small>
      </div>
      <p>${escapeHTML(w.note || "Tuhan memberkati pernikahan kalian. 🙏")}</p>
      <span class="badge ${w.attend === "hadir" ? "badge--gold" : "badge--muted"}">
        ${w.attend === "hadir" ? "✔ Hadir" : "✖ Tidak Hadir"} (${w.guests} org)
      </span>
    </div>
  `).join("");
}

// Cegah XSS — wajib untuk input pengguna
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

renderUcapan();

/* ---------- 11. SAVE THE DATE (Google Calendar) ---------- */
$("#saveDate").href =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=Pernikahan+Nadia+%26+Raka" +
  "&dates=20261230T020000Z/20261230T070000Z" +
  "&details=Pemberkatan+Nikah+dan+Resepsi" +
  "&location=Gereja+Santa+Maria+Jakarta";

/* ---------- 12. QRIS MODAL (opsional) ---------- */
const qrisBtn = $("#qrisOpenBtn");
if (qrisBtn) {
  qrisBtn.addEventListener("click", () => {
    $("#qrisModal").style.display = "flex";
  });
  $(".modal__close").addEventListener("click", () => {
    $("#qrisModal").style.display = "none";
  });
  $("#qrisModal").addEventListener("click", (e) => {
    if (e.target.id === "qrisModal") e.target.style.display = "none";
  });
}
