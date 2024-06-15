export class CheckInValidationExpiredError extends Error {
  constructor() {
    super('Time to validate check-in has expired.')
  }
}
