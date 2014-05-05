"use strict";
//--------------------------------------------------------SETUP-------------------------------
var myTwitter = {};

//base url
myTwitter.db = "https://tuita.firebaseio.com/";

//holds tweets for sorting
myTwitter.tweets = [];
myTwitter.FObj = [];

//holds list of our friends
myTwitter.FriendsUrl = [];
myTwitter.Friends = [];
myTwitter.FriendObjects = [];
myTwitter.Otherstweets = [];
myTwitter.FirstGetTweets = [];

//Tweets Constructor
myTwitter.Tweets = function (message) {
    this.message = message;
    this.time = Date.now();
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
            url += array[x];
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
            if (callback) { callback(response); }
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
myTwitter.GetProfile = function () {
    var url;

    url = myTwitter.urlMaker(myTwitter.db, ["Profile"]);
    myTwitter.Ajax("GET", url, myTwitter.DisplayProfile, true, null);
    

};

// Callback used in the Get Profile method.  After we get the data we want to display it. this method outlines the how that data will be displayed
myTwitter.DisplayProfile = function (data) {
    if (data) {
        myTwitter.myProfile = data;
    }

    var userName = document.getElementById("userName");
    var biography = document.getElementById("bio");
    var picture = document.getElementById("picture");
    //data { name: "Andre", biography: "student ..............

    //TODO finish this method to add all profile information to page
    userName.innerText = myTwitter.myProfile.userName;
    biography.innerText = myTwitter.myProfile.biography;
    picture.setAttribute("src", myTwitter.myProfile.pictureUrl);
    picture.setAttribute("height", "150px");
    picture.setAttribute("width", "150px");

    
    if (data) {
        myTwitter.GetFriends(null);
    }

    

};

myTwitter.DisplayProfileAfterFA = function (data) {
    var userName = document.getElementById("userName");
    var biography = document.getElementById("bio");
    var picture = document.getElementById("picture");
    //data { name: "Andre", biography: "student ..............

    //TODO finish this method to add all profile information to page
    userName.innerText = myTwitter.myProfile.userName;
    biography.innerText = myTwitter.myProfile.biography;
    picture.setAttribute("src", myTwitter.myProfile.pictureUrl);
    picture.setAttribute("height", "400px");
    picture.setAttribute("width", "400px");

    //
    updateProfile.innerText = "Update Profile";
    updateProfile.setAttribute("onclick", "myTwitter.EditProfile()");
}

//Update -- Profile
myTwitter.UpdateProfile = function () {
    var urls = [];
    var bio = document.getElementById("updateBio");
    var pic = document.getElementById("updatePic");
    var userN = document.getElementById("updateUserName");

    if (bio.value !== "") {
        myTwitter.myProfile.biography = bio.value
        urls.push([myTwitter.urlMaker(myTwitter.db, ["Profile/biography"]), bio.value]);
    }

    if (pic.value !== "")
    {
        myTwitter.myProfile.pictureUrl = pic.value;
        urls.push([myTwitter.urlMaker(myTwitter.db, ["Profile/pictureUrl"]), pic.value]);
    }

    if (userN.value !== "")
    {
        myTwitter.myProfile.userName = userN.value;
        urls.push([myTwitter.urlMaker(myTwitter.db, ["Profile/userName"]), userN.value]);
    }


    for (var x in urls) {

        var data = JSON.stringify(urls[x][1]);

        myTwitter.Ajax("PUT", urls[x][0], myTwitter.DisplayProfileAfterFA, true, data);
    }
    
      
    
    
};

//Edit Profile
myTwitter.EditProfile = function () {
    var userName = document.getElementById("userName");
    var bio = document.getElementById("bio");
    var updateProfile = document.getElementById("updateProfile");

    userName.innerHTML = "<input class=\"col-md-12\"type=\"text\" id=\"updateUserName\" placeholder=\"" + myTwitter.myProfile.userName + "\"/>";
    bio.innerHTML = "<input type=\"text\" id=\"updateBio\" placeholder=\"" + myTwitter.myProfile.biography + "\"/>";
    bio.innerHTML += "<br/><input type=\"text\" id=\"updatePic\" placeholder=\"" + myTwitter.myProfile.pictureUrl + "\"/>"

    updateProfile.innerText = "Submit Changes";
    updateProfile.setAttribute("onclick", "myTwitter.UpdateProfile()");
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
    myTwitter.Lasttweet.ours = true;

    myTwitter.tweets.push(myTwitter.Lasttweet);

    myTwitter.Lasttweet = null;

    myTwitter.RedrawTweets();

};

//Read  --gets all of my tweets \ for now 
myTwitter.GetTweets = function (urlparam) {
    if (urlparam) {
        var url = myTwitter.urlMaker(urlparam, ["Profile/Tweets/"]);
    } else {
        var url = myTwitter.urlMaker(myTwitter.db, ["Profile/Tweets/"]);
    }
    

    //all friends tweets we need to do a for loop. 
    // for ever friend our Friends array we need to pass
    //Their url into the urlMaker function and do a get request
    // and store the tweet in our tweets array.

    myTwitter.Ajax("GET", url, myTwitter.fillTweetsArray, true, null);

};

myTwitter.GetAllTweets = function () {
    document.getElementById("tbody").innerHTML = " ";
    myTwitter.tweets = [];
    var url = myTwitter.urlMaker(myTwitter.db, ["Profile/Tweets"]);
    myTwitter.Ajax("GET", url, myTwitter.fillOurTweetsArray, true, null);

    for (var i = 0; i < myTwitter.FriendsUrl.length; i++) {
        var f_url = myTwitter.urlMaker(myTwitter.FriendsUrl[i], ["Profile/"]);
        myTwitter.Ajax("GET", f_url, myTwitter.fillTweetsArray, true, null);
    }
    
}

//Callback for GetTweets adds all tweets to array
myTwitter.fillTweetsArray = function (data) {
    myTwitter.FObj.push(data);

    var lastObj = myTwitter.FObj[myTwitter.FObj.length - 1];

    for (var x in lastObj.Tweets)
    {
        lastObj.Tweets[x].userName = lastObj.userName;
        lastObj.Tweets[x].pictureUrl = lastObj.pictureUrl;
        lastObj.Tweets[x].personalUrl = lastObj.personalUrl;
        lastObj.Tweets[x].ours = false;

        myTwitter.tweets.push(lastObj.Tweets[x]);
    }
    myTwitter.FirstGetTweets = myTwitter.tweets;
    
    myTwitter.RedrawTweets();
    
};

myTwitter.fillOurTweetsArray = function (data) {
    for (var x in data) {
        data[x].ours = true;
        data[x].key = x;
        myTwitter.tweets.push(data[x]);
    }
}

myTwitter.RedrawTweets = function () {
    var tweetsList = document.getElementById("tbody");
    myTwitter.Sort();
    tweetsList.innerHTML = " ";
    
    for (var i = 0; i < myTwitter.tweets.length; i++) {
        var time = new Date(myTwitter.tweets[i].time).toLocaleDateString()
        if (myTwitter.tweets[i].ours) {
            tweetsList.innerHTML += '<div class="col-md-12 tuit"><div class="col-md-2"><img class="Tuitpic" height="75px" width="75px" src="' + myTwitter.myProfile.pictureUrl + '"></div><div class="col-md-push-1 col-md-8"><h5>@' + myTwitter.myProfile.userName + '</h5><p class="tmess">' + myTwitter.tweets[i].message + "</p><span class=\"pull-right\">" + time + '<span class="glyphicon glyphicon-wrench" onclick="myTwitter.Edit(\'' + myTwitter.tweets[i].key + '\')"></span><span class="glyphicon glyphicon-trash" onclick="myTwitter.DeleteTweet(\'' + myTwitter.tweets[i].key + '\')"></span> </span></div></div>';
        } else {
            tweetsList.innerHTML += '<div class="col-md-12 tuit"><div class="col-md-2"><img class="Tuitpic" height="75px" width="75px" src="' + myTwitter.tweets[i].pictureUrl + '"></div><div class="col-md-push-1 col-md-8"> <h5 data-toggle="modal" data-target="#myModal" onclick="myTwitter.ViewFriendProfile(\'' + myTwitter.tweets[i].personalUrl + '\')">@' + myTwitter.tweets[i].userName + '</h5><p class="tmess">' + myTwitter.tweets[i].message + "</p><span class=\"pull-right\">" + time + "</span></div></div>";
        }
            
   
    }
};

//
myTwitter.Sort = function () {
    myTwitter.tweets.sort(function (a, b) {
        if (a.time > b.time)
            return -1;
        if (a.time < b.time)
            return 1;
        // a must be equal to b
        return 0;
    });
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

    submitChanges.setAttribute("onclick", "myTwitter.EditTweet(\'" + key + "\')");
};

//Delete Tweet
myTwitter.DeleteTweet = function (key) {
    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Tweets/" + key]);

    myTwitter.Ajax("DELETE", url, null, true, null);

    for (var i = 0; i < myTwitter.tweets.length; i++) {
        if (myTwitter.tweets[i].key === key) {
            myTwitter.tweets.splice(i, 1);
        }
    }

    myTwitter.RedrawTweets();
};

//--------------------------------------------------Friend Crud--------------------------

//Create 
myTwitter.followFriend = function () {
    //we need to get the url that is entered into the input box in the nav bar
    //send it to the database and put it in our array

    var friend = document.getElementById("FriendUrl");
    var friendUrl = "https://" + friend.value + ".firebaseio.com/";

    var nowFollowing = new myTwitter.Friend(friendUrl);
    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Friends/"]);
    myTwitter.FriendsUrl.push(friendUrl);
    nowFollowing = JSON.stringify(nowFollowing);

    myTwitter.Ajax("POST", url, myTwitter.GetLastFriendProfile, true, nowFollowing);

    friend.value = " ";
};

//Read 
myTwitter.GetFriends = function (urlparam) {
    if (!urlparam) {
        var url = myTwitter.urlMaker(myTwitter.db, ["Profile/Friends/"]);

        myTwitter.Ajax("GET", url, myTwitter.FriendsToArray, true, null);
    } else {
        var url = myTwitter.urlMaker(urlparam, ["Profile/Friends/"]);

        myTwitter.Ajax("GET", url, myTwitter.FriendsToArray2, true, null);
    }
    
};

//Callback for GetFriends that displays the people you follow on the page.
myTwitter.FriendsToArray = function (data) {
    //[url, url, url...
    for (var x in data) {
        myTwitter.FriendsUrl.push(data[x].friendUrl);
    }
    myTwitter.GetAllTweets();
    myTwitter.GetFriendProfile();
};

//Get request to get the profile data from a given url
myTwitter.GetFriendProfile = function (key) {
    var url;
   
    //make urls
    for (var i = 0; i < myTwitter.FriendsUrl.length; i++) {
        url = myTwitter.urlMaker(myTwitter.FriendsUrl[i], ["Profile/"]);

        myTwitter.Ajax("GET", url, myTwitter.GetFriendProfileCallBack, true, null);
    }
    
    
};

myTwitter.GetLastFriendProfile = function (key) {
    var url;

    //make urls
    url = myTwitter.urlMaker(myTwitter.FriendsUrl[myTwitter.FriendsUrl.length -1], ["Profile/"]);

    myTwitter.Ajax("GET", url, myTwitter.GetFriendProfileCallBack, true, null);
    


};

//we want to get the friends a friend object into the Friends Objects array
myTwitter.GetFriendProfileCallBack = function (data) {
    myTwitter.FriendObjects.push(data);
    myTwitter.DrawFriends();
};

//Display
myTwitter.DrawFriends = function () {
    var friendslist = document.getElementById("friendslist");
    friendslist.innerHTML = " ";

    myTwitter.SortFriends();

    for (var i in myTwitter.FriendObjects) {
        friendslist.innerHTML += '<p data-toggle="modal" data-target="#myModal" onclick="myTwitter.ViewFriendProfile(\'' + myTwitter.FriendObjects[i].personalUrl + '\')">' + myTwitter.FriendObjects[i].userName + '</p> <span class="glyphicon glyphicon-remove"></span>';
        
    }

};

//Sort the friends array by name
myTwitter.SortFriends = function () {
    myTwitter.FriendObjects.sort(function (a, b) {
        if (a.userName > b.userName)
            return 1;
        if (a.userName < b.userName)
            return -1;
        // a must be equal to b
        return 0;
    });
};

//ViewFriendProfile
myTwitter.ViewFriendProfile = function (urlparam) {
    var url = myTwitter.urlMaker(urlparam, ["/Profile"]);
    myTwitter.Ajax("GET", url, myTwitter.DisplayFriendProfile, true, null);
};

//Displays Modal
myTwitter.DisplayFriendProfile = function (data) {
    var name = document.getElementById("myModalLabel");
    var profilePic = document.getElementById("profilePic");
    var friendsList = document.getElementById("friendsList");
    var biography = document.getElementById("biography2");
    var friendTweets = document.getElementById("friendTweets");
    var headingFT = document.getElementById("ftweets");

    headingFT.innerText = data.userName + "'s Tweets";
    name.innerText = data.userName;
    biography.innerText = data.biography;
    profilePic.setAttribute("src", data.pictureUrl);
    
    friendsList.innerHTML += '<span class="FoFTitle"> Friends List </span>';
    for (var x in data.Friends) {

        friendsList.innerHTML += '<span class="FoFlist" onclick="myTwitter.FOF(\'' + myTwitter.getDbname(data.Friends[x].friendUrl) + '\')" data-dismiss="modal">' + myTwitter.getDbname(data.Friends[x].friendUrl) + "</span>";
    }

    
    for (var x in data.Tweets) {
        friendTweets.innerHTML += '<div class="tuit">' + data.Tweets[x].message + "</div>";
    }

};

myTwitter.FOF = function (name) {
    var friendUrl = "https://" + name + ".firebaseio.com/";

    var nowFollowing = new myTwitter.Friend(friendUrl);

    var url = myTwitter.urlMaker(myTwitter.db, ["/Profile/Friends/"]);

    myTwitter.FriendsUrl.push(friendUrl);
    nowFollowing = JSON.stringify(nowFollowing);

    myTwitter.Ajax("POST", url, myTwitter.GetLastFriendProfile, true, nowFollowing);
}

myTwitter.getDbname = function (str) {
    str = str.split("");
    var secondslash = str.indexOf("/") + 2;
    str.splice(0, secondslash);


    var firstdot = str.indexOf(".");

    str.splice(firstdot, str.length);

    str = str.join("");
    return str;
};
//Helper to format the friend string
//

myTwitter.ClearModal = function () {
    document.getElementById("friendsList").innerHTML = " ";
    document.getElementById("friendTweets").innerHTML = " ";
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



//------------------------------------------------------------------------------------------
// We also want to Poll for tweets -I think

//Notes during post of tweet POST - push to array - get Id from the response
//Delete delete then splice out of the array 
//Update 

myTwitter.GetProfile(null);

document.getElementById("message").onclick = function () {
    document.getElementById("message").setAttribute("rows", "4");
};

