/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "@/routes/api/index.routes";
import webRoutes from "@/routes/web/index.routes";
import shortUrlRoutes from "@/routes/api/shortUrl.routes";
import { checkDb } from "@/config/db";
dotenv.config();

import cookieParser from "cookie-parser";

const app = express()

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));
app.use(cookieParser());

app.use(cors());

app.use(express.json());
const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("PORT is not defined");
}
//rutas de la API
app.use("/api", apiRoutes);

// direccionamiento del acortador
app.get("/:shortUrl", shortUrlRoutes);

// rutas de la web
app.use("/", webRoutes);

checkDb();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
