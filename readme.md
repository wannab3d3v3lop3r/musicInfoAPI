<!-- # book-thing.io

Initial wireframes:

https://wireframe.cc/x0a8I9

https://wireframe.cc/6oVXTU -->
# MusicInfoAPI

Website that is able to display EDM artists in a specific location and be able to listen to their top songs.

## Motivation

Be able to have users to navigate and listen to artists easier.

## Screenshots
Landing Page where user picks state and city:

![login screen](screenshots/mainPage.jpeg)

Artists in specific location:

![about](screenshots/listOfArtists.jpeg)

Top Songs of the Artist:

![library](screenshots/topSongs.jpeg)

Youtube Link of the Artist's Song:

![recommendations](screenshots/song.jpeg)

## Environment Setup

1. Setup your own postgress server
2. Run the database_script.sql file to build your table structure
3. Create a .env file in your server folder which contains the path to your database as well as your client id and secret
4. Obtain a client id and secret by setting up your app with [the google developers console](https://console.developers.google.com/)
5. Run your project with
```
npm run dev
```

## Running the tests

To run all tests, run
```
npm test
```
To run just the front/back end tests, run
```
npm run test:server

npm run test:client
```

## Built With

### Front-End
* React
* Redux
* React-Router

### Back-End
* Postgress
* Express
* Node
* Knex

### Testing
* Mocha
* Chai
* Chai-http
* Jest

## Features

* Create a list of books
* Add your favorite books
* Like lists to get recommendations
* See every book currently in the library

## Demo

- [Live Demo](https://book-thing.herokuapp.com/)

## Authors

* **Sonja Duric** - ** - Database design/Back-End development
* **Jonathan Fitzgibbon** - ** - Back-End development/testing
* **Tanner Gill** - ** - Front-End development/testing, styling
* **Patrice White** - ** - Front-End development/testing, styling

## Acknowledgments

* **Ben Pardo** - ** - The Great Savior, The Wise Sage


The goal of this project is the ability to see which EDM artist is playing in a particular area
and be able to listen to its top songs.

Most sites have it where they are able to show where EDM artists playing but doesn't have a way to listen 
to the artist's music at the site. I've made it where its possible to listen to it without having to search. 
After a few clicks, it will direct you to the song on Youtube's page.

Uses EDMTrain, Spotify, and Youtube API.

//USER EXPERIENCE

Users will be able to select certain cities within a state.
They will be able to see which EDM artist will be playing on a particular date.
Once they click on the artist, their top songs will populate.
After clicking on a song, a Youtube video link will show and direct you to the page once clicked.
