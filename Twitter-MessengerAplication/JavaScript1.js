"use strict";
//--------------------------------------------------------SETUP-------------------------------
var myTwitter = {};

//base url
myTwitter.db = "https://tuita.firebaseio.com/";

//variable that stores our information
myTwitter.myProfile;

//holds tweets for sorting
myTwitter.tweets = [];

//holds list of our friends
myTwitter.Friends = [];

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
myTwitter.GetProfile = function (profileUrl) {
    var url;
    console.log(url);
    if (profileUrl) {
        url = myTwitter.urlMaker(profileUrl, ["Profile"]);
    } else {
        url = myTwitter.urlMaker(myTwitter.db, ["Profile"]);
    }
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

//Read  --gets all of my tweets \ for now 
myTwitter.GetTweets = function () {
    var url = myTwitter.urlMaker(myTwitter.db, ["/Tweets/"]);

    //all friends tweets we need to do a for loop. 
    // for ever friend our Friends array we need to pass
    //Their url into the urlMaker function and do a get request
    // and store the tweet in our tweets array.

    myTwitter.Ajax("GET", url, myTwitter.DisplayTweets, true, null);

};


    //Callback for GetTweets that displays or lists the tweets on the page
myTwitter.DisplayTweets = function (data) {
    //TODO take this data and use the properties to display on the page.
};

//Update
myTwitter.UpdateTweet = function () {

};

    //Edit -- in this method we find the object (tweet) we want to update and place it somewhere so that we can make changes. The update method actually makes the Ajax call.
myTwitter.Edit = function () { };

//Delete Tweet
myTwitter.DeleteTweet = function () { };

//Sort the Tweet by time
myTwitter.SortTweet = function () { };

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
myTwitter.redrawFriends = function (data) { console.log(data); };

//Read 2 ---- Friends of Friends
myTwitter.FoF = function () {
    //for each friend in our friends list we want to read their friendslist and add it to our FoF array

};

//Delete  --- unfollow
myTwitter.unfollowFriend = function () { };

//Sort the friends array by name
myTwitter.SortFriends = function (friends) { };

//------------------------------------------------------------------------------------------

myTwitter.GetProfile(null);

