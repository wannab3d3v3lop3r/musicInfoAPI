const EDM_ENDPOINT_LOCATION = 'https://edmtrain.com/api/locations?';
const EDM_ENDPOINT_EVENTS = 'https://edmtrain.com/api/events?'
const SPOTIFY_ENDPOINT = '';
const CLIENT_ID = '82abf1d0-fa21-4a55-b904-64476c4a85d0';

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

function getDataFromLocation(locationId, callback){
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

//make sure user inputs the city and state correctly
function checkString(string){

}

function grabWords(string){
    let stringArray = string.split(" ");
    return stringArray;
}

function getCity(wordsArr){

    return wordsArr.slice(0, wordsArr.length-1).join(" ");

}

function collectId(){}

function getDataFromSpotifyApi(searchTerm, callback){
    const settings = {
        url: SPOTIFY_ENDPOINT,
        data: {
            q: `${searchTerm}`,
            Authorization: "Bearer BQAvw7SOZj8xDaR03KAIW1tyN2rUAUlPfkpvstDWYdKaeTngLEAH3u4de861gT_yqVzMl2KowmdBxjmZDlrYydbwZoYydeihTaAPtcknTim1Su3-C5Tt6WWz02Q4_QO9zSlQQLGGh7ydSw",
            limit: 10
        },
        ContentType:'application/javascript',
        dataType: "json",
        type: "GET",
        success: callback
        };
        
        $.ajax(settings);
}

function renderResultFromEdmApi(result){};

function renderResultFromSpotifyApi(result){
    console.log(result);
//     return `
//       <a href="https://www.youtube.com/watch?v=${result.id.videoId}"  target="_blank"><img src="${result.snippet.thumbnails.medium.url}"/></a>
//   `;
}

function getLocationId(data){
    // console.log(data);
    return data.data[0].id;
    // const results = data.items.map((item, index) => renderResult(item));
    // $('.js-search-results').html(results);
};

function displayEdmSearchData(data){
    console.log(data);
};

function displaySpotifySearchData(data) {
    // console.log(`This displays data: ${data}`);
    // const results = data.items.map((item, index) => renderResult(item));
    // $('.js-search-results').html(results);
  }

function watchSubmit(){
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        const string = grabWords(query);
        const city = getCity(string);
        const cityWithNoComma = city.substring(0,city.length - 1);
        const state = string[string.length-1];

        console.log(string);
        console.log(cityWithNoComma);
        console.log(state);


        queryTarget.val("");
        let Id = getLocationFromUser(cityWithNoComma, state, getLocationId);
        console.log(Id);
        getDataFromLocation(Id, displayEdmSearchData)
    })

    // $('.').submit(event => {
    //     event.preventDefault();

    //     const queryTarget = $(event.currentTarget).find('.');
    //     const query = queryTarget.val();

    //     queryTarget.val("");
    //     getDataFromSpotifyApi(query, displaySpotifySearchData);
    // })
}

$(watchSubmit);