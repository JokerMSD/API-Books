import { Router, Request, Response, NextFunction } from "express";
import { BookController } from "../app";
import {
  CheckBookExistence,
  CheckDuplicateBookName,
} from "../middlewares/middleware";

const router = Router();

router.get("/books", BookController.getAllBooks);

router.get(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    CheckBookExistence.getInstance().execute(req, res, next);
  },
  BookController.getBookById,
);

router.post(
  "/books",
  (req: Request, res: Response, next: NextFunction) => {
    CheckDuplicateBookName.getInstance().execute(req, res, next);
  },
  BookController.createBook,
);

router.patch(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    new CheckDuplicateBookName().execute(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    new CheckBookExistence().execute(req, res, next);
  },
  BookController.updateBook,
);

router.delete(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    new CheckBookExistence().execute(req, res, next);
  },
  BookController.deleteBook,
);

export default router;