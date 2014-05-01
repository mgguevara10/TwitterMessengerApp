"use strict";
var myTwitter = {};

//base url
myTwitter.db = "https://tuita.firebaseio.com/";

//variable that stores our information
myTwitter.myProfile;

//holds tweets for sorting
myTwitter.tweets = [];

//Profile Constructor
myTwitter.Profile = function (name, biography, pictureUrl, personUrl) {
    this.userName           = name;
    this.Tweets             = [];
    this.Friends            = [];
    this.biography          = biography;
    this.pictureUrl         = pictureUrl;
    this.personalUrl        = personalUrl;
};

//Tweets Constructor
myTwitter.Tweets = function (message) {
    this.message    = message;
    this.time       = Date.now();
};

//constructs the url for use in the AJAX calls
myTwitter.urlMaker = function (base, array) {
    var url = base;

    if (array) {

        for (var x in array) {
            url += x + "/";
        }

    }
    

    url += ".json";

    return url;
};

//Master AJAX
myTwitter.Ajax = function (method, url, callback, async, data) {
    var request = new XMLHttpRequest();

    request.open(method, url, async);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            if(callback){callback();}
        } else {
            console.log("Error " + this.status);
        }
    }

    request.onerror = function () {
        console.log("Communication Error");
    }

    request.send(data)
};

//Create Profile
myTwitter.AddProfile = function () {
    //grab elements
    var name        = document.getElementById("nameInput");
    var biography   = document.getElementById("biography");
    var pictureUrl  = document.getElementById("pictureUrl");
    var personalUrl = document.getElementById("personalUrl");

    var profile = new myTwitter.Profile(name.value, biography.value, pictureUrl.value, personalUrl.value);
    
    profile = JSON.stringify(profile);

    var url = myTwitter.urlMaker(myTwitter.db, []);

    //postin profile to the database with no callback
    myTwitter.Ajax("POST",url , null, true, profile);

    name.value          = " ";
    biography.value     = " ";
    pictureUrl.value    = " ";
    personalUrl.value   = " ";

};

//Read  -- "GET"
myTwitter.Redraw = function () {
    //grab
    var tableBody = document.getElementById("tbody");


};

//Update
myTwitter.Update = function () { };
//Delete
myTwitter.DeleteProfile = function () { };

//Get Tweets
myTwitter.CreateTweet = function () {
    var message = document
};
//sending a tweet
myTwitter.sendTweet = function () {
    //grab
    var message = document.getElementById("message");

    var tweet = new myTwitter.Tweets(message);

    var url = myTwitter.urlMaker(myTwitter.db, []);

    myTwitter.Ajax("POST", url, null, true, tweet);

    message.value = " ";
};




