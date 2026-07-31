const leadForm = document.getElementById("leadForm");
const leadTable = document.getElementById("leadTable");

let leads = JSON.parse(localStorage.getItem("leads")) || [];

function loadLeads(search = "", status = "") {

    leadTable.innerHTML = "";

    const filtered = leads.filter(lead => {

    const matchSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.mobile.includes(search) ||
        lead.project.toLowerCase().includes(search.toLowerCase()) ||
        lead.source.toLowerCase().includes(search.toLowerCase()) ||
        (lead.referenceName &&
            lead.referenceName.toLowerCase().includes(search.toLowerCase()));

        const matchStatus =
            status === "" || lead.status === status;

        return matchSearch && matchStatus;

    });

    filtered.forEach((lead, index) => {

        leadTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${lead.name}</td>
                <td>${lead.mobile}</td>
                <td>${lead.project}</td>
                <td>
                    ${
                        lead.source === "Reference"
                            ? `Reference of: <strong>${lead.referenceName}</strong>`
                            : lead.source
                    }
                </td>
                <td>${lead.status}</td>
                <td>${lead.followup}</td>
                <td>
                    <button class="action-btn delete"
                        onclick="deleteLead(${leads.indexOf(lead)})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}

leadForm.addEventListener("submit", function(e){
    loadLeads();
    e.preventDefault();

    const lead={

        name:document.getElementById("clientName").value,
        mobile:document.getElementById("mobile").value,
        email:document.getElementById("email").value,
        city:document.getElementById("city").value,
        project:document.getElementById("project").value,
        source:document.getElementById("source").value,
        referenceName: document.getElementById("referenceName").value,
        status:document.getElementById("status").value,
        budget:document.getElementById("budget").value,
        followup:document.getElementById("followup").value,
        remarks:document.getElementById("remarks").value

    };

    leads.push(lead);

    localStorage.setItem("leads",JSON.stringify(leads));

    leadForm.reset();

    loadLeads();

});

function deleteLead(index){

    if(confirm("Delete this Lead?")){

        leads.splice(index,1);

        localStorage.setItem("leads",JSON.stringify(leads));

        loadLeads(searchLead.value, statusFilter.value);

    }

}

loadLeads();

const searchLead = document.getElementById("searchLead");
const statusFilter = document.getElementById("statusFilter");

searchLead.addEventListener("keyup", () => {

    loadLeads(searchLead.value, statusFilter.value);

});

statusFilter.addEventListener("change", () => {

    loadLeads(searchLead.value, statusFilter.value);

});

const source = document.getElementById("source");
const referenceField = document.getElementById("referenceField");

source.addEventListener("change", function () {

    if (this.value === "Reference") {

        referenceField.style.display = "block";

    } else {

        referenceField.style.display = "none";
        document.getElementById("referenceName").value = "";

    }

});