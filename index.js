'use strict';

//endpoints
const EDM_ENDPOINT_LOCATION = 'https://edmtrain.com/api/locations?';
const EDM_ENDPOINT_EVENTS = 'https://edmtrain.com/api/events?'
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const EDM_CLIENT_ID = '82abf1d0-fa21-4a55-b904-64476c4a85d0';
const USER = {
    locationId: null
};

//Mutable searches when user clicks on artists
const YOUTUBE_SEARCH = {
    artist: '',
    song: ''
};

//convert number into month names
let months = {
    JANURARY: 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12
};

//static information of states and their cities
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
    'Wisconsin': ['Wilwaukee','Madison'],
    'Wyoming': ['Cheyenne','Casper']
}

/*                                  EDM TRAIN                                     */

//When user inputs a state and city, returns a JSON, goal is to grab the location ID
function getLocationFromUser(city, state, callback){
    const settings = {
        url: EDM_ENDPOINT_LOCATION,
        data: {
            city: city,
            state: state,
            client: EDM_CLIENT_ID,
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
    console.log(`data`,data);
    USER.locationId = data.data[0].id;
};

//Uses the location ID to filter the JSON of a specific location
function getDataFromLocation(locationId, callback){
    const settings = {
        url: EDM_ENDPOINT_EVENTS,
    data: {
        locationIds: locationId,
        client: EDM_CLIENT_ID
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
    console.log(`array data is `, arrayData)

    let artistList = ''

    if(arrayData.data.length === 0){
        artistList = `<div class="align-center">No upcoming artists in this city :(</div>`
        $('.js-search-results').html(artistList);
    }
    else {
        artistList = arrayData.data
            .filter((item) => item.artistList.length > 0)
            .map((item, index) => renderEdmResult(item));
        $('.js-search-results').html(artistList.slice(0,12).join(''));
    }

    setTimeout(function(){
        $('html, body').animate({scrollTop:$('.js-search-results').position().top}, 'slow');
    }, 1000)
};

//Appends the artists name and date
function renderEdmResult(data){

    const artistName = data.artistList[0].name;
    // let date = data.date.slice(5);

    let month = convertDateToMonth(data.date);

    return `
    <div class="col-3 button-centered">
            <button class="artist-name">${artistName}</button>
            <div class="date-position">${month}</div>
    </div>`;
}

/*                                           YOUTUBE API                                       */


function getDataFromApi(searchTerm, callback){
    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            q: searchTerm,
            part: "snippet",
            key: "AIzaSyC68NGJp8YjxtvckrxeRGQ3JvCf3E4MJVU",
            maxResults: 8
        },
        dataType: "json",
        type: "GET",
        success: callback
        };
        $.ajax(settings);
}

function renderYoutubeResult(result){
    return `
    <div class="col-3 youtube-video">
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}"  
          target="_blank"><img alt="youtube video" 
          src="${result.snippet.thumbnails.medium.url}"/>
      </a>
    </div
  `;
}

function displayYouTubeSearchData(data) {
    const results = data.items.map((item, index) => renderYoutubeResult(item));
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

function convertDateToMonth(firstTwoDigits){

    let month = '';

    Object.keys(months).forEach(keys => {

        if(firstTwoDigits.slice(5,7) == months[keys]){
            month = keys;
        }
    });

    let monthAndDate = month + ' ' + firstTwoDigits.slice(-2).toString();

    return monthAndDate;
}

//listen when the user interacts with the page

function watchSubmit(){

    $('.js-search-form').submit(event => {
        event.preventDefault();

        let userInput = true;

        const state = $(event.currentTarget).find('.states').val();
        const city = $(event.currentTarget).find('.cities').val();

        if(state === 'state'){
            alert('Please pick a state');
            userInput = false;
        }

        if(userInput){
            //grabs location ID from API call
            getLocationFromUser(city, state, getLocationId);

            //waits for data to come in, then displays
            setTimeout(function(){ 
                getDataFromLocation(USER.locationId, displayEdmSearchData);
                $('.tracks').hide();
                $('.youtube').hide();
                $('.artists').show();
            }, 3000);
        }    
    })

    $('.js-search-results').on('click','.artist-name', event => {
        console.log(event.currentTarget);
        $('.youtube').show();
        event.stopPropagation();
        const queryTarget = $(event.currentTarget);
        const query = queryTarget.text();

        console.log(query)

        YOUTUBE_SEARCH.artist = query;

        let youtubeSearchQuery = `${YOUTUBE_SEARCH.artist} edm`;

        queryTarget.val("");
        getDataFromApi(youtubeSearchQuery, displayYouTubeSearchData); 
        
        setTimeout(function(){
            $('html, body').animate({scrollTop:$('.js-search-results').position().top}, 'slow');
        }, 1000)
    })
}


$(function(){

    //adjust the container's height to its current viewport
    let window_size = $(window).height();

    $('.container').css('height',window_size);

    appendStates(stateCities);
});

$(changeCity);
$(watchSubmit);