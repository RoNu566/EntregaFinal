function addProductButton() {
    let buttons = document.querySelectorAll(".add_button");
    for (const button of buttons) {
        button.addEventListener("click", (e) => {
            alert();
        })
    }
};

function alert() {
    Swal.fire({
        title: `Se agrego el producto correctamente`,
        toast: true,
        position: "top",
    });
}


document.addEventListener("DOMContentLoaded", addProductButton)