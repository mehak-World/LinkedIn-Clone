const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Profile  = require("../models/Profile.js")
const {generate_token} = require("../utils/auth.js")

router.post("/sign-in", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // Find the user with the given email
  const user = await User.findOne({email});

  if (!user) {
    return res.send("The user is not found.");
  } else {
    // User is found, so match password.
    const result = await bcrypt.compare(password, user.password);
    
    if (result) {
      if(!user.profile){
          const newProfile = new Profile();
         
          await newProfile.save()
           user.profile = newProfile;
          await user.save();
      }
      const token = generate_token(user);
      res.send({
        message: "user has successfully signed-in",
        token,
        user,
      });
    }
    else{
      res.send("Incorrect password")
    }
  }
});

router.post("/sign-up", async (req, res) => {
  // This route signs up the user
  const { name, email, password } = req.body;
  console.log(req.body);
  const saltRounds = 10;
  try {
    // Try to find the user with existing credentials
    const user = await User.findOne({ email });
    if (user) {
      // If the user is already found, return
      return res.send("User has already been registered");
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store the user into the database, attach a profile with the user, generate token and send to frontend
      const new_user = new User({ email, username: name, password: hash });
      const newProfile = new Profile();
      await newProfile.save();
      new_user.profile = newProfile;
      await new_user.save();
      
      const token = generate_token(new_user);
      res.send({
        message: "user has been successfully registered",
        token,
        new_user,
      });
    });
  } catch (err) {
    return res.send("An error occured while registering user");
  }
});

// Used for sign in using Google
router.post("/google-signin", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    let user = await User.findOne({ email });

    // If user doesn't exist, create one
    if (!user) {
      const hash = await bcrypt.hash(password, 10);
      user = new User({ email, username: name, password: hash });
      const newProfile = new Profile();
      await newProfile.save();
      user.profile = newProfile;
      await user.save();
      
    }

    const token = generate_token(user);
    console.log(token)

    res.send({
      message: "User successfully signed in",
      token,
      user, // Send the actual user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred while registering user");
  }
});


module.exports = router;
