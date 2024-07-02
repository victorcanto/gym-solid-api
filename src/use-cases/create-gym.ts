import { GymOutput, GymsRepository } from "@/repositories/gyms-repository";

export class CreateGymUseCase {
    constructor(private readonly gymsRepository: GymsRepository) {}

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        });
        return { gym };
    }
}

type CreateGymUseCaseRequest = {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
};

type CreateGymUseCaseResponse = {
    gym: GymOutput;
};
