import supertest from "supertest";
import { database } from './../database/database';
import { describe } from "node:test";
import { app, server } from "..";

beforeEach( async () => {
    await database.sync({ force: true });
});

//* Ejecutar después de que se hayan ejecutado todos los tests
afterAll( async() => {
    server.close();
    await database.close();
})

const api = supertest(app);

describe('The token is given to the user with correct credentials', async () => {
    test('Works as expected giving the token', async () => {
        let userInfo = {
            name: 'Pedro Pascal',
            email: 'Pedro@mail.me',
            password: '123456'
        }       

        const user = await api.post('/users').send(userInfo).expect(201);
        
        const response = await api.post('/users/login')
            .send(userInfo)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        console.log('@response', response);
        

        let body = response.body.body

        expect(body.token).toBeDefined()
        expect(typeof body.token).toBe('string')
    })
})

