export function successResponse(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }
  
  export function errorResponse(res, message, error = null, statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
  