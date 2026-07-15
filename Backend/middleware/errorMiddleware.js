export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[${req.method}] ${req.originalUrl} — ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const response = {
    message: err.message || "Server error.",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  if (err.name === "ValidationError") {
    response.message = "Validation failed.";
    response.errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    response.message = `Duplicate value for ${field}.`;
  }

  if (err.name === "CastError") {
    response.message = `Invalid ${err.path}: ${err.value}.`;
  }

  res.status(statusCode).json(response);
};
