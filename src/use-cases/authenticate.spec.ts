import bcryptjs from "bcryptjs";
import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

type SutTypes = {
    usersRepositoryStub: UsersRepository;
    sut: AuthenticateUseCase;
};

const makeSut = (): SutTypes => {
    const usersRepositoryStub = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepositoryStub);
    return {
        usersRepositoryStub,
        sut,
    };
};

describe("Authenticate Use Case", () => {
    it("should be able to authenticate", async () => {
        const { sut, usersRepositoryStub } = makeSut();
        const password_hash = await bcryptjs.hash("any_password", 6);
        await usersRepositoryStub.create({
            name: "any_name",
            email: "any_email@mail.com",
            password_hash,
        });
        const { user } = await sut.execute({
            email: "any_email@mail.com",
            password: "any_password",
        });
        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate with wrong email", async () => {
        const { sut, usersRepositoryStub } = makeSut();
        const password_hash = await bcryptjs.hash("any_password", 6);
        await usersRepositoryStub.create({
            name: "any_name",
            email: "any_email@mail.com",
            password_hash,
        });
        const promise = sut.execute({
            email: "wrong_email@mail.com",
            password: "any_password",
        });
        await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should not be able to authenticate with wrong password", async () => {
        const { sut, usersRepositoryStub } = makeSut();
        const password_hash = await bcryptjs.hash("any_password", 6);
        await usersRepositoryStub.create({
            name: "any_name",
            email: "any_email@mail.com",
            password_hash,
        });
        const promise = sut.execute({
            email: "any_email@mail.com",
            password: "wrong_password",
        });
        await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
