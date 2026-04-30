
window.onload = () => {

    // =========================
    // LOAD RSVP DATA
    // =========================
    async function loadRSVPs() {

        const { data, error } = await supabaseClient
            .from("rsvps")
            .select("*");

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
    function logout() {
        sessionStorage.removeItem("admin");
        window.location.href = "admin-login.html";
    }

    window.logout = logout;

    // =========================
    // CLEAR ALL RSVPs (FIXED FOR UUID)
    // =========================
    window.clearAll = async function () {

        const confirmClear = confirm("Are you sure you want to delete ALL RSVPs?");

        if (!confirmClear) return;

        const { error } = await supabaseClient
            .from("rsvps")
            .delete()
            .gte("id", "00000000-0000-0000-0000-000000000000");
        // ✅ works for UUID safely

        if (error) {
            console.log("CLEAR ERROR:", error);
            alert("Failed to clear data");
            return;
        }

        alert("All RSVPs cleared!");
        loadRSVPs();
    };

    // =========================
    // AUTO REFRESH
    // =========================
    loadRSVPs();
    setInterval(loadRSVPs, 3000);
};