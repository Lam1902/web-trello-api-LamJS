import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctConditon = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(100).trim().strict()

  });

  try {
    console.log(req.body);
    await correctConditon.validateAsync(req.body, { abortEarly: false });
    
    //kiểm tra xong ở phần validation thì next đến phần controller để điều hướng
    next()
  } catch (e) {
    const errorMessage = new Error(e).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)

    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(e).message,
    });
  }
};

export const cardValidation = {
  createNew,
};
