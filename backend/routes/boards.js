const express = require('express')
const router = express.Router()
const {
    PrismaClient
} = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    try {
        const boards = await prisma.boards.findMany({
            where: {
              OR: [
                {
                  ownerId: req.authUser.sub,
                },
                {
                  collaborators: {
                    has: {
                      email: req.authUser.email,
                    },
                  },
                },
              ],
            },
          });

        console.log("boards GET");
        res.send({
            msg: 'boards',
            boards: boards,
            authorizedUserId: req.authUser.sub
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            msg: 'ERROR',
            error: 'Cannot get boards'
        });
    }
});


router.post('/', async (req, res) => {
    try {
      const board = await prisma.boards.create({
        data: {
          name: req.body.boardName,
          ownerId: req.authUser.sub,
          collaborators: [],
        },
      });
  
      console.log("board created:", board);
      res.send({
        msg: 'board created',
        id: board.id,
        name: board.name
    });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        msg: 'ERROR',
        error: 'Cannot create board'
      });
    }
  });

router.delete('/:id', async (req, res) => {
    try {
        const board = await prisma.boards.delete({
            where: {
                id: req.params.id,
            }
        });
        // Deletes the notes aswell
        await prisma.notes.deleteMany({
            where: {
                boardId: req.params.id
            }
        });
        res.send({
            msg: 'Succesfully deleted board',
            name: board.name,
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
});

router.patch('/:id', async (req, res) => {
    try {
        const board = await prisma.boards.update({
            where: {
                id: req.params.id,
            },
            data: {
                collaborators: {
                    push: {
                        email: req.body.username,
                    }
                },
                updatedAt: new Date(),
            },
        });
        res.send({
            msg: 'Succesfully added collaborator',
            boardName: board.name,
            id: req.params.id,
            collaborator: req.body.username,
        })
    } catch (err) {

        console.log(err)
        res.status(400).send({
            msg: 'ERROR',
            error: 'Failed to add collaborator'
        })
    }
});

module.exports = router