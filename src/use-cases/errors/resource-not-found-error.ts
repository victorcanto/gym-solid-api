export class ResourceNotFoundError extends Error {
    constructor(resourceName: string) {
        super(`Resource ${resourceName} not found`);
    }
}
