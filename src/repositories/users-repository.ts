export interface UsersRepository {
    create: (data: UserCreateInput) => Promise<UserOutput>;
    findByEmail: (email: string) => Promise<UserOutput | null>;
}

export type UserCreateInput = {
    name: string;
    email: string;
    password_hash: string;
};

export type UserOutput = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
};
