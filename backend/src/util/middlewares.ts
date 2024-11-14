import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyLoggedUser(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json("no token present in the header");
  }
  
  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, decoded: any) => {
    if (err) {
      console.log(err);
      return res.status(403).json(err);
    }
    req.user = decoded;
    next();
  });
}

export function verifyAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json("no token present in the header");
  }
  
  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, decoded: any) => {
    if (err) {
      console.log(err);
      return res.status(403).json(err);
    }
    if (!decoded.isAdmin) {
      return res.status(401).json("you need admin privileges");
    }
    req.user = decoded;
    next();
  });
}
