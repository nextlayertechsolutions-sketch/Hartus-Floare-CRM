document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");
    const bookingTable = document.getElementById("bookingTable");

    const searchBooking = document.getElementById("searchBooking");
    const projectFilter = document.getElementById("projectFilter");
    const statusFilter = document.getElementById("statusFilter");

    let bookings = [];
    let editingBookingId = null;

    function normalizeBooking(rawBooking = {}, index = 0) {
        return {
            id: rawBooking.id || `booking-${Date.now()}-${index + 1}-${Math.random().toString(16).slice(2)}`,
            clientName: rawBooking.clientName || rawBooking.client || "",
            mobile: rawBooking.mobile || "",
            cnic: rawBooking.cnic || "",
            project: rawBooking.project || "",
            sector: rawBooking.sector || "",
            plot: rawBooking.plot || "",
            status: rawBooking.status || "Booked"
        };
    }

    function loadBookingsFromStorage() {
        try {
            const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
            if (!Array.isArray(stored)) {
                return [];
            }

            const normalized = stored.map((booking, index) => normalizeBooking(booking, index));
            if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
                localStorage.setItem("bookings", JSON.stringify(normalized));
            }

            return normalized;
        } catch (error) {
            console.error("Failed to load bookings:", error);
            return [];
        }
    }

    bookings = loadBookingsFromStorage();

    // ===========================
    // Load Bookings
    // ===========================

    function loadBookings(list = bookings) {

        bookingTable.innerHTML = "";

        list.forEach((booking, index) => {

            bookingTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${booking.clientName}</td>
                <td>${booking.mobile}</td>
                <td>${booking.project}</td>
                <td>${booking.sector}</td>
                <td>${booking.plot}</td>
                <td>${booking.status}</td>
                <td>
                    <button class="edit-btn" onclick="editBooking('${booking.id}')">
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteBooking('${booking.id}')">
                        Delete
                    </button>
                </td>
            </tr>
            `;

        });

    }

    // ===========================
    // Save Booking
    // ===========================

    bookingForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const booking = normalizeBooking({
            id: editingBookingId || null,
            clientName: document.getElementById("client").value,
            mobile: document.getElementById("mobile").value,
            cnic: document.getElementById("cnic").value,
            project: document.getElementById("project").value,
            sector: document.getElementById("sector").value,
            plot: document.getElementById("plot").value,
            status: document.getElementById("bookingStatus").value
        }, bookings.length);

        if (editingBookingId) {
            bookings = bookings.map(b => b.id === editingBookingId ? booking : b);
            alert("Booking Updated Successfully");
        } else {
            bookings.push(booking);
            alert("Booking Saved Successfully");
        }

        localStorage.setItem("bookings", JSON.stringify(bookings));

        bookingForm.reset();
        editingBookingId = null;

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Booking';
        }

        const heading = bookingForm.querySelector('h3');
        if (heading) {
            heading.textContent = 'New Booking';
        }

        loadBookings();

    });

    // ===========================
    // Delete Booking
    // ===========================

    window.editBooking = function (bookingId) {

        const bookingToEdit = bookings.find(b => b.id === bookingId);

        if (!bookingToEdit) return;

        editingBookingId = bookingId;

        document.getElementById("client").value = bookingToEdit.clientName || "";
        document.getElementById("mobile").value = bookingToEdit.mobile || "";
        document.getElementById("cnic").value = bookingToEdit.cnic || "";
        document.getElementById("project").value = bookingToEdit.project || "";
        document.getElementById("sector").value = bookingToEdit.sector || "";
        document.getElementById("plot").value = bookingToEdit.plot || "";
        document.getElementById("bookingStatus").value = bookingToEdit.status || "Booked";

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Booking';
        }

        const heading = bookingForm.querySelector('h3');
        if (heading) {
            heading.textContent = 'Edit Booking';
        }

        document.getElementById("client").focus();

    };

    window.deleteBooking = function (bookingId) {

        if (confirm("Delete this booking?")) {

            bookings = bookings.filter(b => b.id !== bookingId);

            localStorage.setItem("bookings", JSON.stringify(bookings));

            loadBookings();

        }

    };

    // ===========================
    // Search Booking
    // ===========================

    searchBooking.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        const filtered = bookings.filter(booking =>
            booking.clientName.toLowerCase().includes(keyword) ||
            booking.mobile.toLowerCase().includes(keyword) ||
            booking.project.toLowerCase().includes(keyword) ||
            booking.sector.toLowerCase().includes(keyword) ||
            booking.plot.toLowerCase().includes(keyword)
        );

        loadBookings(filtered);

    });

    // ===========================
    // Project Filter
    // ===========================

    projectFilter.addEventListener("change", function () {

        let filtered = bookings;

        if (this.value !== "") {

            filtered = filtered.filter(booking => booking.project === this.value);

        }

        loadBookings(filtered);

    });

    // ===========================
    // Status Filter
    // ===========================

    statusFilter.addEventListener("change", function () {

        let filtered = bookings;

        if (this.value !== "") {

            filtered = filtered.filter(booking => booking.status === this.value);

        }

        loadBookings(filtered);

    });

    loadBookings();

});

document.getElementById("exportExcel").addEventListener("click", function () {

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if(bookings.length===0){
        alert("No Data Found");
        return;
    }

    let csv="Client,Mobile,CNIC,Project,Sector,Plot,Status\n";

    bookings.forEach(b=>{

        csv+=`${b.clientName},${b.mobile},${b.cnic},${b.project},${b.sector},${b.plot},${b.status}\n`;

    });

    const blob=new Blob([csv],{type:"text/csv"});

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="Bookings.csv";

    link.click();

});

// ==========================
// New Booking Button
// ==========================

const newBookingBtn = document.getElementById("newBookingBtn");

newBookingBtn.addEventListener("click", function () {

    const form = document.getElementById("bookingForm");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("client").focus();

});