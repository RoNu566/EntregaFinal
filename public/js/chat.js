const socket = io();

let username;

Swal.fire({
    title: 'Bienvenido al chat, por favor identifícate:',
    input: "text",
    text: "Ingresa tu nombre de usuario:",
    inputValidator: (value) => {
        return !value && "No has ingreado el usuario"
    },
    allowOutsideClick: false,
    icon: 'question',
    confirmButtonText: 'Ok!'
}).then((result) => {
    username = result.value;
    socket.emit("new-user", username)
});

const inputChat = document.getElementById("input-chat")

inputChat.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter") {
        const input = inputChat.value;
        if (input.trim().length > 0) {
            socket.emit("messages", { username, message: input });
            inputChat.value = "";
        }
    }
});

const chat = document.getElementById("mensajes-chat");
socket.on("messages", (data) => {
    let message = "";
    data.forEach((m) => {
        message += `<b>${m.username}:</b> ${m.message}<br>`;
    });
    chat.innerHTML = message;
});

socket.on("new-user", (username) => {
    Swal.fire({
        title: `${username} ha ingresado al chat`,
        toast: true,
        porition: "top-end"
    });
});