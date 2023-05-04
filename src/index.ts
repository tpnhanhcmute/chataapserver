import * as dotenv from "dotenv";
import express from "express";
import userRoute from "./route/user.router"
import commonRoute from "./route/common.router"
import messageRoutes from "./route/message.router";
import contactRoutes from "./route/contact.router";
dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
userRoute(app)
commonRoute(app)
messageRoutes(app)
contactRoutes(app)

app.get("/", (req, res) => {
  res.send("Hello world");
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });