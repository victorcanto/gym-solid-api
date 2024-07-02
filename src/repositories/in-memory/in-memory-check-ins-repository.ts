import { randomUUID } from "node:crypto";
import {
    CheckInCreateInput,
    CheckInOutput,
    CheckInsRepository,
} from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public checkIns: CheckInOutput[] = [];

    async findById(id: string): Promise<CheckInOutput | null> {
        const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);
        if (!checkIn) return null;
        return checkIn;
    }

    async findByUserIdOnDate(
        userId: string,
        date: Date
    ): Promise<CheckInOutput | null> {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOfTheDay = dayjs(date).endOf("date");

        const checkInOnSameDate = this.checkIns.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at);
            const isOnSameDate =
                checkInDate.isAfter(startOfTheDay) &&
                checkInDate.isBefore(endOfTheDay);
            return checkIn.user_id === userId && isOnSameDate;
        });
        if (!checkInOnSameDate) return null;
        return checkInOnSameDate;
    }

    async findManyByUserId(
        userId: string,
        page: number
    ): Promise<CheckInOutput[]> {
        return this.checkIns
            .filter((checkIn) => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20);
    }

    async countByUserId(userId: string): Promise<number> {
        return this.checkIns.filter((checkIn) => checkIn.user_id === userId)
            .length;
    }

    async create(data: CheckInCreateInput): Promise<CheckInOutput> {
        const checkIn: CheckInOutput = {
            id: randomUUID(),
            gym_id: data.gym_id,
            user_id: data.user_id,
            created_at: new Date(),
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
        };
        this.checkIns.push(checkIn);
        return checkIn;
    }

    async save(checkIn: CheckInOutput): Promise<CheckInOutput> {
        const checkInIndex = this.checkIns.findIndex(
            (item) => item.id === checkIn.id
        );
        if (checkInIndex >= 0) {
            this.checkIns[checkInIndex] = checkIn;
        }
        return checkIn;
    }
}
