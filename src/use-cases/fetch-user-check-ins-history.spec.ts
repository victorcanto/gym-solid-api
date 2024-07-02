import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { FechUserCheckInHistoryUseCase } from "./fetch-user-check-ins-history";
import { describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

type SutTypes = {
    checkInsRepositoryStub: CheckInsRepository;
    sut: FechUserCheckInHistoryUseCase;
};

const makeSut = (): SutTypes => {
    const checkInsRepositoryStub = new InMemoryCheckInsRepository();
    const sut = new FechUserCheckInHistoryUseCase(checkInsRepositoryStub);
    return {
        checkInsRepositoryStub,
        sut,
    };
};

describe("Fetch User Check-ins History Use Case", () => {
    it("should be able to fetch check-in history", async () => {
        const { sut, checkInsRepositoryStub } = makeSut();
        await checkInsRepositoryStub.create({
            gym_id: "gym-01",
            user_id: "user-01",
        });

        await checkInsRepositoryStub.create({
            gym_id: "gym-02",
            user_id: "user-01",
        });

        const { checkIns } = await sut.execute({
            userId: "user-01",
            page: 1,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-01" }),
            expect.objectContaining({ gym_id: "gym-02" }),
        ]);
    });

    it("should be able to fetch paginated check-in history", async () => {
        const { sut, checkInsRepositoryStub } = makeSut();
        for (let i = 1; i <= 22; i++) {
            await checkInsRepositoryStub.create({
                gym_id: `gym-${i}`,
                user_id: "user-01",
            });
        }

        const { checkIns } = await sut.execute({
            userId: "user-01",
            page: 2,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-21" }),
            expect.objectContaining({ gym_id: "gym-22" }),
        ]);
    });
});
