import express from "express";
import { getAllPaintings, getPaintingById } from "../controllers/paintings.js";

const router = express.Router();

router.get("/", getAllPaintings);

router.get("/:id", getPaintingById);

export default router;
