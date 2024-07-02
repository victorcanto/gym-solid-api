import { GymsRepository } from "@/repositories/gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { testConstants } from "@/constants";

type SutTypes = {
    gymsRepositoryStub: GymsRepository;
    sut: CreateGymUseCase;
};

const makeSut = (): SutTypes => {
    const gymsRepositoryStub = new InMemoryGymsRepository();
    const sut = new CreateGymUseCase(gymsRepositoryStub);
    return {
        gymsRepositoryStub,
        sut,
    };
};

describe("Create Gym Use Case", () => {
    it("should call GymsRepository with correct values", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        const gymCreateSpy = vi.spyOn(gymsRepositoryStub, "create");
        const createGymParams = {
            title: "any_title",
            description: "any_description",
            phone: "any_phone",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        };
        await sut.execute(createGymParams);
        expect(gymCreateSpy).toHaveBeenCalledWith(createGymParams);
    });

    it("should be able to create gym", async () => {
        const { sut } = makeSut();
        const { gym } = await sut.execute({
            title: "any_title",
            description: "any_description",
            phone: "any_phone",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });
        expect(gym.id).toEqual(expect.any(String));
        expect(gym.title).toBe("any_title");
        expect(gym.description).toBe("any_description");
        expect(gym.phone).toBe("any_phone");
        expect(gym.latitude.toNumber()).toBe(testConstants.LATITUDE_GYM);
        expect(gym.longitude.toNumber()).toBe(testConstants.LONGITUDE_GYM);
    });
});
