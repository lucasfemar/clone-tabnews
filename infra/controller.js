import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "infra/errors";

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.log(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMachHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
const controller = {
  errorHandlers: {
    onNoMatch: onNoMachHandler,
    onError: onErrorHandler,
  },
};

export default controller;
