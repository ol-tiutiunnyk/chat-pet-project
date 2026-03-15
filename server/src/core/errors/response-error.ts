export default class ResponseError extends Error {
  status: number;

  constructor(message: string = "Internal Server Error", status: number = 500) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ResponseError.prototype);
  }

  toResponseObject() {
    return {
      message: this.message,
      status: this.status
    };
  }
}
