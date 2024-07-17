import express from "express";
import { StatusCodes } from "http-status-codes";
import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";

const Router = express.Router();

Router.route("/").post(columnValidation.createNew, columnController.createNew);

Router.route("/:id")
    .put(columnValidation.updateColumn,columnController.updateColumn)
    .delete(columnValidation.deleteColumn,columnController.deleteColumn)


export const columnRoute = Router;
