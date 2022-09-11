const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2198
app.use(express.json())
app.use(cors())

const possibleChoices = ['rock', 'paper', 'scissors']

let player1Choice = null,
  player2Choice = null

app.get('/', (req, res) => {
  res.status(200).send('still gaming')
})

app.get('/hasChosen/:player', (req, res) => {
  if (req.params.player == 1) {
    if (player1Choice) return res.send(true).status(200)
    else return res.send(false).status(200)
  } else if (req.params.player == 2) {
    if (player2Choice) return res.send(true).status(200)
    else return res.send(false).status(200)
  }
  res.send('Invalid player').status(400)
})

app.post('/player1/:choice', (req, res) => {
  if (!possibleChoices.includes(req.params?.choice))
    return res.status(400).send('Bad request: Invalid choice')

  player1Choice = req.params?.choice

  res.status(200).json({ choice1: req.params?.choice })
})

app.post('/player2/:choice', (req, res) => {
  if (!possibleChoices.includes(req?.params?.choice))
    return res.status(400).send('Bad request: Invalid choice')

  player2Choice = req?.params?.choice

  res.status(200).json({ choice2: req?.params?.choice })
})

app.get('/winner', (req, res) => {
  if (!player1Choice || !player2Choice)
    return res.status(404).send('a choice has not yet been selected')
  let result = evalWinner(player1Choice, player2Choice)
  result = result === 0 ? 'tie' : result === 1 ? 'player1' : 'player2'
  res.json(result)
})

app.put('/reset-choices', (req, res) => {
  player1Choice = player2Choice = null
  res.status(200).send('Choices have been reset.')
})

app.listen(port, () => {
  console.log(`Server listening on *:${port}`)
})

function evalWinner(choice1, choice2) {
  if (choice1 === choice2) return 0
  else if (choice1 === 'rock' && choice2 === 'paper') return 2
  else if (choice1 === 'rock' && choice2 === 'scissors') return 1
  else if (choice1 === 'paper' && choice2 === 'rock') return 1
  else if (choice1 === 'paper' && choice2 === 'scissors') return 2
  else if (choice1 === 'scissors' && choice2 === 'rock') return 2
  else if (choice1 === 'scissors' && choice2 === 'paper') return 1
}
