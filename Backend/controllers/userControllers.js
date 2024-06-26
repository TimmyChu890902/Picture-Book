const User = require('../models/User');
// const bcrypt = require('bcrypt');

exports.createNewUser = async (req, res, next) => {
    let { email_address, user_name, user_password } = req.body;
    try {
        let users = new User(email_address, user_name, user_password);
        users = await users.save();
        console.log(users);
        res.status(201).json({ message: "User created successfully", users });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}

exports.checkUser = async (req, res, next) => {
    let { user_name, user_password } = req.body; 
    try {
        let [rows] = await User.findByName(user_name);
        let user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (user_password==user.user_password) {
            res.status(200).json({ message: 'User validated successfully', user });
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking user', error });
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const user = await User.findById(userId);

        if (user) {
            res.status(200).json({message: 'User found.', user });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};
// exports.getPostById = async(req,res,next)=>{

//     res.send("Get Post By ID Route");
// }