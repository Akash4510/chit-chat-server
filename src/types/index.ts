import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { UserDocument } from '../models/user.model';

export type RequestWithUser = Request & {
  // I copied this response type from the response of the getUser function in src/services/user.service.ts
  user?:
    | (Document<unknown, {}, UserDocument> &
        UserDocument & {
          _id: Types.ObjectId;
        })
    | null;
};
