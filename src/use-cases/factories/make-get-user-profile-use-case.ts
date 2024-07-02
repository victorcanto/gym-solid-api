import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetProfileUseCase } from "../get-user-profile";

export const makeGetUserProfile = () => {
    const usersRepository = new PrismaUsersRepository();
    const useCase = new GetProfileUseCase(usersRepository);
    return useCase;
};
