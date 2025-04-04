const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log("req headers", req.headers.authorization); //Bearer asddasd12321.asdasdasd.asdasdasd
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verified token ", verifiedToken);
    req.body.userId = verifiedToken.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ success: false, message: "Token is not valid" });
  }
};

module.exports = auth;
