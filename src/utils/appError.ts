class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    // Maintain proper stack trace (only in V8 engines like Chrome/Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly (needed when extending built-ins)
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // Optional: Factory methods for common errors
  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, 404);
  }

  static internalError(message: string = 'Internal server error') {
    return new AppError(message, 500, false); // Non-operational by default
  }
}

export default AppError;
