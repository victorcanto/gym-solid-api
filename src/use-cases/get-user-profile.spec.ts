import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { GetProfileUseCase } from "./get-user-profile";
import { describe } from "node:test";
import { expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type SutTypes = {
    usersRepositoryStub: UsersRepository;
    sut: GetProfileUseCase;
};

const makeStut = (): SutTypes => {
    const usersRepositoryStub = new InMemoryUsersRepository();
    const sut = new GetProfileUseCase(usersRepositoryStub);
    return {
        usersRepositoryStub,
        sut,
    };
};

describe("Get User Profile Use Case", () => {
    it("should be able to get user profile", async () => {
        const { sut, usersRepositoryStub } = makeStut();
        const createdUser = await usersRepositoryStub.create({
            name: "any_name",
            email: "any_email@mail.com",
            password_hash: "any_password",
        });
        const { user } = await sut.execute({
            userId: createdUser.id,
        });
        expect(user.name).toBe(createdUser.name);
        expect(user.email).toBe(createdUser.email);
    });

    it("should not be able to get user profile with wrong id", async () => {
        const { sut } = makeStut();
        const promise = sut.execute({
            userId: "wrong_id",
        });
        await expect(promise).rejects.toThrow(
            new ResourceNotFoundError("User")
        );
    });
});
