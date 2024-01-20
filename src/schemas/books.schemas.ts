import { z } from "zod";

const bookSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  pages: z.number().min(1),
  category: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const bookCreateSchema = bookSchema.pick({
  name: true,
  pages: true,
  category: true,
});

const bookUpdateSchema = bookCreateSchema.partial();

const bookArraySchema = bookSchema.array();

export { bookSchema, bookCreateSchema, bookUpdateSchema, bookArraySchema };
