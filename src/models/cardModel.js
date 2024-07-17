import Joi, { object } from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import { BOARD_TYPES } from "~/utils/constants";


const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  // dòng này để xác thực dữ liệu ID
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = ['_id','board_id', 'createdAt']


const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    let validData = await validateBeforeCreate(data);
    validData = {
      ...validData,
      boardId : new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(validData);

    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
};


const getCardDetails = async (id) => {
  const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: id })
  
  return card || null ;
};

const updateCard = async (cardId, data) => {
  try {
    Object.keys(data).forEach( fields => {
      if(INVALID_UPDATE_FIELDS.includes(fields)) {
        delete data[fields]
      }
    } )

    if(data.columnId) data.columnId = new ObjectId(data.columnId)
    // console.log('check data: ', data)
    const result = await GET_DB() .collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result 
  }catch (error) {
    throw new Error(error)
  }
}


const deleteCardByColumnId = async (columnId) => {
  const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
  // console.log("🚀 ~ deleteCardByColumnId ~ result:", result)
  
  return result ;
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  getCardDetails,
  updateCard,
  deleteCardByColumnId
};
