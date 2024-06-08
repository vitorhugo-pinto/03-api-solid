export class OnlyOneCheckInPerDayAllowedError extends Error {
  constructor() {
    super('Only one check-in per day is allowed.')
  }
}
