import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

type SutTypes = {
    checkInsRepositoryStub: CheckInsRepository;
    sut: ValidateCheckInUseCase;
};

const makeSut = (): SutTypes => {
    const checkInsRepositoryStub = new InMemoryCheckInsRepository();
    const sut = new ValidateCheckInUseCase(checkInsRepositoryStub);
    return {
        checkInsRepositoryStub,
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

    it("should be able to validate the check-in", async () => {
        const { sut, checkInsRepositoryStub } = makeSut();
        const createdCheckIn = await checkInsRepositoryStub.create({
            gym_id: "any_gym_id",
            user_id: "any_user_id",
        });
        const response = await sut.execute({
            checkInId: createdCheckIn.id,
        });

        expect(response.checkIn.validated_at).toEqual(expect.any(Date));
        expect(
            (checkInsRepositoryStub as InMemoryCheckInsRepository).checkIns[0]
                .validated_at
        ).toEqual(expect.any(Date));
    });

    it("should not be able to validate an inexistent check-in", async () => {
        const { sut } = makeSut();
        const promise = sut.execute({
            checkInId: "inexistent_check_in_id",
        });
        await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
        const { sut, checkInsRepositoryStub } = makeSut();
        const createdCheckIn = await checkInsRepositoryStub.create({
            gym_id: "any_gym_id",
            user_id: "any_user_id",
        });

        const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;
        vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);
        const promise = sut.execute({
            checkInId: createdCheckIn.id,
        });
        await expect(promise).rejects.toBeInstanceOf(
            LateCheckInValidationError
        );
    });
});
