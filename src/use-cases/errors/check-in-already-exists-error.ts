export class CheckInAlreadyExistsError extends Error {
    constructor() {
        super("Check-in with this date already exists.");
    }
}
