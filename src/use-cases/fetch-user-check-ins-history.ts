import {
    CheckInOutput,
    CheckInsRepository,
} from "@/repositories/check-ins-repository";

export class FechUserCheckInHistoryUseCase {
    constructor(private readonly checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
        page,
    }: FechUserCheckInHistoryUsecaseRequest): Promise<FechUserCheckInHistoryUsecaseResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);
        return { checkIns };
    }
}

type FechUserCheckInHistoryUsecaseRequest = {
    userId: string;
    page: number;
};

type FechUserCheckInHistoryUsecaseResponse = {
    checkIns: CheckInOutput[];
};
