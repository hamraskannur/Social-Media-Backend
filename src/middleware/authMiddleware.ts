const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

module.exports = async (req: Request, res: Response, next: NextFunction) => {    
  try {
    const authHeader = req.headers.authorization;
    interface ITokenPayload {
      iat: number;
      exp: number;
      id: string;
    }
    if (!authHeader) {
      return res.status(401).send({
        message: "auth failed",
        Status: false,
      });
    }
    const [, token] = authHeader.split(" ");
    jwt.verify(
      token,
      process.env.SECRET_TOKEN,
      (err: object | null, decoded: object | undefined) => {
        if (err) {    
          console.log(err);
                
          return res.send({
            message: "auth failed",
            Status: false,
          });
        } else {
          const { id } = decoded as ITokenPayload;
          req.body.userId = id;
          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
    
    return res.status(401).send({
      message: "auth failed",
      success: false,
    });
  }
};
