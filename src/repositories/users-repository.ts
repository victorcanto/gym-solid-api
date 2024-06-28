import { User } from "@prisma/client";

export interface UsersRepository {
    create: (data: UserCreateInput) => Promise<UserOutput>;
    findByEmail: (email: string) => Promise<UserOutput | null>;
    findById: (id: string) => Promise<UserOutput | null>;
}

export type UserCreateInput = {
    name: string;
    email: string;
    password_hash: string;
};

export type UserOutput = User;
