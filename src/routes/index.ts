import express from "express";
import {Request} from "express";

interface PhoneValidityCheckRequest extends Request {
  body: { phone: string }
}

export const router = express.Router();

router.post("/create-otp", (req: PhoneValidityCheckRequest, res) => {
  const phone = req.body.phone;

  console.log(req.body);
  res.send("Hello World");
});