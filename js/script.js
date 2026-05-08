// === LOGIN ===
function login() {
  let email = document.getElementById("email")?.value.trim();
  let password = document.getElementById("password")?.value.trim();

  if(!email || !password){
    alert("Harap isi data terlebih dahulu");
    return;
  }

  let user = dataPengguna.find(u => u.email === email && u.password === password);

  if(user){
    localStorage.setItem("userLogin", JSON.stringify(user));
    alert("Login berhasil!");
    window.location.href = "dashboard.html";
  } else {
    alert("Email/password salah!");
  }
}

// === LOGOUT ====
function logout(){
  localStorage.removeItem("userLogin");
  alert("Logout berhasil!");
  window.location.href = "index.html";
}

// === ON LOAD ===
document.addEventListener("DOMContentLoaded", function(){

  // GREETING/SAPAAN
  let greet = document.getElementById("greeting");

  if(greet){
    let jam = new Date().getHours();
    let sapaan = "Selamat Datang";

    if(jam < 12) sapaan = "Selamat Pagi";
    else if(jam < 15) sapaan = "Selamat Siang";
    else if(jam < 18) sapaan = "Selamat Sore";
    else sapaan = "Selamat Malam";

    let user = JSON.parse(localStorage.getItem("userLogin"));
    greet.innerText = user ? `${sapaan}, ${user.nama}` : sapaan;
  }

  loadBuku();
  loadAllTracking();
});

// === GRID BUKU ===
function loadBuku(){
  let container = document.getElementById("listBuku");
  if(!container) return;

  container.innerHTML = "";

  dataBahanAjar.forEach(item => {
    let card = `
      <div class="card-buku">
        <img src="${item.cover}" alt="cover">
        
        <div class="info">
          <h4>${item.namaBarang}</h4>
          <p>Kode: ${item.kodeBarang}</p>
          <p>Stok: ${item.stok}</p>
          <p>Lokasi: ${item.kodeLokasi || item.lokasi || "-"}</p>
          <p>Jenis: ${item.jenisBarang || item.jenis || "-"}</p>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
}

// === TAMBAH DATA ===
function tambahData(){
  let kode = document.getElementById("kode")?.value.trim();
  let nama = document.getElementById("nama")?.value.trim();
  let stok = document.getElementById("stok")?.value.trim();
  let lokasi = document.getElementById("lokasi")?.value.trim();
  let jenis = document.getElementById("jenis")?.value.trim();
  let fileInput = document.getElementById("coverFile");
  let file = fileInput?.files[0];

  if(!kode || !nama || !stok){
    alert("Isi data terlebih dahulu");
    return;
  }

  function saveData(coverURL){
    let newData = {
      kodeBarang: kode,
      namaBarang: nama,
      stok: stok,
      kodeLokasi: lokasi || "-",
      jenisBarang: jenis || "-",
      cover: coverURL
    };

    dataBahanAjar.push(newData);
    loadBuku();

    document.getElementById("kode").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("stok").value = "";
    if(document.getElementById("lokasi")) document.getElementById("lokasi").value = "";
    if(document.getElementById("jenis")) document.getElementById("jenis").value = "";
    if(fileInput) fileInput.value = "";
  }

  if(file){
    let reader = new FileReader();

    reader.onload = function(e){
      saveData(e.target.result);
    };

    reader.readAsDataURL(file);
  } else {

// === DEFAULT COVER ===
    let listCover = [
      "assets/pengantar_komunikasi.jpg",
      "assets/manajemen_keuangan.jpg",
      "assets/kepemimpinan.jpg",
      "assets/mikrobiologi.jpg",
      "assets/paud_perkembangan.jpeg"
    ];

    let randomCover = listCover[Math.floor(Math.random() * listCover.length)];
    saveData(randomCover);
  }
}

// === TRACKING DETAIL ===
function cekTracking(){
  let resi = document.getElementById("resi")?.value.trim();
  let hasil = document.getElementById("hasil");

  if(!resi) return;

  let data = dataTracking[resi];

  if(!data){
    hasil.innerHTML = `<p style="color:red;">Data tidak ditemukan</p>`;
    return;
  }

// === PROGRESS BAR ===
let progress = 30;

let lastPerjalanan = data.perjalanan[data.perjalanan.length - 1].keterangan.toLowerCase();

if(lastPerjalanan.includes("proses") || lastPerjalanan.includes("antar")) {
  progress = 70;
}

if(
  lastPerjalanan.includes("selesai") ||
  lastPerjalanan.includes("diterima") ||
  lastPerjalanan.includes("penerima")
){
  progress = 100;
}

// === DATA PERJALANAN ===
  let perjalananHTML = data.perjalanan.map(p => `
    <div class="timeline-item">
      <div class="dot"></div>
      <div>
        <small>${p.waktu}</small>
        <p>${p.keterangan}</p>
      </div>
    </div>
  `).join("");

  hasil.innerHTML = `
    <div class="card">
      <h3>${data.nama}</h3>
      <p><b>Status:</b> ${data.status}</p>
      <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
      <p><b>Tanggal:</b> ${data.tanggalKirim}</p>
      <p><b>Total:</b> ${data.total}</p>

      <div class="progress">
        <div class="progress-bar" style="width:${progress}%"></div>
      </div>

      <h4>Riwayat Perjalanan</h4>
      <div class="timeline">
        ${perjalananHTML}
      </div>
    </div>
  `;
}

// === TRACKING LIST ===
function loadAllTracking(){
  let container = document.getElementById("listTracking");
  if(!container) return;

  container.innerHTML = "";

  for(let key in dataTracking){
    let item = dataTracking[key];

    container.innerHTML += `
      <div class="tracking-card">
        <h4>${item.nama}</h4>
        <p><b>No DO:</b> ${item.nomorDO}</p>
        <p><b>Status:</b> ${item.status}</p>
        <p><b>Ekspedisi:</b> ${item.ekspedisi}</p>
        <p><b>Total:</b> ${item.total}</p>
      </div>
    `;
  }
}