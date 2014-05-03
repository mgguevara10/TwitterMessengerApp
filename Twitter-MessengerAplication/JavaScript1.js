"use strict";
//--------------------------------------------------------SETUP-------------------------------
var myTwitter = {};

//base url
myTwitter.db = "https://tuita.firebaseio.com/";

//holds tweets for sorting
myTwitter.tweets = [];

//holds list of our friends
myTwitter.FriendsUrl = [];
myTwitter.FriendObjects = [];

//Tweets Constructor
myTwitter.Tweets = function (message) {
    this.message    = message;
    this.time       = Date.now();
};

//Friend Constructor
myTwitter.Friend = function (url) {
    this.friendUrl = url;
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
        console.log("Communication Error" + this.response);
    }
    if (data) {
        request.send(data);
    } else {
        request.send();
    }
    
};

//------------------------------------------------Profile Crud---------------------------Im not 100% sure we need this, I think we Only need the Update 

//Read  -- "GET"
myTwitter.GetProfile = function (profileUrl) {
    var url;

    if (profileUrl) {
        url = myTwitter.urlMaker(profileUrl, ["/Profile"]);
    } else {
        url = myTwitter.urlMaker(myTwitter.db, ["Profile"]);
    }
    console.log(url);
    

    myTwitter.Ajax("GET", url, myTwitter.DisplayProfile, true, null);

};

        // Callback used in the Get Profile method.  After we get the data we want to display it. this method outlines the how that data will be displayed
myTwitter.DisplayProfile = function (data) {
    var userName  = document.getElementById("userName");
    var biography = document.getElementById("bio");
    var picture = document.getElementById("picture");
    //data { name: "Andre", biography: "student ..............

    //TODO finish this method to add all profile information to page
    userName.innerText  = data.userName;
    biography.innerText = data.biography;
    picture.setAttribute("src", data.pictureUrl);

};

//Update -- Profile
myTwitter.UpdateProfile = function () {
    
};


//--------------------------------------------------Tweet Crud------------------------------
//Create
//sending a tweet
myTwitter.sendTweet = function () {
    //TODO add the tweets to the tweets array
    var message = document.getElementById("message");
    
    myTwitter.Lasttweet = new myTwitter.Tweets(message.value);
    
    var tweet = JSON.stringify(myTwitter.Lasttweet);

    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Tweets/"]);

    //firebase.com/Tweets/(tweetKey)/
    //Change this to have a callback that places the key or a tweet in the tweets array.
    myTwitter.Ajax("POST", url, myTwitter.addTweetKey, true, tweet);

    message.value = " ";
};

myTwitter.addTweetKey = function (data) {
    myTwitter.Lasttweet.key = data.name;

    myTwitter.tweets.push(myTwitter.Lasttweet);

    myTwitter.Lasttweet = null;

    myTwitter.RedrawTweets();

};

//Read  --gets all of my tweets \ for now 
myTwitter.GetTweets = function () {
    var url = myTwitter.urlMaker(myTwitter.db, ["Profile/Tweets/"]);

    //all friends tweets we need to do a for loop. 
    // for ever friend our Friends array we need to pass
    //Their url into the urlMaker function and do a get request
    // and store the tweet in our tweets array.

    myTwitter.Ajax("GET", url, myTwitter.fillTweetsArray, true, null);

};


    //Callback for GetTweets adds all tweets to array
myTwitter.fillTweetsArray = function (data) {
    
    
    for (var x in data) {
        data[x].key = x;
        myTwitter.tweets.push(data[x]);
    }

    myTwitter.RedrawTweets();
    
};

myTwitter.RedrawTweets = function () {
    var tweetsList = document.getElementById("tweets");
    myTwitter.Sort();
    tweetsList.innerHTML = " ";

    for (var i = 0; i < myTwitter.tweets.length; i++) {

        tweetsList.innerHTML += "<li>" + myTwitter.tweets[i].message + '<button class="btn btn-default" onclick="myTwitter.Edit(\'' + myTwitter.tweets[i].key + '\')">Edit</button><button class="btn btn-danger" onclick="myTwitter.DeleteTweet(\'' + myTwitter.tweets[i].key + '\')">Delete</button> </li>';

    }
};

myTwitter.Sort = function () {

};

//Edit
myTwitter.EditTweet = function (key) {
    var message = document.getElementById("message").value;
    
    myTwitter.Lasttweet = new myTwitter.Tweets(message);

    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Tweets/" + key])

    for (var i = 0; i < myTwitter.tweets.length; i++) {
        if (myTwitter.tweets[i].key === key) {
            myTwitter.tweets.splice(i, 1, myTwitter.Lasttweet);
        }
    }

    var tweet = JSON.stringify(myTwitter.Lasttweet);

    myTwitter.Ajax("PUT", url, myTwitter.RedrawTweets, true, tweet);

    document.getElementById("message").value = " ";
};

    //Edit -- in this method we find the object (tweet) we want to update and place it somewhere so that we can make changes. The update method actually makes the Ajax call.
myTwitter.Edit = function (key) {
    var messagebox = document.getElementById("message");
    var submitChanges = document.getElementById("submitChanges");

    for (var i = 0; i < myTwitter.tweets.length; i++) {
        if (myTwitter.tweets[i].key === key) {
            messagebox.value = myTwitter.tweets[i].message;
        }
    }

    submitChanges.setAttribute("onclick","myTwitter.EditTweet(\'"+key+"\')");
};

//Delete Tweet
myTwitter.DeleteTweet = function (key) { 
    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Tweets/" + key]);

    myTwitter.Ajax("DELETE", url, null, true, null);

    for (var i = 0; i < myTwitter.tweets.length; i++) {
        if(myTwitter.tweets[i].key === key){
            myTwitter.tweets.splice(i,1);
        }
    }

    myTwitter.RedrawTweets();
};


//Sort the Tweet by time
myTwitter.SortTweet = function () { };

//--------------------------------------------------Friend Crud--------------------------

//Create 
myTwitter.followFriend = function () {
    //we need to get the url that is entered into the input box in the nav bar
    //send it to the database and put it in our array

    var friend = document.getElementById("FriendUrl");

    var nowFollowing = new myTwitter.Friend(friend.value);
    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Friends/"]);

    nowFollowing = JSON.stringify(nowFollowing);

    myTwitter.Ajax("POST", url, myTwitter.redrawFriends, true, nowFollowing);

    friend.value = " ";
};

//Read 
myTwitter.GetFriends = function () {
    var url = myTwitter.urlMaker(myTwitter.db, ["Profile/Friends/"]);

    myTwitter.Ajax("GET", url, myTwitter.FriendsToArray, true, null);
};

    //Callback for GetFriends that displays the people you follow on the page.
myTwitter.FriendsToArray = function (data) {
    //[url, url, url...
    for (var x in data) {
        myTwitter.FriendsUrl.push(data[x].friendUrl);
    }

    myTwitter.GetFriendProfile();
};

//Get request to get the profile data from a given url
myTwitter.GetFriendProfile = function () {
    var url;
    //make urls
    for (var i = 0; i < myTwitter.FriendsUrl.length; i++) {
        url = myTwitter.urlMaker(myTwitter.FriendsUrl[i], ["Profile/"]);

        myTwitter.Ajax("GET", url, myTwitter.GetFriendProfileCallBack, true, null);
    }
};

//we want to get the friends a friend object into the Friends Objects array
myTwitter.GetFriendProfileCallBack = function(data){
    myTwitter.FriendObjects.push(data);
    myTwitter.DrawFriends();
};

//Display
myTwitter.DrawFriends = function () {
    var friendslist = document.getElementById("friendslist");
    console.log(myTwitter.FriendObjects);
    for (var i in myTwitter.FriendObjects) {
        friendslist.innerHTML += '<li onclick="myTwitter.GetProfile(\''+myTwitter.FriendObjects[i].personalUrl+'\')">' + myTwitter.FriendObjects[i].userName + '</li>';
    }

};

//Read 2 ---- Friends of Friends
myTwitter.FoF = function () {
    //for each friend in our friends 
    //list we want to read their friendslist and 
    //add it to our FoF array

};

//Delete  --- unfollow
myTwitter.unfollowFriend = function () {
    
};

//Sort the friends array by name
myTwitter.SortFriends = function (friends) { };

//------------------------------------------------------------------------------------------
// We also want to Poll for tweets -I think

//Notes during post of tweet POST - push to array - get Id from the response
//Delete delete then splice out of the array 
//Update 

myTwitter.GetProfile(null);
myTwitter.GetTweets();
myTwitter.GetFriends();


