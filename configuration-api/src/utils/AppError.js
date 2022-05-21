module.exports = class AppError extends Error {
    constructor(status, message, internal = false) {
        super(message);

        this.status = status;
        this.internal = internal;

        Error.captureStackTrace(this, this.constructor);
    }
};