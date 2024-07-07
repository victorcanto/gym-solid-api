import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { testConstants } from "@/constants";

describe("List Nearby Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to list nearby gyms", async () => {
        const { token } = await createAndAuthenticateUser(app, true);
        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "JavaScript Gym",
                description: "Some description",
                phone: "11999999999",
                latitude: testConstants.LATITUDE_GYM,
                longitude: testConstants.LONGITUDE_GYM,
            });

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "TypeScript Gym",
                description: "Some description",
                phone: "11999999999",
                latitude: testConstants.LATITUDE_GYM_TOO_LONG_10_KM,
                longitude: testConstants.LONGITUDE_GYM_TOO_LONG_10_KM,
            });

        const response = await request(app.server)
            .get("/gyms/nearby")
            .query({
                latitude: testConstants.LATITUDE_GYM,
                longitude: testConstants.LONGITUDE_GYM,
            })
            .set("Authorization", `Bearer ${token}`)
            .send();
        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "JavaScript Gym",
            }),
        ]);
    });
});
