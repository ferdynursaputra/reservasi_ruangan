let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

// Memuat daftar ruangan dari localStorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// Fungsi untuk menampilkan daftar reservasi
function displayReservations() {
    const reservationsTableBody = document.querySelector("#reservations-table tbody");
    reservationsTableBody.innerHTML = '';
    reservations.forEach((reservation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.name}</td>
            <td>${reservation.roomNumber}</td>
            <td>${reservation.date}</td>
            <td>${reservation.startTime}</td>
            <td>${reservation.duration}</td>
            <td><button onclick="cancelReservation(${index})">Batalkan</button></td>
        `;
        reservationsTableBody.appendChild(row);
    });
}

// Fungsi untuk membatalkan reservasi
function cancelReservation(index) {
    const reservation = reservations[index];
    const room = rooms.find(r => r.number === reservation.roomNumber);

    if (room) {
        room.capacity += 1;  // Mengembalikan kapasitas ruangan
        if (room.capacity > 0) {
            room.available = true; // Menandai ruangan sebagai tersedia jika kapasitas > 0
        } else {
            room.available = false; // Menandai ruangan sebagai tidak tersedia jika kapasitas = 0
        }

        // Simpan kembali data ruangan yang telah diperbarui ke localStorage
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }

    // Hapus reservasi dari daftar
    reservations.splice(index, 1);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    // Tampilkan daftar reservasi yang terbaru
    displayReservations();
    displayRooms();  // Memperbarui tampilan daftar ruangan setelah pembatalan
}

// Fungsi untuk menampilkan daftar ruangan
function displayRooms() {
    const roomsTableBody = document.querySelector("#rooms-table tbody");
    roomsTableBody.innerHTML = '';
    rooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.capacity}</td>
            <td>${room.available ? 'Tersedia' : 'Tidak Tersedia'}</td>
        `;
        roomsTableBody.appendChild(row);
    });
}

// Tampilkan daftar reservasi dan ruangan saat halaman dimuat
displayReservations();
displayRooms();
