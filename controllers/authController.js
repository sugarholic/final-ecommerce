import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req, res) => {
    try{
        const {name, email, password, phone, address} = req.body

        //validation
        if(!name){
            return res.send({error:'Name is required'});
        }
        if(!email){
            return res.send({message:'Email is required'});
        }
        if(!password){
            return res.send({message:'Password is required'});
        }
        // if(!confirmPassword){
        //     return res.send({message:'Password is required'});
        // }
        if(!phone){
            return res.send({message:'Phone is required'});
        }
        if(!address){
            return res.send({message:'Address is required'});
        }

        //check existing user
        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(200).send({
                success: false,
                message: 'User already exist, please signin'
            });
        }

        //registration
        const hashedPassword = await hashPassword (password);
        const newUser = await new userModel({name, email, phone, address, password: hashedPassword}).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            newUser,
        });

    } catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Register Error',
            error
        });
    }
};

//Signin (POST)
export const signinController = async(req, res) => {
    try{
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email and/or password"
            });
        }        

        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: "This email is not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Password invalid'
            })
        }

        //token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).send({
            success: true,
            message: "User logged in successfully",
            users:{
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Signin Error',
            error
        })
    }
};

//forgotPasswordController
export const forgotPasswordController = async(req, res) => {
    try {
        const {email, newPassword} = req.body;

        if(!email) {
            res.status(400).send({message: 'Please fill in your email.'})
        }
        if(!newPassword) {
            res.status(400).send({message: 'Please fill in your new password.'})
        }
        // if(!confirmPassword) {
        //     res.status(400).send({message: 'Enter password one more time.'})
        // }

        //checking
        const user = await userModel.findOne({email})

        //validation
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong email and/or answer',
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed})
        res.status(200).send({
            success: true,
            message: 'Password changed successfully',
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error,
        })
    }
};

//test controller
export const testController = (req, res) => {
    res.send('protected route');
};