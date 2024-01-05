import express, { json, Request, Response, NextFunction } from "express";
import { Object } from "./interfaces";
import { booksDatabase } from "./database/database";
import {
  checkDuplicateBookName,
  errorHandler,
  checkBookExistence,
} from "./middleware";

export const app = express();

app.use(json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

console.log(booksDatabase);

let id: number = 1;

//POST

app.post(
  "/books",
  checkDuplicateBookName,
  (req: Request, res: Response): Response => {
    const newObject: Object = {
      id: id++,
      name: req.body.name,
      pages: req.body.pages,
      category: req.body.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    booksDatabase.push(newObject);

    return res.status(201).json(newObject);
  },
);

//GET

app.get("/books", (req: Request, res: Response): Response => {
  return res.status(200).json(booksDatabase);
});

//GET BY ID

app.get(
  "/books/:id",
  checkBookExistence,
  (req: Request, res: Response): Response => {
    const id = Number(req.params.id);
    const bookIndex = booksDatabase.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found." });
    }

    const book = booksDatabase[bookIndex];
    return res.status(200).json(book);
  },
);

//PATCH

app.patch(
  "/books/:id",
  checkDuplicateBookName,
  checkBookExistence,
  (req: Request, res: Response): Response => {
    const id = Number(req.params.id);
    const bookIndex = booksDatabase.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found." });
    }

    booksDatabase[bookIndex] = {
      ...booksDatabase[bookIndex],
      ...req.body,
    };

    return res.status(200).json(booksDatabase[bookIndex]);
  },
);

//DELETE

app.delete(
  "/books/:id",
  checkBookExistence,
  (req: Request, res: Response): Response => {
    const id = Number(req.params.id);
    const book = booksDatabase.findIndex((book) => book.id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    booksDatabase.splice(book, 1);

    return res.status(204).send();
  },
);
