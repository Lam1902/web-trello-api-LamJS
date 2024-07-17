import { formatter } from "~/utils/formatter";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { columnModel } from "~/models/columnModel";

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
      slug: formatter.slugify(reqBody.title),
    };

    const createdCard = await cardModel.createNew(newCard);

    // sau khi tạo xong card thì sẽ lấy card đó ném vào mảng columnId trong board
    const NewCard = await cardModel.getCardDetails(createdCard.insertedId);

    if (NewCard) {
      await columnModel.pushCardOrderIds(NewCard);
    }

    return NewCard;
  } catch (error) {
    console.error("Error creating new card:", error); // Ghi nhật ký lỗi
    throw new Error("Could not create new card, please try again later."); // Ném lỗi với thông báo cụ thể hơn
  }
};

export const cardServices = {
  createNew,
  //   getDetails
};
