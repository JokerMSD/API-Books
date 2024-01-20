import { BookController } from "../services/services";
import { Router } from "express";
import {
  CheckBookExistence,
  CheckDuplicateBookName,
  GlobalErrors,
} from "../middlewares/middleware";
import { bookCreateSchema, bookUpdateSchema } from "../schemas/books.schemas";

const router = Router();
const globalErrors = new GlobalErrors();

router.use("/books", CheckDuplicateBookName.getInstance().execute);

router.use("/books/:id", CheckBookExistence.getInstance().execute);



router.post("/books", globalErrors.validateBody(bookCreateSchema), BookController.createBook);

router.get('/books', BookController.getBooks);

router.get("/books/:id", BookController.getBookById);

router.patch("/books/:id",globalErrors.validateBody(bookUpdateSchema), BookController.updateBook);

router.delete("/books/:id", BookController.deleteBook);

export default router;
