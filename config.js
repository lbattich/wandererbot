const path = require('path')
const dotenv = require('dotenv')
require('dotenv').config();
// Load config
dotenv.config({ path: './config/config.env' })

//exports the keys
module.exports = {
    maps_key : process.env.MAPS_KEY,
    consumer_key : process.env.API_KEY,
    consumer_secret : process.env.API_SECRET_KEY,
    access_token : process.env.ACCESS_TOKEN,
    access_token_secret : process.env.ACCESS_TOKEN_SECRET
}
