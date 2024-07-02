import { Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
    create: (data: GymCreateInput) => Promise<GymOutput>;
    findById: (id: string) => Promise<GymOutput | null>;
    findManyNearby: (params: FindManyNearbyParams) => Promise<GymOutput[]>;
    searchMany: (query: string, page: number) => Promise<GymOutput[]>;
}

export type GymCreateInput = Prisma.GymCreateInput;

export type GymOutput = Gym;

export type FindManyNearbyParams = {
    latitude: number;
    longitude: number;
};
