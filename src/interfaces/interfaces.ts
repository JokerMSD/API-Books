import { AnyZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  bookArraySchema,
  bookCreateSchema,
  bookSchema,
  bookUpdateSchema,
} from "../schemas/books.schemas";

type Book = z.infer<typeof bookSchema>;

type CreateBook = z.infer<typeof bookCreateSchema>;

type UpdateBook = z.infer<typeof bookUpdateSchema>;

type BookArray = z.infer<typeof bookArraySchema>

interface RequestSchema {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
}


export interface ServiceInterface {
  execute(
    req: Request | undefined,
    res: Response | undefined,
    next: NextFunction | undefined,
    ): void | Response<any, Record<string, any>>;
  }
  
  export { Book, CreateBook, UpdateBook, BookArray, RequestSchema };