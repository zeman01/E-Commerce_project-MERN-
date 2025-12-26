

export const errorHandler = ((error, req, res) => {
  const message = error?.message || "Something went wrong";


  // give proper status code
  const statusCode = error?.status || 500;
  const status= error?.status  || "server error "
  const success= error?.success  || false


  res.status(statusCode).json({
    message: message,
    status,
    success,
    data: null,
    originalError : process.env.NODE_ENV === 'development' ? error.stack : null
  });
});


class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.error_status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this, CustomError);
    }

}

export default CustomError;