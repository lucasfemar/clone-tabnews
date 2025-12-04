import controler from "infra/controller";
import authentication from "models/authentication.js";
import session from "models/session.js";
import { createRouter } from "next-connect";

const router = createRouter();
router.post(postHandler);

export default router.handler(controler.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  controler.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
