/* -------------------------------------------------------------------------- */
/*                               Express Server                               */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");
const session = require("cookie-session");
const authentication = require("./src/middlewares/sessionAtuhentication.js");
const cors = require("cors");
const path = require("path");

/* ----------------------------------- app ---------------------------------- */
const app = express();

/* ------------------------------ DB CONNECTION ----------------------------- */
require("./src/config/dbConnection")();

/* ------------------------------- Middlewares ------------------------------ */
app.use(express.json());
//cors mw

app.use(
  cors(
    // {
    //   origin: "https://movielist-cookie-auth-frontend.vercel.app", // Ensure this matches exactly
    //   credentials: true, // Allow credentials (cookies)
    // }
    {
    // origin: 'https://movielist-cookie-auth-frontend.vercel.app/',// React uygulamanızın çalıştığı adres
    // origin: 'https://movielist-cookie-auth-frontend.vercel.app',// React uygulamanızın çalıştığı adres
    origin: 'http://localhost:3000',// React uygulamanızın çalıştığı adres
    credentials: true, // Çerezlerin paylaşılmasına izin verir
    }
  )
);
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://movielist-cookie-auth-frontend.vercel.app"
//   ); // Ensure this matches exactly
//   res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // Allow HTTP methods
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization,Origin, X-Requested-With, Accept,X-PINGOTHER"); // Allow headers

  // next();
  // res.header("Access-Control-Allow-Origin", "https://movielist-cookie-auth-frontend.vercel.app/"); // React uygulamanızın adresi
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // React uygulamanızın adresi
  // res.header("Access-Control-Allow-Credentials", "true"); // Çerezlerin gönderilmesine izin verir
//   next();
// });

//Cookie Sessions middleware
// app.use(
//   session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // HTTPS kullanıyorsanız true yapmalısınız
//       maxAge: 10 * 1000, // Çerezin geçerlilik süresi (1 gün)
//     },
//   })
// );

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production
      // domain: "movielist-cookie-auth-frontend.vercel.app", // Domain without 'https://'
      sameSite: "lax",
      // secret: process.env.SECRET_KEY,
      // resave: false,
      // saveUninitialized: false,
      // cookie: {
      //   // httpOnly: true,
      //   // secure: true, // Set to true in production
      //   // sameSite: 'none',
      //   secure: true, // Set to true in production for HTTPS
      //   domain: 'https://movielist-cookie-auth-frontend.vercel.app', // Match frontend URL
      //   sameSite: 'lax',
      // secure: true, // HTTPS için gerekli
      // domain: 'https://movielist-cookie-auth-frontend.vercel.app', // Canlı URL'nizle eşleştirin
      // sameSite: 'lax'
    },
  })
);

/* --------------------------------- Swagger -------------------------------- */

const SwDoc = swaggerDoc(require("./src/config/swaggerOptions.json"));
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(SwDoc));
app.use(
  "/swagger",
  express.static(path.join(__dirname, "node_modules", "swagger-ui-dist"))
);

/* --------------------------------- Routes --------------------------------- */
app.all("/", (req, res) => {
  res.send({
    message: "Welcome to the movie tracker list api!",
    sessions: req.session,
    sessionOpt: req.sessionOptions,
  });
});

app.use("/movies", authentication, require("./src/routers/moviesRouter"));
app.use("/users", require("./src/routers/userRouter"));
app.use("/auth", require("./src/routers/authRouter.js"));

/* ------------------------------ error handler ----------------------------- */
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------ x ----------------------------------- */
/* ----------------------------- Port and Listen ---------------------------- */
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is runnging on :", PORT));
