"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        res.status(400).json({ message: 'Email, password, and username are required.' });
    }
    try {
        const userRecord = yield firebase_1.auth.createUser({
            email: email,
            password: password,
            displayName: username,
        });
        const uid = userRecord.uid;
        const now = new Date();
        const newUser = {
            id: uid,
            username: username,
            email: email,
            createdAt: now,
            updatedAt: now,
            imageUrl: ""
        };
        yield firebase_1.db.collection('users').doc(uid).set(newUser);
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            imageUrl: newUser.imageUrl,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };
        res.status(201).json({
            message: 'User registered successfully!',
            user: userResponse,
        });
    }
    catch (error) {
        console.error('Error during signup:', error);
        if (error.code === 'auth/email-already-in-use') {
            res.status(409).json({ message: 'Email already in use.' });
        }
        if (error.code === 'auth/weak-password') {
            res.status(400).json({ message: 'Password is too weak. Please use a stronger password.' });
        }
        res.status(500).json({ message: 'Failed to register user.', error: error.message });
    }
}));
router.post('/signin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const response = yield axios_1.default.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email,
            password,
            returnSecureToken: true,
        });
        const userRecord = yield firebase_1.auth.getUserByEmail(email);
        const uid = userRecord.uid;
        const emailUser = userRecord.email;
        const username = userRecord.displayName;
        const imageUrl = userRecord.photoURL;
        const customToken = yield firebase_1.auth.createCustomToken(uid);
        res.status(200).json({
            message: 'Custom token generated successfully.',
            customToken: customToken,
            uid: uid,
            email: emailUser,
            username: username,
            imageUrl: imageUrl
        });
    }
    catch (error) {
        console.error('Error during custom token generation or user lookup:', error);
        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ message: 'User not found. Please check your email.' });
        }
        res.status(500).json({ message: 'Failed to sign in or generate token.', error: error.message });
    }
}));
router.post('/forget-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required.' });
        return;
    }
    try {
        try {
            yield firebase_1.auth.getUserByEmail(email);
        }
        catch (userLookupError) {
            if (userLookupError.code === 'auth/user-not-found') {
                res.status(404).json({ message: 'User with this email not found.' });
                return;
            }
            else {
                throw userLookupError;
            }
        }
        res.status(200).json({ message: 'Password reset email initiated. Please check your inbox (and spam folder).' });
    }
    catch (error) {
        console.error('Error during forget password:', error);
        res.status(500).json({ message: 'Failed to initiate password reset.', error: error.message });
    }
}));
exports.default = router;
