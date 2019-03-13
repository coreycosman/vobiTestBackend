const routes = [
  {
    name: "/users",
    middleware: "./user-routes"
  },
  {
    name: "/posts",
    middleware: "./post-routes"
  },
  {
    name: "/comments",
    middleware: "./comment-routes"
  }
];

module.exports = app => {
  routes.forEach(route => {
    app.use(route.name, require(route.middleware));
  });
};
