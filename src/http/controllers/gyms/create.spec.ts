import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { testConstants } from "@/constants";

describe("Create a Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a gym", async () => {
        const { token } = await createAndAuthenticateUser(app);
        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Typescript Gym",
                description: "Some description",
                phone: "11999999999",
                latitude: testConstants.LATITUDE_GYM,
                longitude: testConstants.LONGITUDE_GYM,
            });
        expect(response.statusCode).toEqual(201);
    });
});
