﻿"use strict";
//--------------------------------------------------------Admin-------------------------------
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

//Friend Constructor
myTwitter.Friend = function (url) {
    this.url = url;
}

//constructs the url for use in the AJAX calls
myTwitter.urlMaker = function (base, array) {
    var url = base;

    if (array) {
        for (var x in array) {
            url += array[x] + "/";
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
            var response = JSON.parse(this.response);
            if(callback){callback(response);}
        } else {
            console.log("Error " + this.status);
        }
    }

    request.onerror = function () {
        console.log("Communication Error");
    }
    request.send(data);
};

//------------------------------------------------Profile Crud---------------------------Im not 100% sure we need this, I think we Only need the Update 

//Create Profile   ----- May not need
myTwitter.AddProfile = function () {
    //grab elements
    var name        = document.getElementById("nameInput");
    var biography   = document.getElementById("biography");
    var pictureUrl  = document.getElementById("pictureUrl");
    var personalUrl = document.getElementById("personalUrl");

    var profile = new myTwitter.Profile(name.value, biography.value, pictureUrl.value, personalUrl.value);
    
    profile = JSON.stringify(profile);
    myTwitter.myProfile = profile;

    var url = myTwitter.urlMaker(myTwitter.db, []);

    //postin profile to the database with no callback
    myTwitter.Ajax("POST",url , null, true, profile);

    name.value          = " ";
    biography.value     = " ";
    pictureUrl.value    = " ";
    personalUrl.value   = " ";

};

//Read  -- "GET"
myTwitter.GetProfile = function () {

    var url = myTwitter.urlMaker(myTwitter.db, ["Profile"]);
    console.log(url);
    myTwitter.Ajax("GET", url, myTwitter.DisplayProfile, true, null);

};

        // Callback used in the Get Profile method.  After we get the data we want to display it. this method outlines the how that data will be displayed
myTwitter.DisplayProfile = function (data) {
    var userName = document.getElementById("userName");
    //TODO finish this method to add all profile information to page
    userName.innerText = data.userName;
};

//Update -- Profile
myTwitter.UpdateProfile = function () { };

//Delete -- Profile //may not need
myTwitter.DeleteProfile = function () { };

//--------------------------------------------------Tweet Crud------------------------------
//Create
//sending a tweet
myTwitter.sendTweet = function () {
    //TODO add the tweets to the tweets array
    var message = document.getElementById("message");
    
    var tweet = new myTwitter.Tweets(message.value);
    
    tweet = JSON.stringify(tweet);

    var url = myTwitter.urlMaker(myTwitter.db, ["/Tweets/"]);

    myTwitter.Ajax("POST", url, null, true, tweet);

    message.value = " ";
};

//Read
myTwitter.GetTweets = function () {
    var url = myTwitter.urlMaker(myTwitter.db, ["/Tweets/"]);

    myTwitter.Ajax("GET", url, myTwitter.DisplayTweets, true, null);

};

    //Callback for GetTweets that displays the tweets on the page
myTwitter.DisplayTweets = function (data) {
    //TODO take this data and use the properties to display on the page.
};

//Update
myTwitter.UpdateTweet = function () { };

//Delete Tweet
myTwitter.DeleteTweet = function () { };

//--------------------------------------------------Friend Crud--------------------------
//Create 
myTwitter.followFriend = function () {
    //we need to get the url that is entered into the input box in the nav bar
    //send it to the database and put it in our array

    var friend = document.getElementById("FriendUrl");

    var nowFollowing = new myTwitter.Friend(friend.value);
    var url = myTwitter.urlMaker(myTwitter.db, ["/Friends/"]);

    nowFollowing = JSON.stringify(nowFollowing);

    

    myTwitter.Ajax("POST", url, myTwitter.redrawFriends, true, nowFollowing);

    friend.value = " ";
};

//Read 
myTwitter.GetFriends = function () { };

    //Callback for GetFriends that displays the people you follow on the page.
myTwitter.redrawFriends = function (data) { console.log(data);};

//Delete  --- unfollow
myTwitter.unfollowFriend = function () { };

//------------------------------------------------------------------------------------------

myTwitter.GetProfile();

