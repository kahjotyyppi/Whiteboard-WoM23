const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();


// disable for production?
/*router.get('/', async (req, res) => {
    const users = await prisma.users.findMany()
    console.log("users GET")
    res.send({ 
        msg: 'users', 
        users: users
    })
})

// restrict for production
router.get('/:id', async (req, res) => {

    const user = await prisma.users.findUnique({
        where: {id: req.params.id}
    })

    console.log("users GET ONE")
    res.send({ msg: 'users', user: user })
}) */

router.post('/login', async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: req.body.email
            }
        })

        // Sends 401 in both cases, adds security.
        if (user == null) {
            return res.status(401).send({
                msg: 'ERROR',
                error: 'Email or password is incorrect.'
            })
        }

        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            return res.status(401).send({
                msg: 'ERROR',
                error: 'Email or password is incorrect.'
            })
        }

        const token = await jwt.sign({
            sub: user.id,
            email: user.email,
            name: user.name,
            ws_token: 'BfzZLrlghH',
            expiresIn: '1d'
        }, process.env.JWT_SECRET)

        const refreshToken = await jwt.sign({
            sub: user.id,
            email: user.email,
            name: user.name,
            ws_token: 'BfzZLrlghH',
            expiresIn: '7d'
        }, process.env.JWT_SECRET)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.send({
            token: token,
            msg: "Login successful",
            userId: user.id,
            userEmail: user.email
        })

    } catch (e) {
        console.log(e);
    }

})
router.post('/', async (req, res) => {

        try {
            const user = await prisma.users.findUnique({
                where: {
                    email: req.body.email
                }
            })

            if (user) {
                return res.status(409).send({
                    msg: 'ERROR',
                    error: 'This email is already registered!'
                })
            }
        } catch (e) {
            console.log(e);
        }

        const hash = await bcrypt.hash(req.body.password, 12)

        try {
            const user = await prisma.users.create({
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    password: hash
                },
            })
            console.log("User created:", user)
            res.status(201).send({
                msg: 'User registered!',
                id: user.id
            })
        } catch (e) {
            console.log(e);
        }
    }

)


/*
router.delete('/:id', async (req, res) => {

    try {

        const user = await prisma.users.delete({
            where: {
                id: req.params.id,
            }
        })
        res.send({
            msg: 'deleted',
            id: req.params.id,
            user: user
        })
    } catch (err) {

        console.log(err)
        res.send({
            msg: 'ERROR',
            error: err
        })
    }
})
*/

module.exports = router