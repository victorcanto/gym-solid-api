import { GymsRepository } from "@/repositories/gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { testConstants } from "@/constants";

type SutTypes = {
    gymsRepositoryStub: GymsRepository;
    sut: FetchNearbyGymsUseCase;
};

const makeSut = (): SutTypes => {
    const gymsRepositoryStub = new InMemoryGymsRepository();
    const sut = new FetchNearbyGymsUseCase(gymsRepositoryStub);
    return {
        gymsRepositoryStub,
        sut,
    };
};

describe("Search Gym Use Case", () => {
    it("should call GymsRepository with correct values", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        const gymSearchSpy = vi.spyOn(gymsRepositoryStub, "findManyNearby");
        const params = {
            userLatitude: testConstants.LATITUDE_GYM,
            userLongitude: testConstants.LONGITUDE_GYM,
        };
        await sut.execute(params);
        expect(gymSearchSpy).toHaveBeenCalledWith({
            latitude: params.userLatitude,
            longitude: params.userLongitude,
        });
    });

    it("should be able to fetch nearby gyms", async () => {
        const { sut, gymsRepositoryStub } = makeSut();

        await gymsRepositoryStub.create({
            title: "Near Gym",
            description: null,
            phone: null,
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });

        await gymsRepositoryStub.create({
            title: "Far Gym",
            description: null,
            phone: null,
            latitude: testConstants.LATITUDE_GYM_TOO_LONG_10_KM,
            longitude: testConstants.LONGITUDE_GYM_TOO_LONG_10_KM,
        });

        const { gyms } = await sut.execute({
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.any(Object)]);
    });
});
