// 'use strict';

const EDM_ENDPOINT_LOCATION = 'https://edmtrain.com/api/locations?';
const EDM_ENDPOINT_EVENTS = 'https://edmtrain.com/api/events?'
const SPOTIFY_ENDPOINT = 'https://api.spotify.com/v1/';
const CLIENT_ID = '82abf1d0-fa21-4a55-b904-64476c4a85d0';
let locationId = [];

/*                EDM TRAIN               */

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
    locationId = data.data[0].id;
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

    return `
    <div class="col-3"><button class="clickMe">${artistName}</button>
            <div>${data.date}</div><div>`;
}

/*                      SPOTIFY                        */

function getDataFromSpotifyApi(searchTerm, callback){
    const settings = {
        url: SPOTIFY_ENDPOINT,
        data: {
            q: `${searchTerm}`,
            ids: '2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6',
            limit: 10
        },
        headers:{
            Authorization: "Bearer BQAvw7SOZj8xDaR03KAIW1tyN2rUAUlPfkpvstDWYdKaeTngLEAH3u4de861gT_yqVzMl2KowmdBxjmZDlrYydbwZoYydeihTaAPtcknTim1Su3-C5Tt6WWz02Q4_QO9zSlQQLGGh7ydSw",
        },
        dataType: "json",
        type: "GET",
        success: callback
        };
        
        $.ajax(settings);
}

function displaySpotifySearchData(data) {
    console.log(`This displays data: ${data}`);
    // const results = data.items.map((item, index) => renderResult(item));
    // $('.js-search-results').html(results);
  }

// function renderResultFromEdmApi(result){};

// function renderResultFromSpotifyApi(result){
//     console.log(result);
// //     return `
// //       <a href="https://www.youtube.com/watch?v=${result.id.videoId}"  target="_blank"><img src="${result.snippet.thumbnails.medium.url}"/></a>
// //   `;
// }

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
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        const string = grabWords(query);
        const city = getCity(string);
        const cityWithNoComma = city.substring(0,city.length - 1);
        const state = string[string.length-1];

        queryTarget.val("");

        getLocationFromUser(cityWithNoComma, state, getLocationId);

        setTimeout(function(){ 
            getDataFromLocation(locationId, displayEdmSearchData) 
        }, 3000);
    })

    $('.js-search-results').on('click','.clickMe', event => {
        event.stopPropagation();

        const queryTarget = $(event.currentTarget);
        console.log(`queryTarget is `, queryTarget);
        const query = queryTarget.text();
        console.log(`query is `, query);

        queryTarget.val("");
        getDataFromSpotifyApi(query, displaySpotifySearchData);
    })

}

$(watchSubmit);