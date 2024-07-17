import { StatusCodes } from "http-status-codes";
import { columnServices } from "~/services/columnService";

const createNew = async (req, res, next) => {
  try {
    const data = await columnServices.createNew(req.body);
    console.log(req.body);
    res.status(StatusCodes.CREATED).json(data);
  } catch (e) {
    next(e);
  }
};

const updateColumn = async (req, res, next) => {
  try {
   const columnId = req.params.id
    // console.log(boardId);
    const board = await columnServices.updateColumn(columnId, req.body)
    res.status(StatusCodes.CREATED).json(board);
  } catch (e) {
    next(e);
  }
};


const deleteColumn = async (req, res, next) => {
  try {
    const board = await columnServices.deleteColumn(req.params.id)
    res.status(StatusCodes.CREATED).json(board);
  } catch (e) {
    next(e);
  }
};


export const columnController = {
  createNew,
//   getDetails
updateColumn,
deleteColumn
};
