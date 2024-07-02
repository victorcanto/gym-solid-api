import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetProfileUseCase } from "../get-user-profile";

export const makeGetUserProfile = () => {
    const usersRepository = new PrismaUsersRepository();
    const getUserProfile = new GetProfileUseCase(usersRepository);
    return getUserProfile;
};
