// // IMPORTS:
// const path = require("path");
// const passportService = require("./services/passport");
// const passport = require("passport");

// const userRoutes = require("./user-routes");

const routes = [
  {
    name: '/users',
    middleware: './user-routes',
  },
];

module.exports = app => {
  routes.forEach(route => {
    app.use(route.name, require(route.middleware));
  });
};

// MIDDLEWARE:
// const requireAuth = passport.authenticate("jwt", { session: false });

//   // Dashboard Controller Routes
//   app.get("/dashboard", requireAuth, dashboardController.dashboard);
// };
