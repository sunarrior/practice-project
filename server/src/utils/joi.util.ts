import Joi from "joi";

const userAuthSchema = Joi.object({
  account: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
  fullName: Joi.string(),
  username: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
  email: Joi.string().pattern(/@/),
  password: Joi.string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&]).{8,}$/m
  ),
});

const authValidate = async (obj: {
  [index: string]: string;
}): Promise<{ [index: string]: string }> => {
  try {
    const result = await userAuthSchema.validateAsync(obj);
    return result.error
      ? { status: "failed", msg: result.error as unknown as string }
      : { status: "success", msg: "" };
  } catch (error: any) {
    if (error.details[0].context.key === "account") {
      return {
        status: "failed",
        msg: "account must be only username or email",
      };
    }
    if (error.details[0].context.key === "username") {
      return {
        status: "failed",
        msg: "username must contain only character and number",
      };
    }
    if (error.details[0].context.key === "email") {
      return {
        status: "failed",
        msg: "email is invalid",
      };
    }
    if (error.details[0].context.key === "password") {
      return {
        status: "failed",
        msg: "Password does not match requirement",
      };
    }
    return {};
  }
};

export { authValidate };
