import { Request, Response, NextFunction } from "express";

export class MyObject {
  id: number;
  name: string;
  pages: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    name: string,
    pages: number,
    category: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.pages = pages;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export interface ServiceInterface {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>>;
}
