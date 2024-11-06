    // Kelas Room untuk mendefinisikan properti ruangan dan logika reservasi
    class Room {
        constructor(number, capacity, available = true) {
            this.number = number;
            this.capacity = capacity;
            this.available = available;
        }

        // Mengurangi kapasitas ruangan dan mengupdate ketersediaan
        reserveRoom() {
            if (this.capacity > 0) {
                this.capacity -= 1;
                if (this.capacity === 0) {
                    this.available = false;
                }
            }
        }

        // Mengembalikan kapasitas ruangan dan mengupdate ketersediaan
        cancelReservation() {
            this.capacity += 1;
            if (this.capacity > 0) {
                this.available = true;
            }
        }
    }

    // Kelas Reservation untuk menyimpan detail pemesanan
    class Reservation {
        constructor(name, roomNumber, date, startTime, duration) {
            this.name = name;
            this.roomNumber = roomNumber;
            this.date = date;
            this.startTime = startTime;
            this.duration = duration;
        }
    }

    // Fungsi untuk menyimpan daftar ruangan ke dalam localStorage
    function saveRoomsToLocalStorage() {
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }

    // Fungsi untuk memuat daftar ruangan dari localStorage saat halaman dimuat
    function loadRoomsFromLocalStorage() {
        const storedRooms = localStorage.getItem("rooms");
        if (storedRooms) {
            const parsedRooms = JSON.parse(storedRooms);
            rooms.length = 0; // Kosongkan array rooms
            parsedRooms.forEach(room => {
                rooms.push(new Room(room.number, room.capacity, room.available));
            });
        }
    }

    // Inisialisasi daftar ruangan
    let rooms = [
        new Room('101', 1),
        new Room('102', 1),
        new Room('103', 1)
    ];

    // Muat daftar ruangan dari localStorage jika tersedia
    loadRoomsFromLocalStorage();

    // Inisialisasi daftar reservasi dari localStorage jika tersedia
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    // Fungsi untuk menampilkan daftar ruangan di halaman
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

    // Fungsi untuk menambahkan reservasi baru
    function addReservation(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const roomNumber = document.getElementById("room-number").value;
        const date = document.getElementById("date").value;
        const startTime = document.getElementById("start-time").value;
        const duration = parseInt(document.getElementById("duration").value);
        const errorMessage = document.getElementById("error-message");

        const room = rooms.find(r => r.number === roomNumber);

        if (!room) {
            errorMessage.textContent = 'Ruangan tidak ditemukan.';
            return;
        }

        if (!room.available) {
            errorMessage.textContent = 'Ruangan tidak tersedia.';
            return;
        }

        if (isRoomAvailable(roomNumber, date, startTime, duration)) {
            const reservation = new Reservation(name, roomNumber, date, startTime, duration);
            reservations.push(reservation);
            room.reserveRoom(); // Kurangi kapasitas ruangan
            saveRoomsToLocalStorage(); // Simpan data terbaru ke localStorage
            localStorage.setItem("reservations", JSON.stringify(reservations)); // Simpan reservasi ke localStorage
            displayRooms(); // Perbarui tampilan daftar ruangan
            errorMessage.textContent = '';
            alert("Reservasi berhasil!");
        } else {
            errorMessage.textContent = 'Ruangan sudah dipesan di waktu tersebut.';
        }
        document.getElementById("form").reset();
    }

    // Fungsi untuk mengecek ketersediaan ruangan di waktu tertentu
    function isRoomAvailable(roomNumber, date, startTime, duration) {
        for (let reservation of reservations) {
            if (
                reservation.roomNumber === roomNumber &&
                reservation.date === date &&
                reservation.startTime === startTime
            ) {
                return false;
            }
        }
        return true;
    }

    // Fungsi untuk membatalkan reservasi
    function cancelReservation(roomNumber, date, startTime) {
        // Temukan reservasi yang sesuai
        const reservationIndex = reservations.findIndex(reservation => 
            reservation.roomNumber === roomNumber &&
            reservation.date === date &&
            reservation.startTime === startTime
        );

        if (reservationIndex > -1) {
            // Hapus reservasi dari daftar
            const reservation = reservations[reservationIndex];
            reservations.splice(reservationIndex, 1);
            
            // Temukan ruangan yang sesuai dan pulihkan kapasitasnya
            const room = rooms.find(r => r.number === reservation.roomNumber);
            if (room) {
                room.cancelReservation();
                saveRoomsToLocalStorage(); // Simpan data terbaru ke localStorage
                localStorage.setItem("reservations", JSON.stringify(reservations)); // Simpan reservasi terbaru ke localStorage
                displayRooms(); // Perbarui tampilan daftar ruangan
            }
        }
    }

    // Event listener untuk form submit
    document.getElementById("form").addEventListener("submit", addReservation);

    // Tampilkan daftar ruangan saat halaman dimuat
    displayRooms();
