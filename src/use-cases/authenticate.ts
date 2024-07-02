import { UserOutput, UsersRepository } from "@/repositories/users-repository";
import bcryptjs from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

export class AuthenticateUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }
        const doesPasswordMatches = await bcryptjs.compare(
            password,
            user.password_hash
        );
        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        }
        return {
            user,
        };
    }
}

type AuthenticateUseCaseRequest = {
    email: string;
    password: string;
};

type AuthenticateUseCaseResponse = {
    user: UserOutput;
};
