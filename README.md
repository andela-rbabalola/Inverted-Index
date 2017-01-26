# Inverted-Index Application
[![Coverage Status](https://coveralls.io/repos/github/andela-rbabalola/Inverted-Index/badge.svg?branch=development)](https://coveralls.io/github/andela-rbabalola/Inverted-Index?branch=development)
[![Build Status](https://travis-ci.org/andela-rbabalola/Inverted-Index.svg?branch=development)](https://travis-ci.org/andela-rbabalola/Inverted-Index)

This application implements an Inverted Index data structure. This data structure allows search for words in text blocks to be quick and efficient. You can read more about Inverted indexes [here](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)

## About the Application
To use this application, upload any JSON file of your choice that has the format below:
```
[
  {
    'title': 'Harry Potter',
    'text': 'A young orphan becomes a powerful wizard'
  },
  {
    'title': 'James Bond',
    'text': 'A British spy takes on dangerous criminal organizations'
  }
]
```
This application creates an Inverted Index from each text property of the JSON file. After creating the index, you can search for a word (or multiple words) in a single file or all files.

## Using the Application

#### Online
This application is hosted on Heroku and can be accessed through this [link] (https://inverted-index-application.herokuapp.com)

#### Local installation
This app can be installed and run locally. Follow the steps below
- Clone this repo
```
git clone https://github.com/andela-rbabalola/Inverted-Index.git
```
- Install dependencies (Ensure you have [Node.js] (nodejs.org) installed first)
```
npm install
```
- Run tests
```
npm test
```
- To start the application, run the following command
```
npm start
```
This launches the app on your default browser on http://localhost:3002

## This application was designed & built with the following technologies
- Angular JS: Adding extra functionality to the HTML elements
- Bootstrap: For styling the web page
- TravisCI: Continuous integration for the repo and build badge
- HoundCI: Checks for style violations
