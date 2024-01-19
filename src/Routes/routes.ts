import { BookController } from "../services/services";
import { Router } from "express";
import {
  CheckBookExistence,
  CheckDuplicateBookName,
} from "../middlewares/middleware";

const router = Router();

router.use("/books", CheckDuplicateBookName.getInstance().execute)

router.use("/books/:id", CheckBookExistence.getInstance().execute)



router.get("/", BookController.getAllBooks);

router.get("/books/:id", BookController.getBookById);

router.post("/books", BookController.createBook,);

router.patch("/books/:id", BookController.updateBook,);

router.delete("/books/:id", BookController.deleteBook,);

export default router;
