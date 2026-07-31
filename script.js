// =========================
// Site Visit Management
// =========================

const visitForm = document.getElementById("visitForm");
const visitTable = document.getElementById("visitTable");

const searchVisit = document.getElementById("searchVisit");
const statusFilter = document.getElementById("statusFilter");

const pickup = document.getElementById("pickup");
const pickupBoxes = document.querySelectorAll(".pickupBox");

let visits = JSON.parse(localStorage.getItem("visits")) || [];

// =========================
// Pickup Show Hide
// =========================

pickup.addEventListener("change", () => {

    if (pickup.value === "Yes") {

        pickupBoxes.forEach(box => box.style.display = "block");

    } else {

        pickupBoxes.forEach(box => box.style.display = "none");

        document.getElementById("pickupLocation").value = "";
        document.getElementById("driver").value = "";
        document.getElementById("vehicle").value = "";

    }

});

// =========================
// Save Visit
// =========================

visitForm.addEventListener("submit", function(e){

    e.preventDefault();

    const visit = {

        client: document.getElementById("client").value,

        mobile: document.getElementById("mobile").value,

        project: document.getElementById("project").value,

        sector: document.getElementById("sector").value,

        agent: document.getElementById("agent").value,

        date: document.getElementById("date").value,

        time: document.getElementById("time").value,

        pickup: document.getElementById("pickup").value,

        pickupLocation: document.getElementById("pickupLocation").value,

        driver: document.getElementById("driver").value,

        vehicle: document.getElementById("vehicle").value,

        visitors: document.getElementById("visitors").value,

        status: document.getElementById("status").value,

        notes: document.getElementById("notes").value,

        followup: document.getElementById("followup").value

    };

    visits.push(visit);

    localStorage.setItem("visits", JSON.stringify(visits));

    visitForm.reset();

    pickupBoxes.forEach(box => box.style.display = "none");

    loadVisits();

});

// =========================
// Load Visits
// =========================

function loadVisits(search = "", status = "") {

    visitTable.innerHTML = "";

    const filtered = visits.filter(v => {

        const matchSearch =
            Object.values(v)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            status === "" || v.status === status;

        return matchSearch && matchStatus;

    });

    filtered.forEach((visit,index)=>{

        let badge="scheduled";

        switch(visit.status){

            case "Confirmed":
                badge="confirmed";
                break;

            case "Completed":
                badge="completed";
                break;

            case "Rescheduled":
                badge="rescheduled";
                break;

            case "Cancelled":
                badge="cancelled";
                break;

            case "No Show":
                badge="noshow";
                break;
        }

        visitTable.innerHTML +=`

<tr>

<td>${index+1}</td>

<td>${visit.client}</td>

<td>${visit.mobile}</td>

<td>${visit.project}</td>

<td>${visit.date}</td>

<td>${visit.time}</td>

<td>${visit.agent}</td>

<td>
<span class="badge ${badge}">
${visit.status}
</span>
</td>

<td>

<button class="action-btn call-btn"
onclick="callClient('${visit.mobile}')">

<i class="fa fa-phone"></i>

</button>

<button class="action-btn whatsapp-btn"
onclick="whatsappClient('${visit.mobile}')">

<i class="fab fa-whatsapp"></i>

</button>

<button class="action-btn delete-btn"
onclick="deleteVisit(${visits.indexOf(visit)})">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}

// =========================
// Delete
// =========================

function deleteVisit(index){

    if(confirm("Delete Site Visit?")){

        visits.splice(index,1);

        localStorage.setItem("visits",JSON.stringify(visits));

        loadVisits(searchVisit.value,statusFilter.value);

    }

}

// =========================
// Search
// =========================

searchVisit.addEventListener("keyup",()=>{

    loadVisits(searchVisit.value,statusFilter.value);

});

// =========================
// Filter
// =========================

statusFilter.addEventListener("change",()=>{

    loadVisits(searchVisit.value,statusFilter.value);

});

// =========================
// WhatsApp
// =========================

function whatsappClient(number){

window.open(`https://wa.me/92${number.replace(/^0/,'')}`,"_blank");

}

// =========================
// Call
// =========================

function callClient(number){

window.location.href=`tel:${number}`;

}

// =========================

loadVisits();

// ===============================
// Export Site Visits
// ===============================

document.getElementById("exportVisits").addEventListener("click", function () {

    const visits = JSON.parse(localStorage.getItem("visits")) || [];

    if (visits.length === 0) {
        alert("No Site Visits Found");
        return;
    }

    let csv = "Client,Mobile,Project,Sector,Agent,Date,Time,Status,Visitors,Pickup,Pickup Location,Driver,Vehicle,Followup,Notes\n";

    visits.forEach(v => {

        csv += `${v.client},${v.mobile},${v.project},${v.sector},${v.agent},${v.date},${v.time},${v.status},${v.visitors},${v.pickup},${v.pickupLocation},${v.driver},${v.vehicle},${v.followup},${v.notes}\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Site_Visits.csv";

    link.click();

});

// ===============================
// Import Site Visits
// ===============================

document.getElementById("importVisits").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        const rows = event.target.result.split("\n");

        let visits = JSON.parse(localStorage.getItem("visits")) || [];

        rows.slice(1).forEach(row => {

            if (row.trim() === "") return;

            const cols = row.split(",");

            visits.push({

                client: cols[0] || "",
                mobile: cols[1] || "",
                project: cols[2] || "",
                sector: cols[3] || "",
                agent: cols[4] || "",
                date: cols[5] || "",
                time: cols[6] || "",
                status: cols[7] || "",
                visitors: cols[8] || "",
                pickup: cols[9] || "",
                pickupLocation: cols[10] || "",
                driver: cols[11] || "",
                vehicle: cols[12] || "",
                followup: cols[13] || "",
                notes: cols[14] || ""

            });

        });

        localStorage.setItem("visits", JSON.stringify(visits));

        alert("Site Visits Imported Successfully");

        location.reload();

    };

    reader.readAsText(file);

});