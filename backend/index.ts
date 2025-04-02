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
app.use("/artists", artistsRouter);
app.use("/albums", albumsRouter);
app.use("/tracks", tracksRouter);
app.use("/users", usersRouter);
app.use("/track_history", tracksHistoryRouter);
app.use("/categories", categoriesRouter);
app.use("/promotions", promotionsRouter);
app.use("/companies", companiesRouter);

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
