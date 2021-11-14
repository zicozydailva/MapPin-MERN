const router = require("express").Router()
const User = require("../models/User");
const bcrypt = require("bcryptjs")


router.post("/register", async (req, res) => {
  try {
    const newUser = await User.create(req.body)
   res.status(200).json(newUser._id)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.post("/login", async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email})
    !user && res.status(404).json({err: "User not registered!"})

    const checkPassword = await user.comparepassword(password);
    !checkPassword && res.status(401).json({err: "Wrong Login credentials!!"});


    res.status(200).json({_id: user._id, username: user.username})
  } catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router;