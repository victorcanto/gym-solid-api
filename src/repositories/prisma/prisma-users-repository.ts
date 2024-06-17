import { prisma } from "@/lib/prisma";
import {
    UsersRepository,
    UserCreateInput,
    UserOutput,
} from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
    async create(data: UserCreateInput): Promise<UserOutput> {
        const user = await prisma.user.create({ data });
        return user;
    }

    async findByEmail(email: string): Promise<UserOutput | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    }
}
