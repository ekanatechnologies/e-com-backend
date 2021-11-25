const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const register = async (req, res) => {


    const hashedPassword = await bcrypt.hash(req.body.Password, 12);

    const newUser = new User({
        username: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credentials!");

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);


        !isPasswordCorrect &&
            res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            "mysecret",
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
}
module.exports = { register, login }