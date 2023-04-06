const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

  try {
    if (!bearerHeader) {
      const error = new Error("مجوز کافی ندارید");
      error.statusCode = 401;
      throw error;
    }

    const token = bearerHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      const error = new Error("شما مجوز کافی ندارید !");
      error.statusCode = 401;
      throw error;
    }

    req.payload={}
    req.payload.userId = decodedToken.user.userId;
    next();
  } catch (err) {
    next(err);
  }
};
