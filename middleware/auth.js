require("dotenv").config();
var jwt = require("jsonwebtoken");
function authenToken(req, res, next) {
  if (req.headers["authorization"] == undefined) res.sendStatus(404);
  else {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) res.sendStatus(404);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err != null) {
        res.sendStatus(404);
        return;
      }
      next();
    });
  }
}
module.exports = authenToken;
