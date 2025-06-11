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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const router = (0, express_1.Router)();
router.get('/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = [];
        let nextPageToken;
        do {
            const result = yield firebase_1.admin.auth().listUsers(1000, nextPageToken);
            users.push(...result.users);
            nextPageToken = result.pageToken;
        } while (nextPageToken);
        res.status(200).send(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Failed to fetch users.' });
    }
}));
router.get('/get/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    try {
        const usersSnapshot = yield firebase_1.db.collection('users')
            .where('username', '>=', username)
            .where('username', '<=', username + '\uf8ff')
            .get();
        if (usersSnapshot.empty) {
            res.status(404).json({ message: 'No users found matching the prefix.' });
            return;
        }
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push(doc.data());
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error getting users by username prefix:', error);
        res.status(500).json({ message: 'Failed to retrieve users.', error: error.message });
    }
}));
router.get('/getId/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const usersSnapshot = yield firebase_1.db.collection('users')
            .where('id', '==', id)
            .get();
        if (usersSnapshot.empty) {
            res.status(404).json({ message: 'No users found matching the id.' });
            return;
        }
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push(doc.data());
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error getting users by id:', error);
        res.status(500).json({ message: 'Failed to retrieve users.', error: error.message });
    }
}));
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        console.log(body);
        const updatedRecord = yield firebase_1.admin.auth().updateUser(body.uid, {
            email: body.email,
            displayName: body.username,
            password: body.password
        });
        const user = {
            id: updatedRecord.uid,
            username: updatedRecord.displayName,
            email: updatedRecord.email,
            createdAt: updatedRecord.metadata.creationTime,
            updatedAt: new Date(),
        };
        console.log(user);
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user.', error: error.message });
    }
}));
exports.default = router;
