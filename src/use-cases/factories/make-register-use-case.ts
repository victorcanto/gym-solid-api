import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export const makeRegisterUseCase = () => {
    const usersRepository = new PrismaUsersRepository();
    const useCase = new RegisterUseCase(usersRepository);
    return useCase;
};
