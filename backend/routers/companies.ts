import express from "express";
import auth from "../middleware/auth";
import { imagesUpload } from "../multer";
import { CompanyWithoutId } from "../types";
import mongoose from "mongoose";
import permit from "../middleware/permit";
import Company from "../models/Company";
import Promotion from "../models/Promotion";
import promotionsRouter from "./promotions";

const companiesRouter = express.Router();

export default companiesRouter;

companiesRouter.get("/", async (req, res, next) => {
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Company.find().populate("categories");

    if (limit && page && limit !== "" && page !== "") {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([["createdAt", -1]]);

    const companies = await query.exec();
    return res.send(companies);
  } catch (e) {
    return next(e);
  }
});

companiesRouter.get("/category", async (req, res, next) => {
  const categoryId = req.query.categoryId;
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Company.find();

    if (categoryId && limit && page && limit !== "" && page !== "") {
      query = query.where("categories").equals(categoryId);
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([["createdAt", -1]]);

    const companies = await query.exec();
    return res.send(companies);
  } catch (e) {
    return next(e);
  }
});

companiesRouter.get("/search", async (req, res, next) => {
  const searchQuery = req.query.search;
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Company.find();

    if (searchQuery && limit && page && limit !== "" && page !== "") {
      query = query.or([
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ]);
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([["createdAt", -1]]);

    const companies = await query.exec();
    return res.send(companies);
  } catch (e) {
    return next(e);
  }
});

companiesRouter.get("/:id", async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "categories"
    );
    return res.send(company);
  } catch (e) {
    return next(e);
  }
});

companiesRouter.post(
  "/",
  auth,
  permit("admin"),
  imagesUpload.single("image"),
  async (req, res, next) => {
    console.log(req.body.categories);
    const categoryIds = req.body.categories
      .split(",")
      .map(
        (categoryId: string) => new mongoose.Types.ObjectId(categoryId.trim())
      );
    // const categoryIds = req.body.categories.split(",").map(categoryId => mongoose.Types.ObjectId(categoryId.trim()));
    const companyData: CompanyWithoutId = {
      categories: categoryIds,
      title: req.body.title,
      description: req.body.description ? req.body.description : null,
      createdAt: new Date(),
      image: req.file ? req.file.filename : null,
      link: req.body.link ? req.body.link : null,
    };

    const company = new Company(companyData);

    try {
      await company.save();
      return res.send(company);
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(e);
      } else {
        return next(e);
      }
    }
  }
);

companiesRouter.patch(
  "/:id",
  auth,
  permit("admin"),
  imagesUpload.single("image"),
  async (req, res, next) => {
    try {
      const categoryIds = req.body.categories
        .split(",")
        .map(
          (categoryId: string) => new mongoose.Types.ObjectId(categoryId.trim())
        );
      const company = await Company.findOne({ _id: req.params.id });
      if (company) {
        await Company.updateOne(
          { _id: company._id },
          {
            categories: categoryIds,
            title: req.body.title,
            description: req.body.description ? req.body.description : null,
            createdAt: new Date(),
            image: req.file ? req.file.filename : company.image,
            link: req.body.link ? req.body.link : null,
          }
        );
        const updatedCompany = await Company.findOne({
          _id: company._id,
        });
        return res.send(updatedCompany);
      }
    } catch (e) {
      return next(e);
    }
  }
);

companiesRouter.delete(
  "/:id",
  auth,
  permit("admin"),
  async (req, res, next) => {
    try {
      const company = await Company.findOne({ _id: req.params.id });
      if (company) {
        const promotions = await Promotion.find({ company: company._id });
        if (promotions.length > 0) {
          return res.send(
            "Компания не может быть удалена, так как есть привязанные к ней акции"
          );
        }
        await Company.deleteOne({ _id: company._id });
        return res.send("Company deleted");
      }
    } catch (e) {
      return next(e);
    }
  }
);
