import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FechUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history";

export const makeFetchUserCheckInsHistoryUseCase = () => {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new FechUserCheckInHistoryUseCase(checkInsRepository);
    return useCase;
};
