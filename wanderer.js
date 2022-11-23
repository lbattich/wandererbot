const config = require("./config");
const iso = require('iso-3166-1');
const Twit = require('twit');
const { createCanvas, loadImage } = require("canvas");
const fetch = require("node-fetch");
const fs = require("fs");

const T = new Twit(config);

const width = 640;
const height = 640;

const travel = (travelLatitude, travelLongitude, locationName) => {
  const canvas = createCanvas();
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  const imgSource = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${travelLatitude},${travelLongitude}&fov=110&pitch=15&key=${config.maps_key}`
  loadImage(imgSource).then(imageObj => {
    context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

    loadImage("img/wanderer-sq.png").then(imageWanderer => {
      context.drawImage(imageWanderer, canvas.width/11, canvas.height/5.1, canvas.width/1.1, canvas.height/1.1);

      // Large centred wanderer format:
      //context.drawImage(imageWanderer, 0, canvas.height/9, canvas.width, canvas.height);

      // Landscape format use:
      //context.drawImage(imageWanderer, canvas.width/4.54, canvas.height/6.7, canvas.height, canvas.height);

      // Tweet image
      const canvasImage = canvas.toDataURL().replace(/^data:image\/png;base64,/, "")
      // sendTweet(canvasImage, locationName, getTweetNumber())
      sendTweet(canvasImage, locationName)

      // save canvas image
      //const buffer = canvas.toBuffer('image/png')
      //fs.writeFileSync('./image.png', buffer)
    });
  });

}

const geoCheck = (latitudeCheck, longitudeCheck, locationName) => {
  fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?size=10x10&location=${latitudeCheck},${longitudeCheck}&fov=110&pitch=15&key=${config.maps_key}`)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {

      if (data.status == "OK"){
        // no errors, we are travelling!
        travel(latitudeCheck, longitudeCheck, locationName);
        console.log("geoCheck: TRUE: data image data found. Generating composite image");
        // setTimeout(function(){ geoCheck(userLatitude, userLongitude) },2500);
      }
      else {
        // error, not traveling, will try again
        console.log("geoCheck: No data at coordinates given. Travelling again")
        setTimeout(function(){ wander() },1);
      }
      })
    .catch(function(error) {
      console.log(error);
    });
}

const wander = () => {
  console.log("checking api.3geonames.org");
  fetch(`http://api.3geonames.org/randomland.json`)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {

      console.log("wander: got random coords");
      //console.log(data);

      let locationName = "";

      const latt = data.nearest.latt;
      const longt = data.nearest.longt;
      const city = data.nearest.city;
      const prov = data.nearest.prov;
      const state = data.nearest.state;

      try { locationName = iso.whereAlpha2(state).country;
      } catch (e) {
        console.error(e);
        locationName = state;
      }
      if (typeof prov === "string") {
        locationName = `${prov}, ${locationName}`;
      }
      if (typeof city === "string") {
        locationName = `${city}, ${locationName}`;
      }

      console.log(`wander: Lat: ${latt}; Long: ${longt}`);
      console.log(`Location: ${locationName}`);

      geoCheck(latt, longt, locationName);

      })
    .catch(function(error) {
      console.log("Error: no random coordinates retrieved")
      console.log(error);
      setTimeout(function(){ wander() },10);
    });
}


// ----- TWITTER FUNCTIONS ----- //

const sendTweet = (image, locationName) => {
  T.post( "media/upload", { media_data: image }, (error, data, response) => {
      if (error) {
        console.error(error);
      }
      const params = {
        status: `Wanderer above ${locationName}
Wandering # ${newNumber}`,
        media_ids: data.media_id_string,
      };

      T.post("statuses/update", params, (error, data, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Status updated.");
        }
      });
    });
};

// const getTweetNumber = () => {
//   let newNumber;
//   T.get("statuses/user_timeline", { screen_name: "theWandererBot", count: 1 }, (err, data, response) => {
//     if (!err) {
//     const parse = parseInt(data[0].text.match( /\d+/g ));
//     newNumber = isNaN(parse) ? 1 : parse + 1;
//     // return tweet number
//     return newNumber;
//   }
//   });
// };


wander();
