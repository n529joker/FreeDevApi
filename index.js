require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const data_route = require("./routes/data_routes");
const { scrapeRoutine } = require("./routines/scrapedata");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(data_route);

app.use((req, res, next) => {
  res.status(404).json({ Error: "Page not found!" });
});

const { DB_PASS } = process.env;
const PORT = process.env.PORT || 4000

mongoose
  .connect(
    `mongodb+srv://rawlingsnsame:${DB_PASS}@cluster0.jcdv9gs.mongodb.net/FreeDev?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((connect) => {
    app.listen(PORT, () =>
      console.log(`Connected to http://localhost:${PORT} and live.`)
    );
  })
  .catch((err) => console.error(err.message));

scrapeRoutine();
