document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("pegawai-form");
  const tableBody = document.getElementById("pegawai-data");
  const table = $("#pegawai-table").DataTable();
  let totalGaji = 0;
  let pegawaiData = [];

  // Mengambil data dari localStorage jika ada
  if (localStorage.getItem("pegawaiData")) {
    pegawaiData = JSON.parse(localStorage.getItem("pegawaiData"));
    // Menambahkan data pegawai ke dalam tabel
    pegawaiData.forEach(function (data) {
      table.row.add(data).draw();
      // Mengupdate total gaji dengan data yang sudah disimpan
      totalGaji += parseFloat(
        data[7].replace(/[^\d.,]/g, "").replace(",", ".")
      );
    });
  }

  // Mengambil totalGaji dari localStorage jika ada
  if (localStorage.getItem("totalGaji")) {
    totalGaji = parseFloat(localStorage.getItem("totalGaji"));
  }

  // Menampilkan total gaji yang disimpan di localStorage
  const totalGajiElement = document.getElementById("total-gaji-amount");
  totalGajiElement.textContent = formatCurrency(totalGaji);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = form.nama.value;
    const jabatan = form.jabatan.value;
    const status = form.status.value;

    const gajiPokok = calculateGajiPokok(jabatan);
    const tunjanganJabatan = gajiPokok * 0.15;
    const bpjs = gajiPokok * 0.1;
    const tunjanganKeluarga = status === "menikah" ? gajiPokok * 0.2 : 0;
    const total = gajiPokok + tunjanganJabatan + bpjs + tunjanganKeluarga;

    const newRow = [
      nama,
      jabatan,
      status,
      formatCurrency(gajiPokok),
      formatCurrency(tunjanganJabatan),
      formatCurrency(bpjs),
      formatCurrency(tunjanganKeluarga),
      formatCurrency(total),
      `<button class="hapus-pegawai btn btn-danger" data-nama="${nama}">Hapus</button>`,
    ];

    // Menambahkan baris ke dalam tabel
    table.row.add(newRow).draw();

    // Menambahkan data pegawai ke dalam array
    pegawaiData.push(newRow);

    // Menyimpan data pegawai ke dalam localStorage
    localStorage.setItem("pegawaiData", JSON.stringify(pegawaiData));

    // Mengupdate total gaji
    totalGaji += total;
    updateTotalGaji();

    form.reset();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Data pegawai berhasil ditambahkan!",
    });
  });

  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("hapus-pegawai")) {
      const nama = event.target.dataset.nama;
      const row = event.target.parentElement.parentElement;

      const totalRowText = row.cells[7].textContent;
      const cleanedTotal = totalRowText.replace(/[^\d.,]/g, "");
      const totalRow = parseFloat(
        cleanedTotal.replace(/\./g, "").replace(",", ".")
      );

      // Mengupdate total gaji
      totalGaji -= totalRow;
      updateTotalGaji();

      // Menghapus baris dari tabel
      table.row(row).remove().draw();

      // Menghapus data pegawai dari array
      const rowIndex = table.row(row).index();
      pegawaiData.splice(rowIndex, 1);

      // Menyimpan data pegawai ke dalam localStorage setelah data dihapus
      localStorage.setItem("pegawaiData", JSON.stringify(pegawaiData));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Data pegawai ${nama} berhasil dihapus!`,
      });
    }
  });

  function updateTotalGaji() {
    const totalGajiElement = document.getElementById("total-gaji-amount");
    totalGajiElement.textContent = formatCurrency(totalGaji);
    // Simpan total gaji ke localStorage setiap kali diperbarui
    localStorage.setItem("totalGaji", totalGaji);
  }

  function calculateGajiPokok(jabatan) {
    switch (jabatan) {
      case "Manager":
        return 15000000;
      case "Asisten Manager":
        return 10000000;
      case "Staff":
        return 5000000;
      default:
        return 0;
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }
});
