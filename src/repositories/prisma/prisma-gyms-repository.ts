import { prisma } from "@/lib/prisma";
import {
    GymsRepository,
    GymOutput,
    GymCreateInput,
    FindManyNearbyParams,
} from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
    async findById(id: string): Promise<GymOutput | null> {
        const gym = await prisma.gym.findUnique({ where: { id } });
        return gym;
    }

    async findManyNearby({
        latitude,
        longitude,
    }: FindManyNearbyParams): Promise<GymOutput[]> {
        const gyms = await prisma.$queryRaw<GymOutput[]>`
            SELECT *
            FROM gyms
            WHERE (
                6371 * acos (
                    cos ( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin ( radians(${latitude}) ) * sin( radians( latitude ) )
                )
            ) <= 10
        `;
        return gyms;
    }

    async searchMany(query: string, page: number): Promise<GymOutput[]> {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        return gyms;
    }

    async create(data: GymCreateInput): Promise<GymOutput> {
        const gym = await prisma.gym.create({ data });
        return gym;
    }
}
