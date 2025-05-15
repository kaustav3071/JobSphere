import Recruiter from '../models/recruiter.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import BlacklistToken from '../models/blacklistToken.model.js';
import nodemailer from 'nodemailer';

export const registerRecruiter = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, phone, companyName, address } = req.body;

    try {
        // Check if recruiter already exists
        const existingRecruiter = await RecruiterModel.findOne({ email });
        if (existingRecruiter) {
            return res.status(400).json({ message: 'A recruiter with this email already exists' });
        }

        // Create a new recruiter
        const newRecruiter = new RecruiterModel({
            name,
            email,
            password,
            phone,
            companyName,
            address,
            role: 'recruiter',
        });

        // Save the recruiter to the database
        await newRecruiter.save();
        // Generate a token
        const token = newRecruiter.getJWTToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ message: 'Recruiter registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginRecruiter = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        // Check if recruiter exists
        const recruiter = await RecruiterModel.findOne({ email }).select('+password');
        if (!recruiter) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await recruiter.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = recruiter.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ message: 'Recruiter logged in successfully', token,
            recruiter: {
                id: recruiter._id,
                name: recruiter.name,
                email: recruiter.email,
                phone: recruiter.phone,
                companyName: recruiter.companyName,
                address: recruiter.address,
                role: recruiter.role,
            },
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const logoutRecruiter = async (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const blacklistedToken = new BlacklistToken({ token });
        await blacklistedToken.save();

        res.clearCookie('token');
        res.status(200).json({ message: 'Recruiter logged out successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }  
}

export const getRecruiterProfile = async (req, res) => {
    try {
        const recruiter = await RecruiterModel.findById(req.user._id).select('-password');
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }

        res.status(200).json({
            id: recruiter._id,
            name: recruiter.name,
            email: recruiter.email,
            phone: recruiter.phone,
            companyName: recruiter.companyName,
            address: recruiter.address,
            role: recruiter.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;

    try {
        // Check if recruiter exists
        const recruiter = await RecruiterModel.findOne({ email });
        if (!recruiter) {
            return res.status(400).json({ message: 'No recruiter found with this email' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        recruiter.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        recruiter.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await recruiter.save();

        // Send email with reset token
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${req.protocol}://${req.get('host')}/recruiters/resetpassword/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: message,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (error) {
        console.error('Error sending reset password email:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password } = req.body;
    const resetToken = req.params.token;

    try {
        // Hash the token
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const recruiter = await RecruiterModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!recruiter) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password
        recruiter.password = password;
        recruiter.resetPasswordToken = undefined;
        recruiter.resetPasswordExpire = undefined;

        await recruiter.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
        