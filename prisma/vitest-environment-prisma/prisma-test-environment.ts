import { Environment } from "vitest";

export default <Environment>(<unknown>{
    name: "prisma",
    async setup() {
        console.log("Setting up prisma test environment");
        return {
            async teardown() {
                console.log("Tearing down prisma test environment");
            },
        };
    },
    transformMode: "ssr",
});
