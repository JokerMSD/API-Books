import express, { json, Request, Response, NextFunction } from "express";
import routes from "./Routes/routes";
import { errorHandler } from "./middlewares/middleware";

export const app = express();

app.use(json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.execute(err, req, res, next);
});

app.use(routes);
