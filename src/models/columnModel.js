import Joi, { object } from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  // dòng này để xác thực dữ liệu ID
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().min(3).max(256).trim().strict(),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const validDataNew = {
      ...validData,
      boardId : new ObjectId(validData.boardId),
    }
    const createdColumn = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(validDataNew);
      // console.log(createdColumn)
    return createdColumn;
  } catch (error) {
    throw new Error(error);
  }
};

const getColumnDetails = async (id) => {
  const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  return column
};

const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB() .collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds : new ObjectId(card._id)} },
      { returnDocument: 'after' }
    )
    return result
  }catch (error) {
    throw new Error(error)
  }
}

const updateColumn = async (columnId, data) => {
  try {
    // Loại bỏ các trường không hợp lệ khỏi dữ liệu
    Object.keys(data).forEach(field => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete data[field];
      }
    });

    // Cập nhật cột trong cơ sở dữ liệu
    if(data.cardOrderIds) {
      data.cardOrderIds = data.cardOrderIds.map(id => new ObjectId(id))
    }
    //  console.log('check data update: ', data)
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $set: data },
        { returnDocument: 'after' }
      );

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteColumn = async (columnId) => {
  const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(columnId)})
  // console.log("🚀 ~ deleteColumn ~ result:", result)  
  return result;
};

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  getColumnDetails,
  pushCardOrderIds,
  updateColumn,
  deleteColumn
};
