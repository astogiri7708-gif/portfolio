/* =========================================================
   PORTOFOLIO - Integrasi Firebase (Firestore)
   ========================================================= */

// ---------- Efek mengetik ----------
const words = ["Junior Leader", "Web Developer", "Lifelong Learner"];
const typingEl = document.querySelector(".typing");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = words[wordIndex];
  let speed = 150;

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      speed = 1400;
    } else {
      charIndex++;
    }
  } else {
    typingEl.textContent = current.substring(0, Math.max(charIndex - 1, 0));
    charIndex--;
    speed = 60;
    if (charIndex <= 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }
  }

  setTimeout(type, speed);
}

if (typingEl) {
  type();
}

// ---------- Smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      document.getElementById("navLinks").classList.remove("active");
    }
  });
});

// ---------- Menu mobile ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ---------- Firebase ----------
let db = null;
const dbStatus = document.getElementById("dbStatus");

function setStatus(msg, isError) {
  if (!dbStatus) return;
  dbStatus.textContent = msg;
  dbStatus.style.color = isError ? "#dc2626" : "#888";
}

function initFirebase() {
  try {
    const cfg = window.firebaseConfig;
    if (!cfg || !cfg.apiKey || cfg.apiKey.startsWith("ISI_DENGAN")) {
      setStatus("Mode offline: menampilkan data contoh. (Firebase belum dikonfigurasi)", false);
      return null;
    }
    if (!window.firebase) {
      setStatus("Gagal memuat SDK Firebase.", true);
      return null;
    }
    firebase.initializeApp(cfg);
    return firebase.firestore();
  } catch (err) {
    console.error("Firebase init error:", err);
    setStatus("Firebase init gagal: " + err.message, true);
    return null;
  }
}

db = initFirebase();

// ---------- Data fallback (dipakai jika Firebase belum aktif) ----------
const fallbackProfile = {
  name: "Astogiri",
  bio: "Saya seorang junior leader yang siap belajar dan mengembangkan diri. Selamat datang di portofolio pribadi saya.",
  about:
    "Saya adalah junior leader yang bersemangat untuk terus belajar dan mengasah kemampuan. Saya menyukai proses membangun sesuatu dari ide menjadi kenyataan. Di sini saya menampilkan beberapa proyek yang pernah saya kerjakan. Jangan ragu untuk menghubungi saya jika ingin bekerja sama.",
  biodata: {
    "Nama Lengkap": "Muhammad Salim Astogiri",
    "Tempat, Tanggal Lahir": "Sidoarjo, 20 November 2001",
    "Jenis Kelamin": "Laki-laki",
    Email: "astogiri7708@gmail.com",
    "Pekerjaan": "Junior Leader / Web Developer",
    "Kewarganegaraan": "Indonesia",
  },
  skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git"],
};

const fallbackProjects = [
  {
    title: "Website Toko Online",
    description: "Website e-commerce sederhana dengan keranjang belanja.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#",
  },
  {
    title: "Aplikasi Todo List",
    description: "Aplikasi pencatat tugas harian dengan penyimpanan lokal.",
    tags: ["JavaScript"],
    link: "#",
  },
  {
    title: "Landing Page Produk",
    description: "Halaman promosi produk yang responsif dan modern.",
    tags: ["HTML", "CSS"],
    link: "#",
  },
];

// ---------- Render data ke halaman ----------
function renderProfile(p) {
  if (p.name) {
    document.getElementById("profileName").textContent = p.name;
    document.getElementById("profileAvatar").textContent = p.name.charAt(0).toUpperCase();
    document.title = "Portofolio - " + p.name;
  }
  if (p.bio) document.getElementById("profileBio").textContent = p.bio;
  if (p.about) document.getElementById("aboutText").textContent = p.about;

  if (p.biodata) {
    const box = document.getElementById("biodataBox");
    box.innerHTML = "";
    Object.entries(p.biodata).forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "biodata-item";
      row.innerHTML = `<span></span><strong></strong>`;
      row.querySelector("span").textContent = label;
      row.querySelector("strong").textContent = ": " + value;
      box.appendChild(row);
    });
  }

  if (Array.isArray(p.skills) && p.skills.length) {
    const grid = document.getElementById("skillsGrid");
    grid.innerHTML = "";
    p.skills.forEach((s) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.textContent = s;
      grid.appendChild(card);
    });
  }
}

function renderProjects(list) {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";
  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const thumb = document.createElement("div");
    thumb.className = "project-thumb";
    if (p.image) {
      thumb.style.backgroundImage = `url("${p.image}")`;
    } else {
      thumb.textContent = p.title || "PROYEK";
    }

    const h3 = document.createElement("h3");
    h3.textContent = p.title || "Tanpa Judul";

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    const tags = document.createElement("div");
    tags.className = "tags";
    (p.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      tags.appendChild(span);
    });

    card.appendChild(thumb);
    card.appendChild(h3);
    card.appendChild(desc);
    card.appendChild(tags);

    if (p.link && p.link !== "#") {
      const a = document.createElement("a");
      a.href = p.link;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Lihat Proyek";
      card.appendChild(a);
    }

    grid.appendChild(card);
  });
}

// ---------- Jalankan render fallback bila Firebase tidak aktif ----------
if (!db) {
  renderProfile(fallbackProfile);
  renderProjects(fallbackProjects);
}

// ---------- Muat data profil ----------
async function loadProfile() {
  if (!db) return;
  try {
    const snap = await db.collection("profile").doc("main").get();
    if (!snap.exists) {
      renderProfile(fallbackProfile);
      return;
    }
    const p = snap.data();
    renderProfile(p);
  } catch (err) {
    console.error("loadProfile error:", err);
  }
}

// ---------- Muat proyek ----------
async function loadProjects() {
  if (!db) return;
  try {
    const snap = await db.collection("projects").orderBy("createdAt", "desc").get();
    if (snap.empty) {
      renderProjects(fallbackProjects);
      setStatus("Data proyek kosong, menampilkan data contoh.", false);
      return;
    }

    const list = [];
    snap.forEach((doc) => {
      const p = doc.data();
      list.push({
        title: p.title,
        description: p.description,
        tags: p.tags,
        link: p.link,
        image: p.image,
      });
    });

    renderProjects(list);
    setStatus("✓ Data proyek dimuat dari Firebase");
  } catch (err) {
    console.error("loadProjects error:", err);
    renderProjects(fallbackProjects);
    setStatus("Gagal memuat proyek: " + err.message, true);
  }
}

// ---------- Form kontak ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!db) {
      formStatus.textContent = "Firebase belum aktif, pesan tidak terkirim.";
      formStatus.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      await db.collection("messages").add({
        name: document.getElementById("cName").value.trim(),
        email: document.getElementById("cEmail").value.trim(),
        message: document.getElementById("cMessage").value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      contactForm.reset();
      formStatus.textContent = "✓ Pesan berhasil dikirim. Terima kasih!";
      formStatus.className = "form-status success";
    } catch (err) {
      console.error("Submit error:", err);
      formStatus.textContent = "Gagal mengirim: " + err.message;
      formStatus.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Pesan";
    }
  });
}

// ---------- Jalankan ----------
loadProfile();
loadProjects();
