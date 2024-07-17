import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { boardServices } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    const data = await boardServices.createNew(req.body);

    console.log(req.body);
    res.status(StatusCodes.CREATED).json(data);
  } catch (e) {
    next(e);
  }
};


const getDetails = async (req, res, next) => {
  try {
   const boardId = req.params.id
    // console.log(boardId);
    const board = await boardServices.getDetails(boardId)
    res.status(StatusCodes.CREATED).json(board);
  } catch (e) {
    next(e);
  }
};


const updateBoard = async (req, res, next) => {
  try {
   const boardId = req.params.id
    // console.log(boardId);
    const board = await boardServices.updateBoard(boardId, req.body)
    res.status(StatusCodes.CREATED).json(board);
  } catch (e) {
    next(e);
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const board = await boardServices.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.CREATED).json(board);
  } catch (e) {
    next(e);
  }
};


export const boardController = {
  createNew,getDetails, updateBoard, moveCardToDifferentColumn
};
