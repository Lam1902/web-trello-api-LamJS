import { formatter } from "~/utils/formatter";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: formatter.slugify(reqBody.title),
    };

    const createdBoard = await boardModel.createNew(newBoard);
    return createdBoard;
  } catch (error) {
    console.error("Error creating new board:", error); // Ghi nhật ký lỗi
    throw new Error("Could not create new board, please try again later."); // Ném lỗi với thông báo cụ thể hơn
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    //clone lại data cho hợp lí với bên fe
    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      );
    });

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw new Error("Could not find board, please try again later."); // Ném lỗi với thông báo cụ thể hơn
  }
};

const updateBoard = async (boardId, data) => {
  try {
    const newData = {
      ...data,
      updatedAt: Date.now(),
    };
    const board = await boardModel.updateBoard(boardId, newData);
    return board;
  } catch (error) {
    throw new Error("Could not find board, please try again later."); // Ném lỗi với thông báo cụ thể hơn
  }
};

const moveCardToDifferentColumn = async (data) => {
  try {
    const now = Date.now();
    // Update the previous column's card order
    const res1=await columnModel.updateColumn(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: now,
    });

    // Update the next column's card order
    const res2=await columnModel.updateColumn(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: now,
    });
    // Update the card's column reference
    const dataUpdateCard = {
      columnId: data.nextColumnId,
      updatedAt: now
    }
    await cardModel.updateCard(data.cardId, dataUpdateCard);

    return { message: "success" };
  } catch (error) {
    throw new Error(error)
  }
};

export const boardServices = {
  createNew,
  getDetails,
  updateBoard,
  moveCardToDifferentColumn,
};
