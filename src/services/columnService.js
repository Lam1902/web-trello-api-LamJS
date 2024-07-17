import { formatter } from "~/utils/formatter";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
      slug: formatter.slugify(reqBody.title),
    };

    const createdColumn = await columnModel.createNew(newColumn);
    
    // sau khi tạo xong column thì sẽ lấy column đó ném vào mảng columnId trong board
    const getNewColumn = await columnModel.getColumnDetails(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    console.error("Error creating new column:", error); // Ghi nhật ký lỗi
    throw new Error("Could not create new column, please try again later."); // Ném lỗi với thông báo cụ thể hơn
  }
};

// const getDetails = async (columnId) => {
//   try {

//     const board = await boardModel.getDetails(boardId)
//     if(!board) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
//     }

//     //clone lại data cho hợp lí với bên fe
//     const resBoard = cloneDeep(board)
//     resBoard.columns.forEach(column => {
//       column.cards = resBoard.cards.filter( card => card.columnId.toString() === column._id.toString() )
//     })

//     delete resBoard.cards

//     return resBoard
//   } catch (error) {
//     throw new Error("Could not find board, please try again later."); // Ném lỗi với thông báo cụ thể hơn
//    }
// }

const updateColumn = async (columnId, data) => {
  try {
    const newData = {
      ...data,
      updatedAt: Date.now()
    }
    const column = await columnModel.updateColumn(columnId, newData )
    return column
  } catch (error) { 
    throw new Error("Could not find column, please try again later."); // Ném lỗi với thông báo cụ thể hơn
   }
}

const deleteColumn = async (columnId) => {
  try {

    const column = await columnModel.getColumnDetails(columnId)
    if(!column)  {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
     await columnModel.deleteColumn(columnId)
     await cardModel.deleteCardByColumnId(columnId)
     await boardModel.pullColumnOrderIds(column)

    return {deleteResult : 'Delete column successfully'}
  } catch (error) { 
    throw new Error("Could not find column, please try again later."); // Ném lỗi với thông báo cụ thể hơn
   }
}

export const columnServices = {
  createNew,
  //   getDetails
  updateColumn,
  deleteColumn
};
