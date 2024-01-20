import { Request, Response, NextFunction } from "express";
import { booksDatabase } from "../database/database";
import { ServiceInterface } from "../interfaces/interfaces";
import { AppError } from "../errors/AppError";
import { AnyZodObject, Schema, ZodError } from "zod";

export class Service implements ServiceInterface {
  execute(
    req: Request | undefined,
    res: Response | undefined,
    next: NextFunction | undefined,
  ): void | Response<any, Record<string, any>> {
    throw new Error("Method not implemented.");
  }
}

export class GlobalErrors {
  handleErrors = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof ZodError) {
      return res.status(409).json(err);
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  validateBody = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.body = await schema.parseAsync(req.body);
        return next();
    };
  };
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
      throw new AppError(409, "Book already registered.");
    }

    return next();
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
      throw new AppError(404, "Book not found.");
    }

    return next();
  }

  static getInstance(): CheckBookExistence {
    return new CheckBookExistence();
  }
}
