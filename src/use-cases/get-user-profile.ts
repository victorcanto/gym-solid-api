import { UserOutput, UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class GetProfileUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute({
        userId,
    }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError("User");
        }
        return {
            user,
        };
    }
}

type GetProfileUseCaseRequest = {
    userId: string;
};

type GetProfileUseCaseResponse = {
    user: UserOutput;
};
