'use strict';

const EDM_ENDPOINT_LOCATION = 'https://edmtrain.com/api/locations?';
const EDM_ENDPOINT_EVENTS = 'https://edmtrain.com/api/events?'
const SPOTIFY_ENDPOINT = 'https://api.spotify.com/v1/';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const CLIENT_ID = '82abf1d0-fa21-4a55-b904-64476c4a85d0';
const USER = {
    locationId: null
};
const YOUTUBE_SEARCH = {
    artist: '',
    song: ''
};

const stateCities = {
    'Alabama': ['Birmingham', 'Montgomery'],
    'Alaska': ['Anchorage'],
    'Arizona': ['Phoenix', 'Tucson','Mesa','Chandler','Glendale'],
    'Arkansas': ['Little Rock','Forth Smith','Fayetteville','Springdale'],
    'California': ['Los Angeles','San Diego','San Jose','San Francisco','Fresno','Sacramento'],
    'Colorado': ['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood'],
    'Connecticut': ['Bridgeport','New Haven','Stamford','Hartford','Waterbury'],
    'Delaware': ['Wilmington','Dover','Newark','Middletown','Smyrna'],
    'Florida': ['Jacksonville','Miami','Tampa','Orlando','Tallahassee'],
    'Georgia': ['Atlanta','Augusta','Columbus','Macon','Savannah'],
    'Hawaii': ['Honolulu','Hilo'],
    'Idaho': ['Boise','Meridian','Nampa'],
    'Illinois': ['Chicago','Aurora','Rockford'],
    'Indiana': ['Indianapolis','Fort Wayne'],
    'Iowa': ['Des Moines', 'Cedar Rapids'],
    'Kansas': ['Wichita','Overland Park','Kansas City'],
    'Kentucky': ['Louisville','Lexington','Bowling Green'],
    'Louisiana': ['New Orleans','Baton Rouge'],
    'Maine': ['Portland','Lewiston'],
    'Maryland': ['Baltimore','Frederick'],
    'Massachusetts': ['Boston','Worcester'],
    'Michigan': ['Detroit','Grand Rapids','Ann Arbor','East Lansing'],
    'Minnesota': ['Minneapolis','Saint Paul','Rochester'],
    'Mississippi': ['Jackson','Gulfport','Southhaven'],
    'Missouri': ['Kansas City','Saint Louis'],
    'Montana': ['Billings','Missoula'],
    'Nebraska': ['Omaha','Lincoln'],
    'Nevada': ['Las Vegas','Henderson'],
    'New Hampshire': ['Manchester','Nashua'],
    'New Jersey': ['Newark','Jersey City'],
    'New Mexico': ['Albuquerque','Las Cruces'],
    'New York': ['New York City','Buffalo','Rochester','Syracuse','Albany'],
    'North Carolina': ['Charlotte','Raleigh','Greensboro'],
    'North Dakota': ['Fargo','Bismarck','Grand Forks'],
    'Ohio': ['Columbus','Cincinnati','Cleveland','Dayton','Toldeo','Akron'],
    'Oklahoma': ['Oklahoma City','Tulsa'],
    'Oregon': ['Portland','Salem'],
    'Pennsylvania': ['Philadelphia','Pittsburgh','Allentown'],
    'Rhode Island': ['Providence','Warwick'],
    'South Carolina': ['Columbia','Charleston','North Charleston'],
    'South Dakota': ['Sioux Falls','Rapid City'],
    'Tennessee': ['Nashville','Memphis','Knoxville'],
    'Texas': ['Houston','San Antonio','Dallas','Austin','Fort Worth'],
    'Utah': ['Salt Lake City','West Valley City'],
    'Vermont': ['Burlington','Essex'],
    'Virgina': ['Virginia Beach','Norfolk'],
    'Washington': ['Seattle','Spokane','Tacoma'],
    'West Virgina': ['Charleston','Huntington'],
    'Wisconsin': ['Wilwaukee','Madison'],
    'Wyoming': ['Cheyenne','Casper']
}

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('BQDR2-64RA2SO7g5zvhCD9Tjv3SpPAFAuCWPlDwh4JlF86ds4fxaPh9Lpxe13k5OjM1Ed0Jq9siQNt3n90jAUBsQBBV8pgkRVUro7tYbf24eqRpn3g0snYETAFhHWuhGJq2p2bRuyY1NpA');

/*                                  EDM TRAIN                                     */

//When user inputs a state and city, returns a JSON, goal is to grab the location ID
function getLocationFromUser(city, state, callback){
    const settings = {
        url: EDM_ENDPOINT_LOCATION,
        data: {
            city: city,
            state: state,
            client: CLIENT_ID,
        },
        ContentType: 'application/javascript',
        dataType: 'json',
        type: 'GET',
        success: callback
    }
    $.ajax(settings);
};

//callback Function for getLocationFromUser function
function getLocationId(data){
    console.log(data);
    console.log(data.data[0].id)
    USER.locationId = data.data[0].id;
};

//Uses the location ID to filter the JSON of a specific location
function getDataFromLocation(locationId, callback){
    console.log(locationId);
    const settings = {
        url: EDM_ENDPOINT_EVENTS,
    data: {
        locationIds: locationId,
        client: CLIENT_ID
        },
    ContentType: 'application/javascript',
    dataType: 'json',
    type: 'GET',
    success: callback
    }
    $.ajax(settings);
}

//callback function for getDataFromLocation. Filters and returns an array of the JSON into html
function displayEdmSearchData(arrayData){
    console.log(arrayData);
    console.log(arrayData.data);
    const results = arrayData.data
        .filter((item) => item.artistList.length > 0)
        .map((item, index) => renderEdmResult(item));
    $('.js-search-results').html(results.join(''));
};

//Appends the artists name and date
function renderEdmResult(data){

    const artistName = data.artistList[0].name;
    let date = data.date.slice(5);

    return `
    <div class="col-3 button-centered">
            <button class="clickMe">${artistName}</button>
            <div class="date-position">${date}</div>
    </div>`;
}

/*                                          SPOTIFY                                            */

function getDataFromSpotifyApi(searchTerm, callback){

    spotifyApi.searchArtists(`${searchTerm}`)
        .then(function(data) {
            console.log('Search artists ', data);
            console.log(data.artists.items[0].id);
        let id = data.artists.items[0].id;
        displaySpotifySearchData(id);
        }, function(err) {
        console.error(err);
        });
}


function displaySpotifySearchData(data) {
    console.log(`This displays data: ${data}`);

    spotifyApi.getArtistTopTracks(data,'US').
    then(function(data){
        console.log(data);
        const results = data.tracks
        .map((item, index) => renderResultFromSpotifyApi(item));

    $('.js-track-results').html(results.join(''));
    }, function(err){
        console.error(err);
    });
  }


function renderResultFromSpotifyApi(result){
    console.log(result);
    return `<div class="col-3">
                <button class="song-box">${result.name}</button>
            </div>`
}

/*                                           YOUTUBE API                                       */
function getDataFromApi(searchTerm, callback){
    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            q: searchTerm,
            part: "snippet",
            key: "AIzaSyC68NGJp8YjxtvckrxeRGQ3JvCf3E4MJVU",
            maxResults: 1
        },
        dataType: "json",
        type: "GET",
        success: callback
        };
        $.ajax(settings);
}

function renderResult(result){
    return `
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}"  target="_blank"><img src="${result.snippet.thumbnails.medium.url}"/></a>
  `;
}

function displayYouTubeSearchData(data) {
    console.log(data);
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-youtube-results').html(results);
}

function appendStates(obj){
    Object.keys(obj).forEach(key => {
        $('.states').append(`<option value="${key}">${key}</option>`);
    })
}

function appendCities(array){
    array.forEach(element => {
        $('.cities').append(`<option value="${element}">${element}</option>`);
    })
}

function changeCity(){
    $('.states').on('change', function(event){
      event.preventDefault();

      $('.cities').html("");
  
      let currentStateValue = $(this).val();
      console.log(currentStateValue);
     
      for ( let key in stateCities ){
        if (key == currentStateValue){
          appendCities(stateCities[key]);
        }
      }
  
    });
  }

function grabWords(string){
    let stringArray = string.split(" ");
    return stringArray;
}

function getCity(wordsArr){
    return wordsArr.slice(0, wordsArr.length-1).join(" ");
}

//listen when the user interacts with the page

function watchSubmit(){

    $('.js-search-form').submit(event => {
        event.preventDefault();

        let userInput = true;

        const state = $(event.currentTarget).find('.states').val();
        const city = $(event.currentTarget).find('.cities').val();
        console.log(`state is ${state}`);
        console.log(`cities is ${city}`);

        if(state === 'state'){
            alert('Please pick a state');
            userInput = false;
        }

        if(userInput){
            getLocationFromUser(city, state, getLocationId);

            setTimeout(function(){ 
                getDataFromLocation(USER.locationId, displayEdmSearchData);
                $('.artists').show();
            }, 3000);
        }    
    })

    $('.js-search-results').on('click','.clickMe', event => {
        event.stopPropagation();

        const queryTarget = $(event.currentTarget);
        console.log(`queryTarget is `, queryTarget);
        const query = queryTarget.text();
        console.log(`query is `, query);

        YOUTUBE_SEARCH.artist = query;

        queryTarget.val("");
        getDataFromSpotifyApi(query, displaySpotifySearchData);
        $('.tracks').show();


    })

    $('.js-track-results').on('click','.song-box',event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget);
        const query = queryTarget.text();

        console.log(`Youtube queryTarget is ${queryTarget}`);
        console.log(`Youtube query is ${query}`);
        YOUTUBE_SEARCH.song = query;

        let youtubeSearchQuery = YOUTUBE_SEARCH.artist + ' ' + YOUTUBE_SEARCH.song;

        console.log(query);

        queryTarget.val("");
        getDataFromApi(youtubeSearchQuery, displayYouTubeSearchData); 

        $('.youtube').show();

        console.log(`artist is ${YOUTUBE_SEARCH.artist}`);
        console.log(`song is ${YOUTUBE_SEARCH.song}`);
    })

}

$(function(){

    let window_size = $(window).height();
    console.log(window_size);

    $('.container').css('height',window_size);


    $(".search").on('click',function() {
            $('html', 'body').animate({
                scrollTop: $(".artists").offset().top
            }, 2000);
    });

    $(".js-search-results .clickMe").on('click',function() {
        setTimeout(function(){ 
            $('html', 'body').animate({
                scrollTop: $(".artists").offset().top
            }, 100);
        }, 6000);
    });

    appendStates(stateCities);
});

$(changeCity);
$(watchSubmit);