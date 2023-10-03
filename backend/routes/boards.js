const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {

    const boards = await prisma.boards.findMany({
        where: { ownerId: req.authUser.sub }
    })

    console.log("boards GET")
    res.send({
        msg: 'boards',
        boards: boards,
        authorizedUserId: req.authUser.sub
    })
})


router.post('/', async (req, res) => {

    const board = await prisma.boards.create({
        data: {
            name: req.body.boardName,
            ownerId: req.authUser.sub
          },
        });
    console.log("board created:", board)
    res.send({ msg: 'board created', id: board.id })
})

router.patch('/:id', async (req, res) => {

    const board = await prisma.boards.update({
        where: {
            id: req.params.id,
        },
        data: {
            name: req.body.name,
            updatedAt: new Date()
        },
    })
    res.send({
        msg: 'patch',
        id: req.params.id,
        board: board
    })
})

router.delete('/:id', async (req, res) => {

    try {

        const board = await prisma.boards.delete({
            where: {
                id: req.params.id,
            }
        })
        res.send({
            msg: 'deleted',
            id: req.params.id,
            board: board
        })
    } catch (err) {

        console.log(err)
        res.status(400).send({
            msg: 'ERROR',
            error: 'board not found'
        })
    }
})

module.exports = router