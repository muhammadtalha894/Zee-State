import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, 'name is already exist'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'try another email '],
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/003/543/351/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    const salt = await bcrypt.genSalt(10);
    if (!user.isModified('password')) next();

    const password = await bcrypt.hash(user.password, salt);
    user.password = password;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.tokenGenerate = async function (Id) {
  const id = Id.toString();

  const token = jwt.sign({ id }, process.env.JSON_SECRET_KEY);

  return token;
};
userSchema.methods.generatePassword = function () {
  const password =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

  return password;
};

const User = mongoose.model('User', userSchema);
export default User;
