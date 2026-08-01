document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");
    const bookingTable = document.getElementById("bookingTable");

    const searchBooking = document.getElementById("searchBooking");
    const projectFilter = document.getElementById("projectFilter");
    const statusFilter = document.getElementById("statusFilter");

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

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
                    <button class="delete-btn" onclick="deleteBooking(${index})">
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

        const booking = {

            clientName: document.getElementById("client").value,
            mobile: document.getElementById("mobile").value,
            cnic: document.getElementById("cnic").value,
            project: document.getElementById("project").value,
            sector: document.getElementById("sector").value,
            plot: document.getElementById("plot").value,
            status: document.getElementById("bookingStatus").value

        };

        bookings.push(booking);

        localStorage.setItem("bookings", JSON.stringify(bookings));

        bookingForm.reset();

        loadBookings();

        alert("Booking Saved Successfully");

    });

    // ===========================
    // Delete Booking
    // ===========================

    window.deleteBooking = function (index) {

        if (confirm("Delete this booking?")) {

            bookings.splice(index, 1);

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