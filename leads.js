const STORAGE_KEY = "leads";
const leadForm = document.getElementById("leadForm");
const leadTable = document.getElementById("leadTable");
const searchLead = document.getElementById("searchLead");
const statusFilter = document.getElementById("statusFilter");
const sourceSelect = document.getElementById("source");
const referenceField = document.getElementById("referenceField");
const referenceNameInput = document.getElementById("referenceName");
const importLeadFile = document.getElementById("importLeadFile");

let leads = [];

function getLeadValue(lead, keys) {
    for (const key of keys) {
        if (lead[key] !== undefined && lead[key] !== null && String(lead[key]).trim() !== "") {
            return lead[key];
        }
    }

    return "";
}

function normalizeLead(rawLead = {}) {
    const normalized = {
        id: rawLead.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: getLeadValue(rawLead, ["name", "Client Name", "clientName", "Client"]),
        mobile: getLeadValue(rawLead, ["mobile", "Mobile", "phone"]),
        email: getLeadValue(rawLead, ["email", "Email"]),
        city: getLeadValue(rawLead, ["city", "City"]),
        project: getLeadValue(rawLead, ["project", "Project"]),
        source: getLeadValue(rawLead, ["source", "Lead Source", "leadSource"]),
        referenceName: getLeadValue(rawLead, ["referenceName", "Reference Name", "reference"]),
        status: getLeadValue(rawLead, ["status", "Status", "Lead Status"]),
        budget: getLeadValue(rawLead, ["budget", "Budget"]),
        followup: getLeadValue(rawLead, ["followup", "Follow-up", "Follow Up", "nextFollowup"]),
        remarks: getLeadValue(rawLead, ["remarks", "Remarks"])
    };

    return normalized;
}

function loadLeadsFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(stored)) {
            return [];
        }

        return stored.map(normalizeLead);
    } catch (error) {
        console.error("Failed to load leads from storage:", error);
        return [];
    }
}

function saveLeads() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function renderLeads(search = "", status = "") {
    if (!leadTable) {
        return;
    }

    const query = String(search || "").trim().toLowerCase();

    const filtered = leads.filter((lead) => {
        const name = String(lead.name || "").toLowerCase();
        const mobile = String(lead.mobile || "");
        const project = String(lead.project || "").toLowerCase();
        const source = String(lead.source || "").toLowerCase();
        const reference = String(lead.referenceName || "").toLowerCase();

        const matchesSearch =
            name.includes(query) ||
            mobile.includes(query) ||
            project.includes(query) ||
            source.includes(query) ||
            reference.includes(query);

        const matchesStatus = status === "" || lead.status === status;

        return matchesSearch && matchesStatus;
    });

    leadTable.innerHTML = "";

    if (filtered.length === 0) {
        leadTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">No leads found.</td>
            </tr>`;
        return;
    }

    filtered.forEach((lead, index) => {
        const sourceLabel = lead.source === "Reference"
            ? `Reference of: <strong>${lead.referenceName || "—"}</strong>`
            : lead.source || "—";

        leadTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${lead.name || "—"}</td>
                <td>${lead.mobile || "—"}</td>
                <td>${lead.project || "—"}</td>
                <td>${sourceLabel}</td>
                <td>${lead.status || "—"}</td>
                <td>${lead.followup || "—"}</td>
                <td>
                    <button type="button" class="delete-btn" data-lead-id="${lead.id}">
                        Delete
                    </button>
                </td>
            </tr>`;
    });
}

function resetLeadForm() {
    if (leadForm) {
        leadForm.reset();
        if (referenceField) {
            referenceField.style.display = "none";
        }
        const firstInput = document.getElementById("clientName");
        if (firstInput) {
            firstInput.focus();
        }
    }
}

function notify(message) {
    alert(message);
}

function handleLeadSubmit(event) {
    event.preventDefault();

    if (!leadForm) {
        return;
    }

    const newLead = normalizeLead({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: document.getElementById("clientName").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        email: document.getElementById("email").value.trim(),
        city: document.getElementById("city").value.trim(),
        project: document.getElementById("project").value.trim(),
        source: document.getElementById("source").value.trim(),
        referenceName: document.getElementById("referenceName").value.trim(),
        status: document.getElementById("status").value.trim(),
        budget: document.getElementById("budget").value.trim(),
        followup: document.getElementById("followup").value.trim(),
        remarks: document.getElementById("remarks").value.trim()
    });

    if (!newLead.name && !newLead.mobile) {
        notify("Please enter at least a client name or mobile number.");
        return;
    }

    leads.push(newLead);
    saveLeads();
    renderLeads(searchLead.value, statusFilter.value);
    resetLeadForm();
    notify("Lead added successfully.");
}

function deleteLead(leadId) {
    if (!confirm("Delete this lead?")) {
        return;
    }

    leads = leads.filter((lead) => lead.id !== leadId);
    saveLeads();
    renderLeads(searchLead.value, statusFilter.value);
}

function toggleReferenceField() {
    if (!sourceSelect || !referenceField || !referenceNameInput) {
        return;
    }

    if (sourceSelect.value === "Reference") {
        referenceField.style.display = "block";
    } else {
        referenceField.style.display = "none";
        referenceNameInput.value = "";
    }
}

function exportLeads() {
    if (!leads.length) {
        notify("No leads found to export.");
        return;
    }

    if (typeof window.XLSX === "undefined" || !window.XLSX?.utils || !window.XLSX?.writeFile) {
        notify("Excel library is not available. Please refresh the page and try again.");
        return;
    }

    const exportData = leads.map((lead) => ({
        "Client Name": lead.name || "",
        "Mobile": lead.mobile || "",
        "Email": lead.email || "",
        "City": lead.city || "",
        "Project": lead.project || "",
        "Lead Source": lead.source || "",
        "Reference Name": lead.referenceName || "",
        "Status": lead.status || "",
        "Budget": lead.budget || "",
        "Follow Up": lead.followup || "",
        "Remarks": lead.remarks || ""
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(exportData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const fileName = `Leads-${new Date().toISOString().slice(0, 10)}.xlsx`;
    window.XLSX.writeFile(workbook, fileName);
}

function handleImportLeadFile(event) {
    const [file] = event.target.files || [];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (loadEvent) {
        try {
            const data = new Uint8Array(loadEvent.target.result);
            const workbook = window.XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const importedRows = window.XLSX.utils.sheet_to_json(sheet, { defval: "" });

            const importedLeads = importedRows.map((row) => normalizeLead(row));
            leads = [...leads, ...importedLeads];
            saveLeads();
            renderLeads(searchLead.value, statusFilter.value);
            notify("Leads imported successfully.");
        } catch (error) {
            console.error("Failed to import Excel file:", error);
            notify("The selected file could not be imported. Please use a valid Excel file.");
        }
    };

    reader.onerror = function () {
        notify("The selected file could not be read.");
    };

    reader.readAsArrayBuffer(file);
}

function initializeLeadManager() {
    leads = loadLeadsFromStorage();

    if (leadForm) {
        leadForm.addEventListener("submit", handleLeadSubmit);
    }

    if (leadTable) {
        leadTable.addEventListener("click", function (event) {
            const button = event.target.closest("[data-lead-id]");
            if (!button) {
                return;
            }

            deleteLead(button.getAttribute("data-lead-id"));
        });
    }

    if (searchLead) {
        searchLead.addEventListener("keyup", () => {
            renderLeads(searchLead.value, statusFilter.value);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            renderLeads(searchLead.value, statusFilter.value);
        });
    }

    if (sourceSelect) {
        sourceSelect.addEventListener("change", toggleReferenceField);
    }

    if (importLeadFile) {
        importLeadFile.addEventListener("change", handleImportLeadFile);
    }

    toggleReferenceField();
    renderLeads();
}

document.addEventListener("DOMContentLoaded", initializeLeadManager);

window.exportLeads = exportLeads;
