require("dotenv").config();
import express, { Request, Response } from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';
const app = express();

// App middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));


// Router files
app.use('/', routes);

app.get("/api/ping", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Pong",
  });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log("🚀Server started Successfully");
});