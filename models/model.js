const mongoose = require("mongoose");
const { isEmail } = require("validator");
const apikeygen = require("apikeygen");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
    required: true,
  },
  email: {
    type: String,
    maxlength: 100,
    unique: [true, "User with this email exists!"],
    validate: [isEmail, "Email is not valid"],
  },
  password: {
    type: String,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "contributor"],
    required: true,
  },
});

const ApiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});


const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imgSrc: {
    type: String,
    maxlength: 300,
    required: false,
    unique: false,
  },
  tag: {
    type: String,
    maxlength: 300,
  },
  link: {
    type: String,
    unique: true,
    maxlength: 200,
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  validated: {
    type: Boolean,
    default: false,
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
});

ItemSchema.index({ title: "text", description: "text", tag: "text" });

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    let auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password!");
  }
  throw Error("incorrect email!");
};

UserSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.post("save", async function (user, next) {
  let apikey = await apikeygen.apikey(32);
  let key = await ApiKeys.create({
    key: apikey,
    user: user._id,
  });
  key.save();
  next();
});

const User = mongoose.model("User", UserSchema);

const ApiKeys = mongoose.model("ApiKeys", ApiKeySchema);

const Item = mongoose.model("item", ItemSchema);

module.exports = {
  User,
  Item,
  ApiKeys,
};
