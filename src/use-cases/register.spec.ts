import bcryptjs from "bcryptjs";
import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

type SutTypes = {
    usersRepositoryStub: UsersRepository;
    sut: RegisterUseCase;
};

const makeSut = (): SutTypes => {
    const usersRepositoryStub = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepositoryStub);
    return {
        usersRepositoryStub,
        sut,
    };
};

describe("Register Use Case", () => {
    it("should be able to register", async () => {
        const { sut } = makeSut();
        const { user } = await sut.execute({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        });
        expect(user.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
        const { sut } = makeSut();
        const { user } = await sut.execute({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        });

        const isPasswordCorrectlyHashed = await bcryptjs.compare(
            "any_password",
            user.password_hash
        );
        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice", async () => {
        const { sut } = makeSut();
        sut.execute({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        });  

        const promise = sut.execute({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        });

        await expect(promise).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
