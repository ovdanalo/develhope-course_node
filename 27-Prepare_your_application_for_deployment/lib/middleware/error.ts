import { STATUS_CODES } from 'node:http';
import { Response, RequestHandler, ErrorRequestHandler} from 'express';

interface HttpError extends Error {
    status?: number;
    statusCode?: number;
}

function getErrorMessage(error: Error) {
    if (error.stack) {
        return error.stack;
    }

    if (typeof error.toString === "function") {
        return error.toString()
    }

    return "";
}

function isErrorStatusCode(statusCode: number) {
    return statusCode >= 400 && statusCode < 600;
}

function getHttpStatusCode (error: HttpError, res: Response) {
    const statusCodeFromError = error.status || error.statusCode;
    if (statusCodeFromError && isErrorStatusCode(statusCodeFromError)) {
        return statusCodeFromError;
    }

    const statusCodeFromResponse = res.statusCode;
    if (isErrorStatusCode(statusCodeFromResponse)){
        return statusCodeFromResponse;
    }

    return 500;
}

export const notFoundMiddleware: RequestHandler = (
    req,
    res,
    next
) => {
    res.status(404);
    next(`Cannot ${req.method} ${req.path}`)
}

export function initErrorMiddleware(
    appEnvironment: string
): ErrorRequestHandler {
    return function errorMiddleware(error, req, res, next) {
        const errorMessage = getErrorMessage(error);

        if (appEnvironment !== "test") {
            console.error(errorMessage);
        }

        if (res.headersSent){
            return next(error)
        }

        const statusCode = getHttpStatusCode(error, res);

        const errorResponse = {
            statusCode,
            error: STATUS_CODES[statusCode + ""],
            message: ""
        }

        if (appEnvironment !== "production") {
            errorResponse.message = errorMessage;
        }

        res.status(errorResponse.statusCode).json(errorResponse);

        next();
    }
}
