import {Request} from "express";

export interface MergeNameRequest extends Request {
  body: {
    name: string
  }
}

export interface MergeEmailRequest extends Request {
  body: {
    email: string
  }
}