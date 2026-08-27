const https = require('https')
const fs = require('fs');
const Game = require('./game')

const options = {
  host: 'api.github.com',
  path: '/users/ViniciusFXavier/followers',
  method: 'GET',
  headers: { 'user-agent': 'ViniciusFXavier' }
}

https.get(options, (resp) => {
  let data = ''
  resp.on('data', (chunk) => {
    data += chunk
  })

  resp.on('end', () => {
    const followers = JSON.parse(data).map((follower) => follower.login)
    console.log('followers: ', followers);
    const gameInstance = new Game({ followers })
    const gameSvg = gameInstance.run()
    fs.writeFile('game.svg', gameSvg, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
})
