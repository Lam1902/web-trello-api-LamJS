import express from "express";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "~/config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cors from "cors";

const START_SERVER = () => {
  const app = express();

    // xử lí cors : xử lí việc tên miền 1 có thể sử dụng dữ liệu của tên miền 2
    app.use(cors(corsOptions))

  // cho phép sử dụng dữ liệu dạng json
  app.use(express.json());

  // sử dụng router 1
  app.use("/v1", APIs_V1);

  //middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware);

  // xử lí việc app sẽ chạy trên cổng nào và domain nào
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  //Thực hiện các tác vụ cleanup đóng mongodb
  exitHook(() => {
    console.log("4. Server is shutting down.....");
    CLOSE_DB();
    console.log("5. Disconnected from MongoDB");
  });
};

(async () => {
  try {
    await CONNECT_DB();
    console.log("3. Connected to MongoDB Atlas !!");
    console.log("4. check env", `${env.AUTHOR}`);
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Atlas !!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });
