const formBarang = document.getElementById('form-barang');
const inputKode = document.getElementById('kode-barang');
const inputNama = document.getElementById('nama-barang');
const inputHarga = document.getElementById('harga-barang');
const inputCari = document.getElementById('search-barang');
const btnCari = document.getElementById('btn-cari');
const dataBarangTbody = document.getElementById('data-barang');

document.addEventListener('DOMContentLoaded', tampilkanData);

formBarang.addEventListener('submit', function(event) {
  event.preventDefault();

  const kode = inputKode.value.trim();
  const nama = inputNama.value.trim();
  const harga = parseFloat(inputHarga.value);

  if (kode === '' || nama === '' || isNaN(harga)) {
    alert('Harap isi semua kolom dengan benar!');
    return;
  }

  const barangBaru = { kode, nama, harga };

  simpanKeLocalStorage(barangBaru);

  tampilkanData();

  formBarang.reset();
  inputKode.focus();
});

btnCari.addEventListener('click', function() {
  tampilkanData();
});

inputCari.addEventListener('input', function() {
  tampilkanData();
});

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
}

function ambilLocalStorage() {
  const data = localStorage.getItem('daftarBarang');
  return data ? JSON.parse(data) : [];
}

function simpanKeLocalStorage(barang) {
  const daftarBarang = ambilLocalStorage();
  daftarBarang.push(barang);
  localStorage.setItem('daftarBarang', JSON.stringify(daftarBarang));
}

function tampilkanData() {
  const daftarBarang = ambilLocalStorage();
  const kataCari = inputCari.value.trim().toLowerCase();
  const daftarFilter = kataCari === ''
    ? daftarBarang
    : daftarBarang.filter((barang) => {
        const kode = (barang.kode || '').toLowerCase();
        const nama = (barang.nama || '').toLowerCase();
        return kode.includes(kataCari) || nama.includes(kataCari);
      });

  dataBarangTbody.innerHTML = '';

  if (daftarFilter.length === 0) {
    dataBarangTbody.innerHTML = '<tr><td colspan="5" class="empty-state">Data barang tidak ditemukan.</td></tr>';
    return;
  }

  daftarFilter.forEach((barang, index) => {
    const originalIndex = daftarBarang.findIndex(item =>
      item.kode === barang.kode && item.nama === barang.nama && item.harga === barang.harga
    );

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="badge-kode">${barang.kode}</span></td>
      <td>${barang.nama}</td>
      <td>${formatRupiah(barang.harga)}</td>
      <td><button class="btn-hapus" onclick="hapusBarang(${originalIndex})">Hapus</button></td>
    `;
    dataBarangTbody.appendChild(tr);
  });
}

function hapusBarang(index) {
  const daftarBarang = ambilLocalStorage();
  const namaItem = daftarBarang[index].nama;

  if (confirm(`Apakah Anda yakin ingin menghapus "${namaItem}"?`)) {
    daftarBarang.splice(index, 1);
    localStorage.setItem('daftarBarang', JSON.stringify(daftarBarang));
    tampilkanData();
  }
}
