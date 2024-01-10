import { Request, Response, NextFunction } from "express";
import { booksDatabase } from "../database/database";
import { ServiceInterface } from "../interfaces/interfaces";

export class Service implements ServiceInterface {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    throw new Error("Method not implemented.");
  }
}

export class errorHandler extends Service {
  static execute(err: Error, req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
    throw new Error("Method not implemented.");
  }
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    console.error(req, res, next);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export class CheckDuplicateBookName extends Service {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    const bookName = req.body.name;
    const existingBook = booksDatabase.find((book) => book.name === bookName);

    if (existingBook) {
      return res.status(409).json({ error: "Book already registered." });
    }

    next();
  }

  static getInstance(): CheckDuplicateBookName {
    return new CheckDuplicateBookName();
  }
}

export class CheckBookExistence extends Service {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    const id = Number(req.params.id);
    const bookExists = booksDatabase.some((book) => book.id === id);

    if (!bookExists) {
      return res.status(404).json({ error: "Book not found." });
    }

    next();
  }

  static getInstance(): CheckBookExistence {
    return new CheckBookExistence();
  }
}
