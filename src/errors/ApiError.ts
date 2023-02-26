export default class ApiError extends Error {
  constructor(public readonly status: number, public readonly message: string) {
    super();
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}
