import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";
import { GymCreateInput, GymOutput, GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
    public gyms: GymOutput[] = [];

    async create(data: GymCreateInput): Promise<GymOutput> {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(Number(data.latitude)),
            longitude: new Decimal(Number(data.longitude)),
        };
        this.gyms.push(gym);
        return gym;
    }

    async findById(id: string): Promise<GymOutput | null> {
        const gym = this.gyms.find((gym) => gym.id === id);
        if (!gym) return null;
        return gym;
    }

    async searchMany(query: string, page: number): Promise<GymOutput[]> {
        return this.gyms
            .filter((gym) => gym.title.includes(query))
            .slice((page - 1) * 20, page * 20);
    }

    async findManyNearby(params: {
        latitude: number;
        longitude: number;
    }): Promise<GymOutput[]> {
        const MAX_DISTANCE_KILOMETERS = 10;
        return this.gyms.filter((gym) => {
            const distance = getDistanceBetweenCoordinates(
                { latitude: params.latitude, longitude: params.longitude },
                {
                    latitude: gym.latitude.toNumber(),
                    longitude: gym.longitude.toNumber(),
                }
            );
            return distance < MAX_DISTANCE_KILOMETERS;
        });
    }
}
