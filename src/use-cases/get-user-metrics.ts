import { CheckInsRepository } from "@/repositories/check-ins-repository";

export class GetUserMetricsUseCase {
    constructor(private readonly checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
    }: GetUserMetricsUsecaseRequest): Promise<GetUserMetricsUsecaseResponse> {
        const checkInsCount =
            await this.checkInsRepository.countByUserId(userId);
        return { checkInsCount };
    }
}

type GetUserMetricsUsecaseRequest = {
    userId: string;
};

type GetUserMetricsUsecaseResponse = {
    checkInsCount: number;
};
