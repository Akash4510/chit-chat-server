import mongoose, { Document, Schema, InferSchemaType, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// Schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (val: string) {
          return String(val)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordChangedAt: { type: Date },
    socketId: { type: String },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['online', 'offline'],
    },
    lastOnline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Virtuals
userSchema.virtual('fullName').get(function (this: UserDocument) {
  return this.firstName + ' ' + this.lastName;
});

// Document Middleware
userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
  next();
});

// Methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Types
export type UserInput = InferSchemaType<typeof userSchema>;

export interface UserDocument extends UserInput, Document {
  fullName: string;
  comparePassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
}

// Create the model
const User = mongoose.model<UserDocument, Model<UserDocument>>(
  'User',
  userSchema
);

export default User;
