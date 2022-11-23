# Wanderer Bot 🤖🎨

[@AlbersBot](https://twitter.com/theWandererBot) is a Twitter bot that tweets a new generative art image every day, showing Caspar David Friedrich's [romantic wanderer](https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog) in a location chosen at random across the whole world, pictured with Google StreetView images.

Let the WandererBot take you on a contemplative journey through the world, transforming any and every location into a **sublime** experience.

## Description

This bot picks random geographical coordinates close to land, using API data from
[3GeoNames.org](https://3geonames.org/). Then it pulls an image of that location from [Google StreetView](https://www.google.com/streetview/) and inserts our romantic wanderer on it, making it instantly sublime.

## Usage

To test the bot locally, you will need a [Twitter developer account](https://developer.twitter.com/), and [Twitter app API keys and user access tokens](https://developer.twitter.com/en/docs/basics/apps/guides/the-app-management-dashboard)

Create and an `.env` file and set the environment variables for the following API keys : 'consumer_key', 'consumer_secret', 'access_token', 'access_token_secret'.

Run `node wanderer.js` to send a tweet.

-----

bot by [Lucas Battich](lucasbattich.com)
