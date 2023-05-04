import * as dotenv from "dotenv";
import express from "express";
import userRoute from "./route/user.router"
import commonRoute from "./route/common.router"
dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
userRoute(app)
commonRoute(app)

app.get("/", (req, res) => {
  res.send("Hello world");
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });