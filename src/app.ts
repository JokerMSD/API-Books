import express, { json, Request, Response, NextFunction } from "express";
import { booksDatabase } from "./database/database";
import {
  checkDuplicateBookName,
  errorHandler,
  checkBookExistence,
} from "./middleware";

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
      req.body.category
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Routes
app.get("/books", BookController.getAllBooks);
app.get("/books/:id", checkBookExistence, BookController.getBookById);
app.post("/books", checkDuplicateBookName, BookController.createBook);
app.patch("/books/:id", checkDuplicateBookName, checkBookExistence, BookController.updateBook);
app.delete("/books/:id", checkBookExistence, BookController.deleteBook);
