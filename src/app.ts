import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { combinedRouter } from "./routes/combinedRouter";
import { errorMiddleware } from "./middleware/error";
import { initProcessErrorHandler } from "./errors/processErrorHandler";

const app = express();

initProcessErrorHandler();

app.use(helmet());
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

combinedRouter(app);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
