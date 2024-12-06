const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const os = require("os");
const ip = require("ip");

const getWifiIP = () => {
  const interfaces = os.networkInterfaces();
  return (
    (interfaces["Wi-Fi"] &&
      interfaces["Wi-Fi"].find((i) => i.family === "IPv4")?.address) ||
    ip.address()
  );
};

const port = 3000;

const url =
  "mongodb+srv://sixteentech6:gQw8ZuVGY6Opr1Rk@cluster0.fgdzale.mongodb.net/badui";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  try {
    await mongoose.connect(url);
    const iplocal = getWifiIP();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Votre serveur est disponible sur http://${iplocal}:${port}`);
    });
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error);
  }
})();

const usershema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    nickname: {
      type: String,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
  },
  { collection: "user " },
);

const usermodel = mongoose.model("user", usershema);
module.exports = { usermodel };

app.post("/addusers", async (req, res) => {
  const { name, nickname, email, phone } = req.body;
  try {
    const newusers = new usermodel({ name, nickname, email, phone });

    await newusers.save();
    console.log("Utilisateur ajouté à la base de données");

    res
      .status(201)
      .send({ message: "Utilisateur ajouté à la base de données", newusers });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);

    res.status(500).send("Erreur interne lors de l'envoi");
  }
});
