import express, { json, Request, Response, NextFunction } from "express";
import {
  CheckBookExistence,
  ErrorHandler,
  CheckDuplicateBookName,
} from "./middleware";
import { booksDatabase } from "./database/database";

class Book {
  id: number;
  name: string;
  pages: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: number, name: string, pages: number, category: string) {
    this.id = id;
    this.name = name;
    this.pages = pages;
    this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

class BookController {
  static idCounter: number = 1;

  static getAllBooks(req: Request, res: Response): Response {
    return res.status(200).json(booksDatabase);
  }

  static getBookById(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const book = booksDatabase.find((book) => book.id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    return res.status(200).json(book);
  }

  static createBook(req: Request, res: Response): Response {
    const newBook = new Book(
      BookController.idCounter++,
      req.body.name,
      req.body.pages,
      req.body.category,
    );

    booksDatabase.push(newBook);

    return res.status(201).json(newBook);
  }

  static updateBook(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const book = booksDatabase.find((book) => book.id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (req.body.pages !== undefined) {
      book.pages = req.body.pages;
    }

    book.updatedAt = new Date();

    return res.status(200).json(book);
  }

  static deleteBook(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const bookIndex = booksDatabase.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found." });
    }

    booksDatabase.splice(bookIndex, 1);

    return res.status(204).send();
  }
}

export const app = express();

app.use(json());

// Routes
app.get("/books", BookController.getAllBooks);

app.get(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    CheckBookExistence.getInstance().execute(req, res, next);
  },
  BookController.getBookById,
);

app.post(
  "/books",
  (req: Request, res: Response, next: NextFunction) => {
    CheckDuplicateBookName.getInstance().execute(req, res, next);
  },
  BookController.createBook,
);

app.patch(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    new CheckDuplicateBookName().execute(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    new CheckBookExistence().execute(req, res, next);
  },
  BookController.updateBook,
);

app.delete(
  "/books/:id",
  (req: Request, res: Response, next: NextFunction) => {
    new CheckBookExistence().execute(req, res, next);
  },
  BookController.deleteBook,
);
