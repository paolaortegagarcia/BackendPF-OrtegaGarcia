export const info = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Memini",
            version: "1.0.0",
            description: "Tienda de Accesorios",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
        externalDocs: {
            description: "Repositorio de GitHub",
            url: "https://github.com/paolaortegagarcia/BackendPF-OrtegaGarcia",
        },
    },
    apis: ["./src/docs/*.yml"],
};
