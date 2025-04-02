import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import artistsRouter from "./routers/artists";
import albumsRouter from "./routers/albums";
import tracksRouter from "./routers/tracks";
import usersRouter from "./routers/users";
import tracksHistoryRouter from "./routers/tracksHistory";
import config from "./config";
import categoriesRouter from "./routers/categories";
import promotionsRouter from "./routers/promotions";
import companiesRouter from "./routers/companies";
import * as dotenv from "dotenv";
import removeExpiredPromotions from "./routers/promotionsCleanup";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use("/api/artists", artistsRouter);
app.use("/api/albums", albumsRouter);
app.use("/api/tracks", tracksRouter);
app.use("/api/users", usersRouter);
app.use("/api/track_history", tracksHistoryRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/promotions", promotionsRouter);
app.use("/api/companies", companiesRouter);

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.db);

  await removeExpiredPromotions();

  app.listen(config.port, () => {
    console.log("We are live on " + config.port);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
