const AppError = require("../Utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/([""])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field: ${value}. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError("Invalid token. Please login again!", 401);
};

const handleJWTExpiredError = () => {
  new AppError(" your token has expired! please log in again", 401);
};

const sendErrorDev = (err, req, res) => {
    console.log(req.originalUrl)
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(200).render("Base", {
      title: "something went wrong",
      purpose: err.message,
    });
  }
  // B) RENDERED WEBS
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(200).render("base", {
      title: "something went wrong",
      purpose: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    console.log("development")
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log("production")
    let error = { ...err };
    error.message = err.message;
    if (error.name === "cast error") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
