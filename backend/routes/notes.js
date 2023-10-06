const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('/:id', async (req, res) => {

    try {

        const note = await prisma.notes.findMany({
            where: { boardId: req.params.id } // Board ID
        })

        console.log("notes GET MANY")
        res.send({ msg: 'notes', note: note })
        
    } catch (err) {
        console.log(err)
        res.status(404).send({
            msg: 'ERROR',
            error: 'Note not found'
        })
    }
})


router.post('/', async (req, res) => {

    try {
           const note = await prisma.notes.create({
        data: {
            content: req.body.content,
            color: req.body.color,
            positionX: req.body.positionX,
            positionY: req.body.positionY,
            boardId: req.body.boardId
        },
    })
    console.log("note created:", note)
    res.send({ msg: 'note created', id: note.id }) 
    }
    catch (err) {
        console.log(err)
        res.status(409).send({
            msg: 'ERROR',
            error: 'Failed to create note'
        })
    }

})

router.patch('/:id', async (req, res) => {

    try {
            const note = await prisma.notes.update({
        where: {
            id: req.params.id,
        },
        data: {
            content: req.body.content,
            color: req.body.color,
            positionX: req.body.positionX,
            positionY: req.body.positionY,
            updatedAt: new Date()
        },
    })
    res.send({
        msg: 'patch',
        id: req.params.id,
        note: note
    })
    }
    catch (err) {
        console.log(err)
        res.status(404).send({
            msg: 'ERROR',
            error: 'Note note found'
        })
    }

})

router.delete('/:id', async (req, res) => {

    try {
        const note = await prisma.notes.delete({
            where: {
                id: req.params.id,
            }
        })
        res.send({
            msg: 'deleted',
            id: req.params.id,
            note: note
        })
    } catch (err) {

        console.log(err)
        res.status(404).send({
            msg: 'ERROR',
            error: 'Note not found'
        })
    }
})

module.exports = router