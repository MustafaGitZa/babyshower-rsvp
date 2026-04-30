
// =========================
// MAIN RSVP FUNCTION
// =========================
async function submitRSVP(status) {
    const nameInput = document.getElementById("name");
    const message = document.getElementById("message");
    const spinner = document.getElementById("spinner");

    const name = nameInput.value.trim();

    if (!name) {
        message.innerText = "Please enter your name";
        message.style.color = "red";
        return;
    }

    // prevent double click
    if (!spinner.classList.contains("hidden")) return;

    spinner.classList.remove("hidden");
    message.innerText = "";

    try {
        const cleanName = name.toLowerCase();

        // CHECK EXISTING RSVP
        const { data: existing, error: checkError } = await supabaseClient
            .from("rsvps")
            .select("id")
            .eq("name", cleanName)
            .limit(1);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            spinner.classList.add("hidden");

            message.innerHTML =
                "⚠️ You have already responded.<br><br>" +
                "Please contact Mustafa: <b>078 240 6722</b>";

            return;
        }

        // INSERT RSVP
        const { error } = await supabaseClient
            .from("rsvps")
            .insert([
                {
                    name: cleanName,
                    status: status
                }
            ]);

        spinner.classList.add("hidden");

        if (error) throw error;

        nameInput.value = "";

        showSuccessModal(status);

    } catch (err) {
        console.log(err);

        spinner.classList.add("hidden");
        message.innerText = "Error submitting RSVP 😢";
        message.style.color = "red";
    }
}

// =========================
// SUCCESS MODAL
// =========================
function showSuccessModal(status) {
    const modal = document.getElementById("successModal");
    const text = document.getElementById("modalText");

    text.innerText =
        status === "accepted"
            ? "Thank you for accepting the invitation 💛"
            : "Thank you for your response 🤍";

    modal.classList.add("show");
    modal.classList.remove("show");
}

function closeModal() {
    document.getElementById("successModal").classList.add("hidden");
}

// =========================
// ADD TO CALENDAR
// =========================
function addToCalendar() {
    const event = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Baby Shower Event
DESCRIPTION:You are invited 💛
DTSTART:20260615T100000
DTEND:20260615T130000
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([event], { type: "text/calendar" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "baby-shower.ics";
    link.click();
}