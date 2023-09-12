const { User, ApiKeys } = require("../models/model");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { name: "", email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "A user with that email already exists!";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("email")) {
    errors.email = err.message;
  }

  if (err.message.includes("password")) {
    errors.email = err.message;
  }

  return errors;
};

const maxAge = 2 * 24 * 60 * 60;

module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;
  let role = "contributor";

  try {
    let user = await User.create({ name, email, password, role });
    let payload = {
      id: user._id,
      role: user.role,
    };
    let token = jwt.sign(payload, process.env.SECRET, { expiresIn: maxAge });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "strict",
    });
    let key = await ApiKeys.findOne({ user:user._id }, {key: 1});
    res.status(201).json({ user: user._id, key: key });
  } catch (err) {
    console.log(err)
    let errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};


