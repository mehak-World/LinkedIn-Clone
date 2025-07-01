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

  try{
        const user_id = req.params.user_id;
  const user = await User.findById(user_id).populate("profile");
  const { about } = req.body;
  const p = user.profile;
  p.about = about;
  await p.save();
  user.profile = p
  await user.save();
  
  res.status(200).send("About section saved successfully.");
  }

  catch(err){
    res.status(500).send("An error occured while updating about section.")
  }

});

router.post("/:id/bio", async (req, res) => {
  
  const id = req.params.id;

  try{
 // Find the user with this id
  const user = await User.findById(id).populate("profile");
  const { title, city, country } = req.body;
    // Update the profile
    const p = user.profile;
    p.profileTitle = title;
    p.city = city;
    p.country = country;
    await p.save();
    user.profile = p;
    await user.save();
    res.status(200).send("Bio saved successfully");
  }
  catch(err){
res.status(500).send("an error occured");
  }
 
});

router.post("/:id/education", async (req, res) => {
  const id = req.params.id;

  try{
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

    const p = user.profile;
    await education.save();
    p.education.push(education);
    await p.save();
    user.profile = p;
    await user.save();


  res.status(200).send("education saved successfully");
  }

  catch(err){
    res.status(500).send("an error occured");
  }
 
});

router.post("/:id/experience", async (req, res) => {
  try{
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

  res.status(200).send("experience saved successfully");
  }
  catch(err){
    res.status(500).send("an error occured");
  }

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
  try{
       const result = await handleUpload(req.file.path);
  const id = req.params.user_id;
  const user = await User.findById(id).populate("profile");
    const p = user.profile;
    p.bgPic = result.secure_url;
    await p.save();
    user.profile = p;
    await user.save();
  
  res.send("bg pic saved successfully");
  }
  catch(err){
    res.status(500).send("an error occured");
  }
 
});

router.post(
  "/:user_id/profilePic",
  upload.single("image"),
  async (req, res) => {
    try{
const result = await handleUpload(req.file.path);
    const id = req.params.user_id;
    const user = await User.findById(id).populate("profile");
    
      const p = user.profile;
      p.profilePic = result.secure_url;
      await p.save();
      user.profile = p;
      await user.save();
    res.send("bg pic saved successfully");
    }
    catch(err){
      res.status(500).send("an error occured");
    }
  }
);

router.get("/:user_id/education/:education_id", async (req, res) => {
  try{
  const { education_id } = req.params;
  const education = await Education.findById(education_id);
  res.status(200).send(education);  
  }
  catch(err){
    res.status(500).send("an error occured");
  }
  
});

router.post("/:user_id/education/:education_id", async (req, res) => {
  try{
 const { user_id, education_id } = req.params;
  await Education.findByIdAndUpdate(education_id, req.body);
  res.status(200).send("Education updated successfully");
  }catch(err){
    res.status(500).send("an error occured");
  }
 
});

router.post("/:user_id/experience/:experience_id", async (req, res) => {
  try{
      const {experience_id } = req.params;
  await Experience.findByIdAndUpdate(experience_id, req.body);
  res.status(200).send("Experience updated successfully");
  }
  catch(err){
    res.status(500).send("an error occured");
  }
  
});

router.get("/:user_id/notifications", async (req, res) => {
  try{
 const user_id = req.params.user_id;
  const user = await User.findById(user_id).populate("profile");
  // Extract notifications:
  const notifications = user.profile.notifications;
  res.send(notifications);
  }
  catch(err){
    res.status(500).send("an error occured");
  }
 
})

router.post("/:user_id/experience/:exp_id/delete", async (req, res) => {
  try{
 const {user_id, exp_id} = req.params;
      const exp = await Experience.findByIdAndDelete(exp_id);
      const user  = await User.findById(user_id).populate("profile");
      user.profile.experience = user.profile.experience.filter((exp) => exp.toString() != exp_id);
      await user.profile.save();
      res.status(200).send("Experience deleted successfully")
  }
  catch(err){
    res.status(500).send("an error occured");
  }
 
})


router.post("/:user_id/education/:edu_id/delete", async (req, res) => {
  try{
      const {user_id, edu_id} = req.params;
      const edu = await Education.findByIdAndDelete(edu_id);
      const user  = await User.findById(user_id).populate("profile");
      user.profile.education = user.profile.education.filter((edu) => edu.toString() != edu_id);
      await user.profile.save();
      res.status(200).send("Education deleted successfully")
  }

  catch(err){
    res.status(500).send("an error occured");
  }
  
})

module.exports = router;
