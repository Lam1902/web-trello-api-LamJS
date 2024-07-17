import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId, ReturnDocument } from "mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { BOARD_TYPES } from "~/utils/constants";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";

const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const validDataNew = {
      ...validData,
    }
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validDataNew);

    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (id) => {
  const board = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroy: false,
        },
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: "_id",
          foreignField: "boardId",
          as: "columns",
        },
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: "_id",
          foreignField: "boardId",
          as: "cards",
        },
      },
    ])
    .toArray();
    // console.log(board[0])
  return board[0] || null ;
};
 
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB() .collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds : new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result 
  }catch (error) {
    throw new Error(error)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB() .collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds : new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    console.log("🚀 ~ pullColumnOrderIds ~ result:", result)
    return result 
  }catch (error) {
    throw new Error(error)
  }
}

const updateBoard = async (boardId, data) => {
  try {
    Object.keys(data).forEach( fields => {
      if(INVALID_UPDATE_FIELDS.includes(fields)) {
        delete data[fields]
      }
    } )
    // console.log('check data: ', data)
    const result = await GET_DB() .collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result 
  }catch (error) {
    throw new Error(error)
  }
}


export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  getDetails,
  pushColumnOrderIds,
  updateBoard,
  pullColumnOrderIds
};
