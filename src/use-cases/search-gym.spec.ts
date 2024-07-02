import { GymsRepository } from "@/repositories/gyms-repository";
import { SearchGymUseCase } from "./search-gym";
import { describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { testConstants } from "@/constants";

type SutTypes = {
    gymsRepositoryStub: GymsRepository;
    sut: SearchGymUseCase;
};

const makeSut = (): SutTypes => {
    const gymsRepositoryStub = new InMemoryGymsRepository();
    const sut = new SearchGymUseCase(gymsRepositoryStub);
    return {
        gymsRepositoryStub,
        sut,
    };
};

describe("Search Gym Use Case", () => {
    it("should call GymsRepository with correct values", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        const gymSearchSpy = vi.spyOn(gymsRepositoryStub, "searchMany");
        const searchQuery = {
            query: "any_query",
            page: 1,
        };
        await sut.execute(searchQuery);
        expect(gymSearchSpy).toHaveBeenCalledWith(
            searchQuery.query,
            searchQuery.page
        );
    });

    it("should be able to search gym", async () => {
        const { sut, gymsRepositoryStub } = makeSut();

        await gymsRepositoryStub.create({
            title: "any_title_1",
            description: "any_description",
            phone: "any_phone",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });

        await gymsRepositoryStub.create({
            title: "any_title_2",
            description: "any_description",
            phone: "any_phone",
            latitude: testConstants.LATITUDE_GYM,
            longitude: testConstants.LONGITUDE_GYM,
        });

        const searchQuery = {
            query: "any_title_1",
            page: 1,
        };

        const { gyms } = await sut.execute(searchQuery);
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "any_title_1" }),
        ]);
    });

    it("should be able to search gym paginated", async () => {
        const { sut, gymsRepositoryStub } = makeSut();
        for (let i = 1; i <= 22; i++) {
            await gymsRepositoryStub.create({
                title: `any_title_${i}`,
                description: "any_description",
                phone: "any_phone",
                latitude: testConstants.LATITUDE_GYM,
                longitude: testConstants.LONGITUDE_GYM,
            });
        }

        const searchQuery = {
            query: "any_title",
            page: 2,
        };

        const { gyms } = await sut.execute(searchQuery);
        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "any_title_21" }),
            expect.objectContaining({ title: "any_title_22" }),
        ]);
    });
});
