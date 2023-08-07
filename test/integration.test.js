import chai from "chai";
import { request } from "express";
import supertest from "supertest";
import { app } from "../src/app.js"

const expect = chai.expect;
const requester = supertest(app)

describe("Testing de App", async function () {
    describe("Test para ruta de Signup", () => {
        it("El endpoint POST /api/session/signIn debe registrar un usuario", async function () {
            const userMock = {
                name: "Usuario de prueba",
                last_name: "Prueba",
                age: "25",
                email: "mock@coder.com",
                password: "1234"
            }
            const result = await requester.post("/api/session/signIn").send(userMock)
            console.log("usuario de prueba", result)
            expect(result).to.be.ok
        })
    })

    describe("Test para obtener los productos", async function () {
        it("El endopint GET /api/products debe  retornar los productos", async function () {
            const result = await requester.get("/api/products")
            console.log("Productos", result)
            expect(result).to.be.ok
        })
    })

    describe("Test para obtener los carritos", async function () {
        it("El endopint GET /api/carts debe  retornar los carritos", async function () {
            const result = await requester.get("/api/carts")
            console.log("Carritos", result)
            expect(result).to.be.ok
        })
    })

    describe("Test para hacer el login", async function () {
        it("El endopint POST /api/session/login debe logear al usuario", async function () {
            const userTest = {
                email: "mock@coder.com",
                password: "1234"
            }
            const result = await requester.post("/api/session/login").send(userTest)
            expect(result).to.be.ok
        })
    })

    describe("Test para crear Producto", async function () {
        before(async function () {
            const userTest = {
                email: "mock@coder.com",
                password: "1234"
            }
            await requester.post("/api/session/login").send(userTest)
        })

        it("El endopint POST /api/products debe poder agregar productos", async function () {

            const productTest = {
                title: "Campera prueba",
                description: "ddd",
                price: 1000,
                thumbnail: "img",
                code: 9,
                stock: 20,
                category: "ropa",
                status: true
            }

            const result = await requester.post("/api/products").send(productTest)
            expect(result).to.be.ok
        })
    })

})