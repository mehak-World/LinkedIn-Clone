const express = require("express");
const User = require("../models/User");
const router = express.Router();
const Profile = require("../models/Profile");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const multer = require("multer");
const { handleUpload } = require("../utils/cloudinary_config.js");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

// Update About section
router.post("/:user_id/about", async (req, res) => {
  const user_id = req.params.user_id;
  const user = await User.findById(user_id).populate("profile");
  const { about } = req.body;

  if (user.profile) {
    // Update the existing profile
    let p = user.profile;
    p.about = about;
    await p.save();
    user.profile = p;
    await user.save();
  } else {
    // Create a new profile
    const profile = new Profile({ about });
    await profile.save();
    user.profile = profile;
    await user.save();
  }

  res.status(200).send("About section saved successfully.");
});

router.post("/:id/bio", async (req, res) => {
  const id = req.params.id;

  // Find the user with this id
  const user = await User.findById(id).populate("profile");
  const { title, city, country } = req.body;

  if (user.profile) {
    // Update the profile
    const p = user.profile;
    p.profileTitle = title;
    p.city = city;
    p.country = country;
    await p.save();
    user.profile = p;
    await user.save();
  } else {
    // Create a new profile for the user with this info
    const profile = new Profile({ profileTitle: title, city, country });
    await profile.save();
    user.profile = profile;
    await user.save();
  }

  res.status(200).send("Bio saved successfully");
});

router.post("/:id/education", async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id).populate("profile");
  const {
    school,
    startDate,
    endDate,
    currentlyStudying,
    fieldOfStudy,
    description,
    city,
    country,
  } = req.body;

  const education = new Education({
    school,
    startDate,
    endDate,
    current: currentlyStudying,
    fieldOfStudy,
    description,
    city,
    country,
  });
  if (user.profile) {
    console.log(currentlyStudying);
    const p = user.profile;

    await education.save();
    p.education.push(education);
    await p.save();
    user.profile = p;
    await user.save();
  } else {
    const p = new Profile();
    p.education.push(education);
    await p.save();
    user.profile = p;
    await user.save();
  }

  res.status(200).send("education saved successfully");
});

router.post("/:id/experience", async (req, res) => {
  const {
    position,
    company,
    city,
    country,
    startDate,
    endDate,
    description,
    current,
  } = req.body;
  const userId = req.params.id;
  const user = await User.findById(userId).populate("profile");

  if (user.profile) {
    const p = user.profile;
    const exp = new Experience({
      position,
      company,
      city,
      country,
      startDate,
      endDate,
      description,
      current,
    });
    await exp.save();
    p.experience.push(exp);
    await p.save();
    user.profile = p;
    await user.save();
  } else {
    const p = new Profile();
    p.experience.push(exp);
    await p.save();
    user.profile = p;
    await user.save();
  }

  res.status(200).send("experience saved successfully");
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate({
      path: "profile",
      populate: [{ path: "education" }, { path: "experience" }],
    });

    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


router.post("/:user_id/bgImage", upload.single("image"), async (req, res) => {
  const result = await handleUpload(req.file.path);
  console.log(result);
  const id = req.params.user_id;
  const user = await User.findById(id).populate("profile");
  if (user.profile) {
    const p = user.profile;
    p.bgPic = result.secure_url;
    await p.save();
    user.profile = p;
    await user.save();
  } else {
    const p = new Profile();
    p.bgPic = result.secure_url;
    await p.save();
    user.profile = p;
    await user.save();
  }
  res.send("bg pic saved successfully");
});

router.post(
  "/:user_id/profilePic",
  upload.single("image"),
  async (req, res) => {
    const result = await handleUpload(req.file.path);
    console.log(result);
    const id = req.params.user_id;
    const user = await User.findById(id).populate("profile");
    if (user.profile) {
      const p = user.profile;
      p.profilePic = result.secure_url;
      await p.save();
      user.profile = p;
      await user.save();
    } else {
      const p = new Profile();
      p.profilePic = result.secure_url;
      await p.save();
      user.profile = p;
      await user.save();
    }

    res.send("bg pic saved successfully");
  }
);

router.get("/:user_id/education/:education_id", async (req, res) => {
  const { education_id } = req.params;
  const education = await Education.findById(education_id);
  res.status(200).send(education);
});

router.post("/:user_id/education/:education_id", async (req, res) => {
  const { user_id, education_id } = req.params;
  await Education.findByIdAndUpdate(education_id, req.body);
  res.status(200).send("Education updated successfully");
});

router.post("/:user_id/experience/:experience_id", async (req, res) => {
  const { user_id, experience_id } = req.params;
  await Experience.findByIdAndUpdate(experience_id, req.body);
  res.status(200).send("Experience updated successfully");
});

router.get("/:user_id/notifications", async (req, res) => {
  const user_id = req.params.user_id;
  const user = await User.findById(user_id).populate("profile");
  if(!user.profile){
    user.profile = new Profile();
  }
  // Extract notifications:
  const notifications = user.profile.notifications;
  res.send(notifications);
})

router.post("/:user_id/experience/:exp_id/delete", async (req, res) => {
  const {user_id, exp_id} = req.params;
  console.log(user_id, exp_id)
      const exp = await Experience.findByIdAndDelete(exp_id);
      const user  = await User.findById(user_id).populate("profile");
      user.profile.experience = user.profile.experience.filter((exp) => exp.toString() != exp_id);
      await user.profile.save();
      res.status(200).send("Experience deleted successfully")
})


router.post("/:user_id/education/:edu_id/delete", async (req, res) => {
  const {user_id, edu_id} = req.params;
      const edu = await Education.findByIdAndDelete(edu_id);
      const user  = await User.findById(user_id).populate("profile");
      user.profile.education = user.profile.education.filter((edu) => edu.toString() != edu_id);
      await user.profile.save();
      res.status(200).send("Education deleted successfully")
})

module.exports = router;
