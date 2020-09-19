process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app")
const items = require("./fakeDb");

const pudding = {
    name: "pudding",
    price: 6.66
}

beforeEach(function() {
    items.push({...pudding});
})

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("gets a list of items on the shopping list", async function(){
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items: [pudding]});
    });
});

describe("POST /items", function() {
    test("creates a new shopping list item", async function() {
        const resp = await request(app)
            .post('/items')
            .send({
                name: "milk",
                price: 3.49
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({added: {
            name: "milk",
            price: 3.49
        }
        })
    })
    test("fails to create a new shopping list item, no name", async function() {
        const resp = await request(app)
            .post('/items')
            .send({
                price: 3.49
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Item name is required" })
    })
    test("fails to create a new shopping list item, no price", async function() {
        const resp = await request(app)
            .post('/items')
            .send({
                name: "milk"
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Item price is required" })
    })
    test("fails to create a new shopping list item, empty array", async function() {
        const resp = await request(app)
            .post('/items')
            .send({});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Cannot add empty item" })
    });
});

describe("GET /items/:name", function () {
    test("gets a specific item from the shopping list", async function() {
        const resp = await request(app).get('/items/pudding');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            name: "pudding",
            price: 6.66
        });
    });
    test("fails to get a specific item from the shopping list, no match", async function() {
        const resp = await request(app).get('/items/milk');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ error: "Item not found" });
    });
});

describe("PATCH /items/:name", function () {
    test("fails to update shopping list item, empty array", async function() {
        const resp = await request(app)
        .patch('/items/pudding')
        .send({});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Cannot update with empty item" })
    })
    test("fails to create a new shopping list item, no name", async function() {
        const resp = await request(app)
        .patch('/items/pudding')
        .send({ price: 7.77 });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Item name is required" })
    })
    test("fails to create a new shopping list item, no price", async function() {
        const resp = await request(app)
        .patch('/items/pudding')
        .send({ name: "chocolate pudding" });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({ error: "Item price is required" })
    })
    test("updates a specific item from the shopping list", async function() {
        const resp = await request(app)
        .patch('/items/pudding')
        .send({ name: "chocolate pudding", price: 7.77 });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: {
            name: "chocolate pudding",
            price: 7.77 }})
    });
});

describe("DELETE /items/:name", function () {
    test("deletes a specific item from the shopping list", async function() {
        const resp = await request(app).delete('/items/pudding');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: 'Deleted'})
    })
})