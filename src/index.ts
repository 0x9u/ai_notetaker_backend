import express from "express";
import "dotenv/config";
import notesRouter from "./routes/notes/router";
import categoriesRouter from "./routes/categories/router";
import tasksRouter from "./routes/tasks/router";
import middlewareAuth from "./middleware/auth";

const app = express();

app.use(middlewareAuth);
app.use(express.json());
app.use("/notes", notesRouter);
app.use("/categories", categoriesRouter);
app.use("/tasks", tasksRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
