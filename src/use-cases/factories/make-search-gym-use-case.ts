import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymUseCase } from "../search-gym";

export const makeSearchGymUseCase = () => {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new SearchGymUseCase(gymsRepository);
    return useCase;
};
