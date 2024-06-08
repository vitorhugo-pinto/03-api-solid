export class OutOfRangeError extends Error {
  constructor() {
    super('User is out of max range from the gym.')
  }
}
