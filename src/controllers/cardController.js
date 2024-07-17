import { StatusCodes } from "http-status-codes";
import { cardServices } from "~/services/cardService";

const createNew = async (req, res, next) => {
  try {
    const data = await cardServices.createNew(req.body);
    console.log(req.body);
    res.status(StatusCodes.CREATED).json(data);
  } catch (e) {
    next(e);
  }
};

export const cardController = {
  createNew,
  //   getDetails
};
