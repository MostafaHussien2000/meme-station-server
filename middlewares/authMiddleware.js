import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (accessToken == null)
    return res.status(401).json("You are not logged in!");

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);

      req.user = user;

      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default validateToken;
