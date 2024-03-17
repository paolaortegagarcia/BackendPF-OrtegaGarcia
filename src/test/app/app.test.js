import app from "../../app.js";
import request from "supertest";
import { fakerES } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { initMongoDB } from "../../config/connection.js";

describe("Conjunto de tests Products", () => {
    /* -------------------------------- Products -------------------------------- */
    beforeAll(async () => {
        await initMongoDB.dropProductsCollection();
    });

    test("[POST] /api/products", async () => {
        const doc = {
            name: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            stock: fakerES.number.int({ min: 0, max: 100 }),
            code: uuidv4(),
            category: fakerES.commerce.productAdjective(),
        };
        const response = await request(app).post("/api/products").send(doc);
        //console.log("response-->", response.body);
        const id = response.body.data.newItem._id;
        const nameResponse = response.body.data.newItem.name;
        expect(id).toBeDefined();
        expect(response.body.data.newItem).toHaveProperty("_id");
        expect(nameResponse).toBe(doc.name);
        expect(response.body.data.newItem.body).toEqual(doc.body);
        expect(response.statusCode).toBe(200);

        const incompleteProduct = {
            name: fakerES.commerce.productName(),
        };
        const responseIncompleteProduct = await request(app)
            .post("/api/products")
            .send(incompleteProduct);
        expect(responseIncompleteProduct.statusCode).toBe(404);
    });

    test("[GET] /api/products/all", async () => {
        const response = await request(app).get("/api/products/all");
        console.log("response-->", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    test("[GET] /api/products/:id", async () => {
        const doc = {
            name: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            stock: fakerES.number.int({ min: 0, max: 100 }),
            code: uuidv4(),
            category: fakerES.commerce.productAdjective(),
        };
        const response = await request(app).post("/api/products").send(doc);
        const id = response.body.data.newItem._id;
        console.log(id);
        expect(id).toBeDefined();
        expect(response.body.data.newItem).toHaveProperty("_id");
        const responseGet = await request(app).get(`/api/products/${id}`);
        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body.title).toEqual(doc.title);

        // ID equivocado
        const idFaker = "10de7f1f3fd033f11d434acb";
        const responseGetFail = await request(app).get(
            `/api/products/${idFaker}`
        );
        console.log(responseGetFail);
        const msgError =
            '{"status":404,"message":"Not Found","error":"Error fetching items"}';
        console.log(responseGetFail.error.text);
        expect(responseGetFail.error.text).toEqual(msgError);
        expect(responseGetFail.statusCode).toBe(404);
    });

    test("[PUT] /api/products/:id", async () => {
        const doc = {
            name: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            stock: fakerES.number.int({ min: 0, max: 100 }),
            code: uuidv4(),
            category: fakerES.commerce.productAdjective(),
        };
        const response = await request(app).post("/api/products").send(doc);
        const id = response.body.data.newItem._id;
        console.log(id);
        expect(id).toBeDefined();
        expect(response.body.data.newItem).toHaveProperty("_id");

        const doc2 = {
            name: "test",
            description: "test",
            price: 200,
            stock: 100,
            code: uuidv4(),
            category: "test",
        };
        const responsePut = await request(app)
            .put(`/api/products/${id}`)
            .send(doc2);
        console.log("RESPONSEPUT", responsePut.body);
        expect(responsePut.statusCode).toBe(200);
        expect(responsePut.body.data.itemUpd._id).toBeDefined();
        expect(responsePut.body.data.itemUpd.title).toBe(doc2.title);
    });

    test("[DELETE] /api/products/:id", async () => {
        const doc = {
            name: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            stock: fakerES.number.int({ min: 0, max: 100 }),
            code: uuidv4(),
            category: fakerES.commerce.productAdjective(),
        };
        const response = await request(app).post("/api/products").send(doc);
        const id = response.body.data.newItem._id;
        console.log(id);
        expect(id).toBeDefined();
        expect(response.body.data.newItem).toHaveProperty("_id");

        const responseDel = await request(app).delete(`/api/products/${id}`);
        expect(responseDel.statusCode).toBe(200);
    });
});

describe("Conjunto de tests Carts", () => {
    let cartId;
    let productId;

    beforeAll(async () => {
        await initMongoDB.dropCartsCollection();
        await initMongoDB.dropProductsCollection();

        const productData = {
            name: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            stock: fakerES.number.int({ min: 0, max: 100 }),
            code: uuidv4(),
            category: fakerES.commerce.productAdjective(),
        };

        let response = await request(app)
            .post("/api/products")
            .send(productData);
        productId = response.body.data.newItem._id;
        //console.log("PRODUCT", productId);

        response = await request(app).post("/api/carts");
        cartId = response.body.data.newItem._id;
        //console.log("CART", cartId);
    });

    test("[DELETE] /api/carts/:cartId/products/:productId", async () => {
        const response = await request(app).delete(
            `/api/carts/${cartId}/products/${productId}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Success");
    });

    test("[DELETE] /api/carts/:cartId", async () => {
        const response = await request(app).delete(`/api/carts/${cartId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Success");
    });

    test("[PUT] /api/carts/:cartId/products/:productId", async () => {
        // Agregar el producto al carrito
        let response = await request(app)
            .post(`/api/products/add/${cartId}/${productId}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Success");

        const newQuantity = 3;
        response = await request(app)
            .put(`/api/carts/${cartId}/products/${productId}`)
            .send({
                quantity: newQuantity,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Success");
        expect(response.body.data.products[0]).toHaveProperty(
            "quantity",
            newQuantity
        );
    });
});

describe("Conjunto de tests Users", () => {
    const userData = {
        first_name: fakerES.name.firstName(),
        last_name: fakerES.name.lastName(),
        email: fakerES.internet.email(),
        password: "testPassword123",
    };

    test("[POST] /api/users/register", async () => {
        const response = await request(app)
            .post("/api/users/register")
            .send(userData);
        console.log(response);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Success");
    });

    test("[POST] /api/users/login", async () => {
        const response = await request(app).post("/api/users/login").send({
            email: userData.email,
            password: userData.password,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("access_token");
    });

    test("[GET] /api/users/private", async () => {
        const response = await request(app).get("/api/users/private");

        expect(response.statusCode).toBe(500);
    });
});
