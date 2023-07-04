const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { cors } = require("./middleware/cors");

require("dotenv").config();
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(error => console.log("Connexion à MongoDB échouée !", error));

app.use(express.json());
app.use(cors);

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
