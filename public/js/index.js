const socket = io()

const container = document.getElementById("container")

socket.on("new-product", (data) => {
    container.innerHTML += `
                                <li>
                                <p>${data.id}</p>
                                <p>${data.title}</p>
                                <p>${data.description}</p>
                                <p>Precio:${data.price}</p>
                                <p>Img: ${data.thumbnail}</p>
                                <p>code: ${data.code}</p>
                                <p>Stock: ${data.stock}</p>
                                <p>Categoría: ${data.category}</p>
                                <p>Status: ${data.status}</p>
                                </li>
                            `
})

socket.on("delete-product", (products) => {
    container.innerHTML = "";
    products.forEach(prod => {
        container.innerHTML += `
                                    <li>
                                    <p>${prod.id}</p>
                                    <p>${prod.title}</p>
                                    <p>${prod.description}</p>
                                    <p>Precio:${prod.price}</p>
                                    <p>Img: ${prod.thumbnail}</p>
                                    <p>code: ${prod.code}</p>
                                    <p>Stock: ${prod.stock}</p>
                                    <p>Categoría: ${prod.category}</p>
                                    <p>Status: ${prod.status}</p>
                                    </li>
                                    `
    })
})

socket.on("update-product", (products) => {
    container.innerHTML = "";
    products.forEach(prod => {
        container.innerHTML += `
                                    <li>
                                        <p>${prod.id}</p>
                                        <p>${prod.title}</p>
                                        <p>${prod.description}</p>
                                        <p>Precio:${prod.price}</p>
                                        <p>Img: ${prod.thumbnail}</p>
                                        <p>code: ${prod.code}</p>
                                        <p>Stock: ${prod.stock}</p>
                                        <p>Categoría: ${prod.category}</p>
                                        <p>Status: ${prod.status}</p>
                                    </li>
                                `
    })
});