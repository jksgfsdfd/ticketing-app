import mongoose from "mongoose";
import { Password } from "../services/password";

// doc refers to a single document whereas model refers to the entire db.

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(userInitData: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// how are we able to use User inside this function if User is declared according to userSchema
userSchema.statics.build = (userInitData: UserAttrs) => {
  return new User(userInitData);
};

userSchema.pre("save", async function (done) {
  // we have to check whether the change is actually made in the password field itself.
  if (this.isModified("password")) {
    const rawPassword = this.get("password");
    const hashed = await Password.toHash(rawPassword);
    this.set("password", hashed);
  }

  done();
});

const User = mongoose.model<UserDoc, UserModel>("Users", userSchema);

export { User };
