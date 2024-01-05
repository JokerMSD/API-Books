import { Request, Response, NextFunction } from "express";
import { booksDatabase } from "./database/database";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> => {
  console.error(err.stack);
  return res.status(500).json({ error: "Internal Server Error" });
};

export const checkDuplicateBookName = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response<any, Record<string, any>> => {
  const bookName = req.body.name;
  const existingBook = booksDatabase.find((book) => book.name === bookName);

  if (existingBook) {
    return res.status(409).json({ error: "Book already registered." });
  }

  next();
};

export const checkBookExistence = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | void => {
  const id = Number(req.params.id);
  const bookExists = booksDatabase.some((book) => book.id === id);

  if (!bookExists) {
    return res.status(404).json({ error: "Book not found." });
  }

  next();
};
