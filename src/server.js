import express from "express";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cors from "cors";
import { env } from "./config/environment";

const START_SERVER = () => {
  const app = express();

  // xử lí cors : xử lí việc tên miền 1 có thể sử dụng dữ liệu của tên miền 2
  app.use(cors(corsOptions));

  // cho phép sử dụng dữ liệu dạng json
  app.use(express.json());

  // sử dụng router 1
  app.use("/v1", APIs_V1);

  //middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware);

  if ( env.BUILD_MODE === 'production' ) {
    // xử lí việc app sẽ chạy trên cổng nào và domain nào
    console.log('chạy vào production này')
    app.listen(process.env.PORT, () => {
      console.log(`Production Hello ${env.AUTHOR}, I am running at ${process.env.PORT}`);
    });
  } else {
    console.log('chạy vào dev này')
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `Dev Hello ${env.AUTHOR}, I am running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`
      );
    });
  }

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
