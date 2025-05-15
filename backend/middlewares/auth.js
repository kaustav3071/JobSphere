import express from 'express';
import jwt from 'jsonwebtoken';
import BlacklistToken from '../models/blacklistToken.model.js';
import UserModel from '../models/user.model.js';
import RecruiterModel from '../models/recruiter.model.js';

export const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const isBlacklisted = BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = UserModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const authenticateRecruiter = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const isBlacklisted = BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const recruiter = RecruiterModel.findById(decoded._id);
        if (!recruiter) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.recruiter = recruiter;
        next();
    }
    catch (error) {
        console.error('Error authenticating recruiter:', error);
        res.status(401).json({ message: "Unauthorized" });
    }
};