export class OnlyOneCheckInPerDayAllowed extends Error {
  constructor() {
    super('Only one check-in per day is allowed.')
  }
}
