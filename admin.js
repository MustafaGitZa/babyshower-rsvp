window.onload = () => {

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

        acceptedTable.innerHTML = "";
        declinedTable.innerHTML = "";

        let acceptedCount = 0;
        let declinedCount = 0;

        data.forEach(rsvp => {

            const row = `
                <tr>
                    <td>${rsvp.name}</td>
                </tr>
            `;

            if (rsvp.status === "accepted") {
                acceptedTable.innerHTML += row;
                acceptedCount++;
            } else {
                declinedTable.innerHTML += row;
                declinedCount++;
            }
        });

        acceptedCountEl.innerText = acceptedCount;
        declinedCountEl.innerText = declinedCount;
    }

    function logout() {
        sessionStorage.removeItem("admin");
        window.location.href = "admin-login.html";
    }

    window.logout = logout;

    loadRSVPs();
    setInterval(loadRSVPs, 3000);
};