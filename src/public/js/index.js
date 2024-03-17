const socketClient = io();

/* ---------------------------- RealTimeProducts ---------------------------- */

const realTimeProductsView = document.getElementById("realTime-container");

if (realTimeProductsView) {
    console.log("in real time view");

    const form = document.getElementById("form");
    const inputName = document.getElementById("title");
    const inputDescription = document.getElementById("description");
    const inputCode = document.getElementById("code");
    const inputPrice = document.getElementById("price");
    const inputStock = document.getElementById("stock");
    const inputCategory = document.getElementById("category");

    const products = document.getElementById("products");

    form.onsubmit = (e) => {
        e.preventDefault();
        const title = inputName.value;
        const description = inputDescription.value;
        const code = inputCode.value;
        const price = inputPrice.value;
        const stock = inputStock.value;
        const category = inputCategory.value;

        const product = {
            title,
            description,
            price,
            code,
            stock,
            category,
        };
        socketClient.emit("newProduct", product);

        inputName.value = "";
        inputDescription.value = "";
        inputCode.value = "";
        inputPrice.value = "";
        inputStock.value = "";
        inputCategory.value = "";
    };

    socketClient.on("arrayProducts", (arrayProducts) => {
        let infoProducts =
            "<table><tr><th>Name</th><th>Description</th><th>Price</th></tr>";

        arrayProducts.forEach((p) => {
            infoProducts += `<tr><td>${p.title}</td><td>${p.description}</td><td>$${p.price}</td></tr>`;
        });

        infoProducts += "</table>";
        products.innerHTML = infoProducts;
    });
}

/* ---------------------------------- Chat ---------------------------------- */

const chatView = document.getElementById("chat-container");

if (chatView) {
    console.log("in chat view");
    let username = null;
    if (!username) {
        Swal.fire({
            title: "¡Chat de Memini!",
            text: "Agrega tu nombre",
            input: "text",
            inputValidator: (value) => {
                if (!value) return "¡Ingresa tu nombre!";
            },
        }).then((input) => {
            username = input.value;
            socketClient.emit("newUser", username);
        });
    }

    const message = document.getElementById("message");
    const btn = document.getElementById("send");
    const output = document.getElementById("output");
    const actions = document.getElementById("actions");

    btn.addEventListener("click", () => {
        socketClient.emit("chat:message", {
            username,
            message: message.value,
        });
        message.value = "";
    });

    socketClient.on("messages", (data) => {
        actions.innerHTML = "";
        const chatRender = data
            .map((msg) => {
                return `<p><strong> ${msg.username} </strong>: ${msg.message} </p>`;
            })
            .join(" ");
        output.innerHTML = chatRender;
    });

    socketClient.on("newUser", (username) => {
        Toastify({
            text: `${username} logged in`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    });

    message.addEventListener("keypress", () => {
        socketClient.emit("chat:typing", username);
    });

    socketClient.on("chat:typing", (user) => {
        actions.innerHTML = `<p>${user} is writing a message...</p>`;
    });
}
