import { prisma } from "@/lib/prisma";
import {
    CheckInCreateInput,
    CheckInOutput,
    CheckInsRepository,
} from "../check-ins-repository";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
    async findById(id: string): Promise<CheckInOutput | null> {
        const checkIn = await prisma.checkIn.findUnique({ where: { id } });
        return checkIn;
    }

    async findByUserIdOnDate(
        userId: string,
        date: Date
    ): Promise<CheckInOutput | null> {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOfTheDay = dayjs(date).endOf("date");
        const checkInOnSameDate = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                },
            },
        });
        return checkInOnSameDate;
    }

    async findManyByUserId(
        userId: string,
        page: number
    ): Promise<CheckInOutput[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        return checkIns;
    }

    async countByUserId(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });
        return count;
    }

    async create(data: CheckInCreateInput): Promise<CheckInOutput> {
        const checkIn = await prisma.checkIn.create({ data });
        return checkIn;
    }

    async save(data: CheckInOutput): Promise<CheckInOutput> {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        });
        return checkIn;
    }
}
