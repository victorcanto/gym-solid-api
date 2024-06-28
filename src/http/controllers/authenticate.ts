import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/authenticate";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const registerUseCase = makeAuthenticateUseCase();
        await registerUseCase.execute({
            email,
            password,
        });
        return reply.status(201).send();
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(409).send({ message: err.message });
        }
        throw err;
    }
}
