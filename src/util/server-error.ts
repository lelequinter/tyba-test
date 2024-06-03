//* Custom error class which provides more information
export class ServerError extends Error {
  statusCode: number = 500;
  description: string = "Internal server error";
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
