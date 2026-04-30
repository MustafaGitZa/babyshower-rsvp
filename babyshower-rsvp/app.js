async function submitRSVP(status) {
    const nameInput = document.getElementById("name");
    const message = document.getElementById("message");

    const name = nameInput.value.trim();

    if (!name) {
        message.innerText = "Please enter your name";
        message.style.color = "red";
        return;
    }

    message.innerText = "Submitting RSVP...";
    message.style.color = "black";

    const { data, error } = await supabaseClient
        .from("rsvps")
        .insert([{ name: name, status: status }]);

    if (error) {
        console.log(error);
        message.innerText = "Error submitting RSVP 😢";
        message.style.color = "red";
        return;
    }

    message.innerText = "RSVP submitted successfully 🎉";
    message.style.color = "green";

    nameInput.value = "";
}