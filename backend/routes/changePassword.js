const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

router.patch('/:id', async (req, res) => {
    try {
        if (req.params.id != req.authUser.sub) {
            res.status(403).send({
                msg: 'ERROR',
                error: 'Cannot patch other users'
            });
            return; // Add return statement to exit the function
        }

        // Retrieve the user's current hashed password from your database
        const user = await prisma.users.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!user) {
            res.status(404).send({
                msg: 'ERROR',
                error: 'User not found'
            });
            return; // Add return statement to exit the function
        }

        // Check if the new password meets the minimum length requirement
        if (req.body.newPassword && req.body.newPassword.length < 5) {
            res.status(400).send({
                msg: 'ERROR',
                error: 'New password must be at least 5 characters long'
            });
            return; // Add return statement to exit the function
        }

        let hash = null;
        if (req.body.newPassword) {
            hash = await bcrypt.hash(req.body.newPassword, 12);
        }

        const updatedUser = await prisma.users.update({
            where: {
                id: req.params.id,
            },
            data: {
                password: hash,
                updatedAt: new Date()
            },
        });
        res.send({
            msg: 'Password changed successfully!',
            id: req.params.id,
            user: updatedUser
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            msg: 'ERROR',
            error: 'An error occurred while processing the request'
        });
    }
});

module.exports = router