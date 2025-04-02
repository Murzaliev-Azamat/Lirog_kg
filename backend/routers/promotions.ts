import express from "express";
import auth, { RequestWithUser } from "../middleware/auth";
import permit from "../middleware/permit";
import { imagesUpload } from "../multer";
import { PromotionWithoutId } from "../types";
import mongoose, { PipelineStage } from "mongoose";
import Promotion from "../models/Promotion";

const promotionsRouter = express.Router();

export default promotionsRouter;

promotionsRouter.get("/", async (req, res, next) => {
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Promotion.find().populate("company");

    if (limit && page && limit !== "" && page !== "") {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([
      ["isFresh", -1],
      ["isAlways", 1],
      ["rating", -1],
      ["createdAt", -1],
    ]);

    const promotions = await query.exec();
    return res.send(promotions);
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.get("/admin", async (req, res, next) => {
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Promotion.find().populate("company");

    if (limit && page && limit !== "" && page !== "") {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([["createdAt", -1]]);

    const promotions = await query.exec();
    return res.send(promotions);
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.get("/category", async (req, res, next) => {
  const categoryId = req.query.categoryId;
  const isBirthday = req.query.isBirthday;
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    const matchConditions: any = {};
    const aggregationPipeline: PipelineStage[] = [];

    if (categoryId) {
      matchConditions["companyCategories._id"] = new mongoose.Types.ObjectId(
        categoryId as string
      );
    }

    if (isBirthday) {
      matchConditions.isBirthday = true;
    }

    if (!categoryId && isBirthday) {
      matchConditions.isBirthday = true;
    }

    aggregationPipeline.push(
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyData",
        },
      },
      {
        $unwind: "$companyData",
      },
      {
        $lookup: {
          from: "categories",
          localField: "companyData.categories",
          foreignField: "_id",
          as: "companyCategories",
        },
      },
      {
        $match: matchConditions,
      },
      {
        $sort: {
          isFresh: -1,
          isAlways: 1,
          rating: -1,
          createdAt: -1,
        },
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      }
    );

    const promotions = await Promotion.aggregate(aggregationPipeline).exec();
    return res.send(promotions);
  } catch (e) {
    return next(e);
  }
});

// promotionsRouter.get("/category", async (req, res, next) => {
//   const categoryId = req.query.categoryId;
//   const isBirthday = req.query.isBirthday;
//   const limit = req.query.limit as string;
//   const page = req.query.page as string;
//
//   try {
//     if (
//       categoryId &&
//       !isBirthday &&
//       limit &&
//       page &&
//       limit !== "" &&
//       page !== ""
//     ) {
//       const skip = (parseInt(page) - 1) * parseInt(limit);
//       const aggregationPipeline: PipelineStage[] = [
//         {
//           $lookup: {
//             from: "companies",
//             localField: "company",
//             foreignField: "_id",
//             as: "company",
//           },
//         },
//         {
//           $unwind: "$company",
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "company.categories",
//             foreignField: "_id",
//             as: "company.categories",
//           },
//         },
//         {
//           $match: {
//             "company.categories._id": new mongoose.Types.ObjectId(
//               categoryId as string
//             ),
//           },
//         },
//         {
//           $sort: {
//             isFresh: -1,
//             isAlways: 1,
//             rating: -1,
//           },
//         },
//         {
//           $skip: skip,
//         },
//         {
//           $limit: parseInt(limit),
//         },
//       ];
//
//       const promotions = await Promotion.aggregate(aggregationPipeline).exec();
//       return res.send(promotions);
//     } else if (
//       categoryId &&
//       isBirthday &&
//       limit &&
//       page &&
//       limit !== "" &&
//       page !== ""
//     ) {
//       const skip = (parseInt(page) - 1) * parseInt(limit);
//       const aggregationPipeline: PipelineStage[] = [
//         {
//           $lookup: {
//             from: "companies",
//             localField: "company",
//             foreignField: "_id",
//             as: "company",
//           },
//         },
//         {
//           $unwind: "$company",
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "company.categories",
//             foreignField: "_id",
//             as: "company.categories",
//           },
//         },
//         {
//           $match: {
//             "company.categories._id": new mongoose.Types.ObjectId(
//               categoryId as string
//             ),
//             isBirthday: true,
//           },
//         },
//         {
//           $sort: {
//             isFresh: -1,
//             isAlways: 1,
//             rating: -1,
//           },
//         },
//         {
//           $skip: skip,
//         },
//         {
//           $limit: parseInt(limit),
//         },
//       ];
//
//       const promotions = await Promotion.aggregate(aggregationPipeline).exec();
//       return res.send(promotions);
//     } else if (
//       !categoryId &&
//       isBirthday &&
//       limit &&
//       page &&
//       limit !== "" &&
//       page !== ""
//     ) {
//       const skip = (parseInt(page) - 1) * parseInt(limit);
//       const aggregationPipeline: PipelineStage[] = [
//         {
//           $match: {
//             isBirthday: true,
//           },
//         },
//         {
//           $sort: {
//             isFresh: -1,
//             isAlways: 1,
//             rating: -1,
//           },
//         },
//         {
//           $skip: skip,
//         },
//         {
//           $limit: parseInt(limit),
//         },
//       ];
//
//       const promotions = await Promotion.aggregate(aggregationPipeline).exec();
//       return res.send(promotions);
//     }
//   } catch (e) {
//     return next(e);
//   }
// });

promotionsRouter.get("/search", async (req, res, next) => {
  const searchQuery = req.query.search;
  const limit = req.query.limit as string;
  const page = req.query.page as string;

  try {
    let query = Promotion.find().populate("company");

    if (searchQuery && limit && page && limit !== "" && page !== "") {
      query = query.or([
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ]);
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).skip(skip);
    }

    query = query.sort([
      ["isFresh", -1],
      ["isAlways", 1],
      ["rating", -1],
      ["createdAt", -1],
    ]);

    const promotions = await query.exec();
    return res.send(promotions);
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.get("/companyId/:id", async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ company: req.params.id });
    return res.send(promotions);
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.get("/:id", async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "company"
    );
    return res.send(promotion);
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.post(
  "/",
  auth,
  permit("admin"),
  imagesUpload.single("image"),
  async (req, res, next) => {
    console.log(req.body.isBirthday);
    const promotionData: PromotionWithoutId = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description ? req.body.description : null,
      image: req.file ? req.file.filename : null,
      isAlways: req.body.isAlways,
      createdAt: new Date(),
      startDate: req.body.startDate ? req.body.startDate : null,
      endDate: req.body.endDate ? req.body.endDate : null,
      isBirthday: req.body.isBirthday,
    };

    const promotion = new Promotion(promotionData);

    try {
      await promotion.save();
      return res.send(promotion);
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(e);
      } else {
        return next(e);
      }
    }
  }
);

promotionsRouter.patch(
  "/:id",
  auth,
  permit("admin"),
  imagesUpload.single("image"),
  async (req, res, next) => {
    try {
      const promotion = await Promotion.findOne({ _id: req.params.id });
      if (promotion) {
        await Promotion.updateOne(
          { _id: promotion._id },
          {
            title: req.body.title,
            company: req.body.company,
            description: req.body.description ? req.body.description : null,
            image: req.file ? req.file.filename : promotion.image,
            isAlways: req.body.isAlways,
            createdAt: new Date(),
            startDate: req.body.startDate ? req.body.startDate : null,
            endDate: req.body.endDate ? req.body.endDate : null,
            isBirthday: req.body.isBirthday,
          }
        );
        const updatedPromotion = await Promotion.findOne({
          _id: promotion._id,
        });
        return res.send(updatedPromotion);
      }
    } catch (e) {
      return next(e);
    }
  }
);

promotionsRouter.patch("/:id/toggleLike", auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const promotion = await Promotion.findOne({ _id: req.params.id });
    if (promotion) {
      const isUserLiked = promotion.userLikes.includes(user._id.toString());

      let updatedRating;
      let updatedUserLikes;

      if (isUserLiked) {
        updatedRating = promotion.rating - 1;
        updatedUserLikes = promotion.userLikes = promotion.userLikes.filter(
          (userId) => userId !== user._id.toString()
        );
      } else {
        updatedRating = promotion.rating + 1;
        updatedUserLikes = [...promotion.userLikes, user._id.toString()];
      }

      await Promotion.updateOne(
        { _id: promotion._id },
        {
          rating: updatedRating,
          userLikes: updatedUserLikes,
        }
      );

      const updatedPromotion = await Promotion.findOne({ _id: promotion._id });
      return res.send(updatedPromotion);
    }
  } catch (e) {
    return next(e);
  }
});

promotionsRouter.delete(
  "/:id",
  auth,
  permit("admin"),
  async (req, res, next) => {
    try {
      const promotion = await Promotion.findOne({ _id: req.params.id });
      if (promotion) {
        await Promotion.deleteOne({ _id: promotion._id });
        return res.send("Promotion deleted");
      }
    } catch (e) {
      return next(e);
    }
  }
);
