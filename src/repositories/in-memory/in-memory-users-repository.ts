import {
    UserCreateInput,
    UserOutput,
    UsersRepository,
} from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
    public users: UserOutput[] = [];

    async create(data: UserCreateInput): Promise<UserOutput> {
        const user = {
            id: "valid_id",
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
        };
        this.users.push(user);
        return user;
    }
    async findByEmail(email: string): Promise<UserOutput | null> {
        const user = this.users.find((user) => user.email === email);
        if (!user) return null;
        return user;
    }
}
