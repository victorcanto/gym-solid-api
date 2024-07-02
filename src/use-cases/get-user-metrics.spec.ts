import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, expect, it } from "vitest";

type SutTypes = {
    checkInsRepositoryStub: CheckInsRepository;
    sut: GetUserMetricsUseCase;
};

const makeSut = (): SutTypes => {
    const checkInsRepositoryStub = new InMemoryCheckInsRepository();
    const sut = new GetUserMetricsUseCase(checkInsRepositoryStub);
    return {
        checkInsRepositoryStub,
        sut,
    };
};

describe("Get User Metrics Use Case", () => {
    it("should be able to get check-in count from metrics", async () => {
        const { sut, checkInsRepositoryStub } = makeSut();

        await checkInsRepositoryStub.create({
            gym_id: "gym-01",
            user_id: "user-01",
        });

        await checkInsRepositoryStub.create({
            gym_id: "gym-02",
            user_id: "user-01",
        });

        await checkInsRepositoryStub.create({
            gym_id: "gym-03",
            user_id: "user-01",
        });

        const { checkInsCount } = await sut.execute({
            userId: "user-01",
        });
        expect(checkInsCount).toBe(3);
    });

    it("should returns zero if user has no check-ins", async () => {
        const { sut } = makeSut();
        const { checkInsCount } = await sut.execute({
            userId: "user-01",
        });
        expect(checkInsCount).toBe(0);
    });
});
