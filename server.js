const express = require("express");
const sessions = require("express-session");
const handlebars = require("express-handlebars");
const connectionSequelize = require("./config/connection.js");
const SequelizeStore = require("connect-session-sequelize")(sessions.Store);
const helpers = require("./utils/helpers.js");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = handlebars.create({ helpers });

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: connectionSequelize,
  }),
};

app.use(sessions(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./controllers/"));

connectionSequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
