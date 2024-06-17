import { UserOutput, UsersRepository } from "@/repositories/users-repository";
import bcryptjs from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

export class RegisterUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await bcryptjs.hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}

type RegisterUseCaseRequest = {
    name: string;
    email: string;
    password: string;
};

type RegisterUseCaseResponse = {
    user: UserOutput;
};
