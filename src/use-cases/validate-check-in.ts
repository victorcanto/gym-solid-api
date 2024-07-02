import {
    CheckInOutput,
    CheckInsRepository,
} from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

export class ValidateCheckInUseCase {
    constructor(private readonly checkInsRepository: CheckInsRepository) {}

    async execute({
        checkInId,
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId);
        if (!checkIn) {
            throw new ResourceNotFoundError("Check-in");
        }
        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            "minutes"
        );
        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError();
        }
        checkIn.validated_at = new Date();
        await this.checkInsRepository.save(checkIn);
        return { checkIn };
    }
}

type ValidateCheckInUseCaseRequest = {
    checkInId: string;
};

type ValidateCheckInUseCaseResponse = {
    checkIn: CheckInOutput;
};
