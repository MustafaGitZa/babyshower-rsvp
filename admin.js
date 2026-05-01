window.onload = () => {

    // =========================
    // LOAD RSVP DATA
    // =========================
    async function loadRSVPs() {

        const { data, error } = await supabaseClient
            .from("rsvps")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.log("ERROR:", error);
            return;
        }

        const acceptedTable = document.getElementById("acceptedTable");
        const declinedTable = document.getElementById("declinedTable");

        const acceptedCountEl = document.getElementById("acceptedCount");
        const declinedCountEl = document.getElementById("declinedCount");

        // CLEAR TABLES
        acceptedTable.innerHTML = "";
        declinedTable.innerHTML = "";

        let acceptedCount = 0;
        let declinedCount = 0;

        data.forEach(rsvp => {

            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.textContent = rsvp.name;

            row.appendChild(cell);

            if (rsvp.status === "accepted") {
                acceptedTable.appendChild(row);
                acceptedCount++;
            } else {
                declinedTable.appendChild(row);
                declinedCount++;
            }
        });

        acceptedCountEl.innerText = acceptedCount;
        declinedCountEl.innerText = declinedCount;
    }

    // =========================
    // LOGOUT
    // =========================
    window.logout = function () {
        sessionStorage.removeItem("admin");
        window.location.href = "admin-login.html";
    };

    // =========================
    // CLEAR ALL RSVPs (UUID SAFE)
    // =========================
    window.clearAll = async function () {

        const confirmClear = confirm("Are you sure you want to delete ALL RSVPs?");

        if (!confirmClear) return;

        const { error } = await supabaseClient
            .from("rsvps")
            .delete()
            .gte("id", "00000000-0000-0000-0000-000000000000");

        if (error) {
            console.log("CLEAR ERROR:", error);
            alert("Failed to clear data");
            return;
        }

        alert("All RSVPs cleared!");
        loadRSVPs();
    };

    // =========================
    // EXPORT CSV
    // =========================
    window.exportToCSV = async function () {

        const { data, error } = await supabaseClient
            .from("rsvps")
            .select("*");

        if (error) {
            console.log(error);
            alert("Export failed");
            return;
        }

        if (!data.length) {
            alert("No data to export");
            return;
        }

        let csv = "Name,Status\n";

        data.forEach(r => {
            csv += `${r.name},${r.status}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "guest-list.csv";
        link.click();
    };

    // =========================
    // EXPORT PDF
    // =========================
    window.exportToPDF = async function () {

        const { jsPDF } = window.jspdf;

        const { data, error } = await supabaseClient
            .from("rsvps")
            .select("*");

        if (error) {
            console.log(error);
            alert("Export failed");
            return;
        }

        if (!data.length) {
            alert("No data to export");
            return;
        }

        const doc = new jsPDF();

        let y = 10;

        doc.setFontSize(16);
        doc.text("Baby Shower Guest List", 10, y);

        y += 10;

        doc.setFontSize(12);

        // ACCEPTED
        doc.text("Accepted Guests:", 10, y);
        y += 6;

        data
            .filter(r => r.status === "accepted")
            .forEach(r => {
                doc.text(`- ${r.name}`, 10, y);
                y += 6;
            });

        y += 6;

        // DECLINED
        doc.text("Declined Guests:", 10, y);
        y += 6;

        data
            .filter(r => r.status === "declined")
            .forEach(r => {
                doc.text(`- ${r.name}`, 10, y);
                y += 6;
            });

        doc.save("guest-list.pdf");
    };

    // =========================
    // INIT LOAD + AUTO REFRESH
    // =========================
    loadRSVPs();
    setInterval(loadRSVPs, 5000); // slightly reduced frequency
};