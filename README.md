# <p style= 'color: blue'>ChatrBoxx</p>

Click here to go to ChatrBoxx! ---> <a href='https://chatrboxx.herokuapp.com/'>ChatrBoxx</a>

Trello link ---> <a href='https://trello.com/b/LDeR7xz5/project-4-chatrbox'>Trello </a>


## Intro, Technologies and Installation

Intro: This is a chatting app, plain and simple. <br/>

Node.js was used along express.js and several npm packages (see Trello PACKAGE.JSON). Mostly though, this app utilizes websockets provided by  <a href='https://socket.io/'>socket.io</a>. Using websockets allows for messages to be rendered automatically on client side, without needing to refresh the page.</br>

The giphy API was utilized. Thank you <a href='https://giphy.com/'>Giphy</a>. Users can click on the GIF! button to post a random GIF that matches the query, and if there is no match, nothing will be submitted.


## Startup Instructions and functionality
First and foremost, only users who are signed up and logged in can access the app. Its FREEE! <br/><br/>
Two <i> super </i> models are used in this app.  </br></br> The first model is the users. Users can edit their name and email address, which appears in the users list on the home page. </br> </br>
The second model is the chats. This model belongs to the user, in other words, every chat will have the user's name who posted it.

## General Approach

We first started to build the chat functionality using Socket.io and build the authentication aspect using passport. After that, we continued by making the views, routes, as well as integrating the Giphy API to gather random GIFs. 

## Installation Instructions

1. Download the package file 
2. in the terminal, go into the package file and run: 'npm install'
3. From the same directory, open two new tabs to run nodemon and mongo

## <p style= 'color: #5f0f82'>Bugs and future additions</p>

### Bugs 

1. App layout is not optimal for mobile and non-fullscreen use.
2. Password cannot be changed.

### Dream Additions

1. When GIF! button pressed, create a pop up window where a number of gifs appear, which can be clicked and then displayed </br>
2. Private chat rooms </br>
3. Incognito Chat </br>
4. We're thinking about it!

