const { game_data } = require('../db/client')

async function delete_all_gamedata() {

    let deleted_all = await game_data.deleteMany({})
}

module.exports = { delete_all_gamedata }