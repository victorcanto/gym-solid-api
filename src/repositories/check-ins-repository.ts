import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
    findById: (id: string) => Promise<CheckInOutput | null>;
    findByUserIdOnDate: (
        userId: string,
        date: Date
    ) => Promise<CheckInOutput | null>;
    findManyByUserId: (
        userId: string,
        page: number
    ) => Promise<CheckInOutput[]>;
    countByUserId: (userId: string) => Promise<number>;
    create: (data: CheckInCreateInput) => Promise<CheckInOutput>;
    save: (checkIn: CheckInOutput) => Promise<CheckInOutput>;
}

export type CheckInCreateInput = Prisma.CheckInUncheckedCreateInput;

export type CheckInOutput = CheckIn;
