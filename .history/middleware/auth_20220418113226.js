const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const token =
  //   req.body.token || req.query.password || req.headers["x-access-token"];

  // if (token != 'hellobob') {
  //   return res.status(403).send("A token is required for authentication");
  // }

  if (req.query.address) {
    if (req.query.password === "hellobob") {
      console.log(req.query.password);
      return next();
    } else {
      return res.status(401).send("Invalid password");
    }
  } else {
    return next();
  }
};

module.exports = verifyToken;