import { createRouter } from "next-connect";
import controler from "infra/controller.js";
import user from "models/user.js";
import activation from "models/activation.js";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controler.injectAnonymousOrUser);
router.post(controler.canRequest("create:user"), postHandler);

export default router.handler(controler.errorHandlers);

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  // 1. Criar o Token de ativação
  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:user",
    newUser,
  );

  return response.status(201).json(secureOutputValues);
}
