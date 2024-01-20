import { Request, Response } from "express";
import { booksDatabase } from "../database/database";
import { Book } from "../interfaces/interfaces";

export class BookClass implements Book {
  id: number;
  name: string;
  pages: number;
  category: string | undefined;
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

export class BookController {
  static idCounter: number = 1;

  static getBooks(req: Request, res: Response): Response {
    let matchingBooks = booksDatabase;

    if (typeof req.query.search === "string") {   
        const searchedBook: string = req.query.search.toLowerCase();
        
        matchingBooks = booksDatabase.filter((book) => {
          return book.name.toLowerCase().includes(searchedBook);
        })
    }

    return res.status(200).json(matchingBooks);
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
    const newBook = new BookClass(
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

export default BookController;
