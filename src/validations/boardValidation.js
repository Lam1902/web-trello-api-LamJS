import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctConditon = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
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


const updateBoard = async (req, res, next) => {
  const correctConditon = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
  });

  try {
    // console.log(req.body);
    await correctConditon.validateAsync(req.body, { abortEarly: false , allowUnknown: true});
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

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctConditon = Joi.object({
    cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).required(),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).required(),
  });

  try {
    // console.log(req.body);
    await correctConditon.validateAsync(req.body, { abortEarly: false});
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




export const boardValidation = {
  createNew,
  updateBoard,
  moveCardToDifferentColumn
};
