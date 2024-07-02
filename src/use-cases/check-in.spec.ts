import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInAlreadyExistsError } from "./errors/check-in-already-exists-error";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { DistanceTooLongError } from "./errors/distance-too-long-error";
import { testConstants } from "@/constants";

type SutTypes = {
    checkInsRepositoryStub: CheckInsRepository;
    gymsRepositoryStub: GymsRepository;
    sut: CheckInUseCase;
};

const makeSut = (): SutTypes => {
    const checkInsRepositoryStub = new InMemoryCheckInsRepository();
    const gymsRepositoryStub = new InMemoryGymsRepository();
    const sut = new CheckInUseCase(checkInsRepositoryStub, gymsRepositoryStub);
    return {
        checkInsRepositoryStub,
        gymsRepositoryStub,
        sut,
    };
};

describe("CheckIn Use Case", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to create check in", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        const createdGym = await gymsRepositoryStub.create({
            title: "any_gym_title",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });
        const { checkIn } = await sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));
        const { sut, gymsRepositoryStub } = makeSut();
        const createdGym = await gymsRepositoryStub.create({
            title: "any_gym_title",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });
        await sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });

        const promise = sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        await expect(promise).rejects.toBeInstanceOf(CheckInAlreadyExistsError);
    });

    it("should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));
        const { sut, gymsRepositoryStub } = makeSut();
        const createdGym = await gymsRepositoryStub.create({
            title: "any_gym_title",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });
        await sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));
        const { checkIn } = await sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in on distant gym", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        const createdGym = await gymsRepositoryStub.create({
            title: "any_gym_title",
            latitude: testConstants.LATITUDE_GYM_TOO_LONG,
            longitude: testConstants.LONGITUDE_GYM_TOO_LONG,
        });
        const promise = sut.execute({
            userId: "any_user_id",
            gymId: createdGym.id,
            userLatitude: testConstants.LATITUDE_USER,
            userLongitude: testConstants.LONGITUDE_USER,
        });
        await expect(promise).rejects.toBeInstanceOf(DistanceTooLongError);
    });
});
