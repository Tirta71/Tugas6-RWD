document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("pegawai-form");
  const tableBody = document.getElementById("pegawai-data");
  const table = $("#pegawai-table").DataTable();
  let totalGaji = 0;

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

    table.row
      .add([
        nama,
        jabatan,
        status,
        formatCurrency(gajiPokok),
        formatCurrency(tunjanganJabatan),
        formatCurrency(bpjs),
        formatCurrency(tunjanganKeluarga),
        formatCurrency(total),
        `<button class="hapus-pegawai btn btn-danger" data-nama="${nama}">Hapus</button>`,
      ])
      .draw();

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
      const totalRow = parseFloat(
        row.cells[7].textContent.replace(/[^\d.-]/g, "")
      );

      totalGaji -= totalRow;
      updateTotalGaji();

      table.row(row).remove().draw();

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
