import {Request} from "express";

export interface MergeNameRequest extends Request {
  body: {
    name: string
  }
}