import { GymOutput, GymsRepository } from "@/repositories/gyms-repository";

export class FetchNearbyGymsUseCase {
    constructor(private readonly gymsRepository: GymsRepository) {}

    async execute({
        userLatitude,
        userLongitude,
    }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude,
        });
        return { gyms };
    }
}

type FetchNearbyGymsUseCaseRequest = {
    userLatitude: number;
    userLongitude: number;
};

type FetchNearbyGymsUseCaseResponse = {
    gyms: GymOutput[];
};
