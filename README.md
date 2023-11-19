# FilesFromYou

## Introduction

FilesFromYou 🚀 is transforming the file sharing business by making it super easy to share files between your friends and family.

In this code we have a CPU usage measuring component as well as a server to receive the data, plus a frontend to display the info to the user.

## Setup
You will need:

server/.env file with the following (sensitive values have been removed):

PORT=8080
MONGO_DB_NAME=cpu-usage
MONGO_DB_URL=mongodb://127.0.0.1:27017/cpu-usage
ENVIRONMENT=development

client/.env

WEB_SOCKET_URL=ws://localhost:8080
HTTP_URL=http://localhost:8080

## Notes
- Please note that to import the models package use `npm link models`
- As this is a local project I have used seed data to populate the DB
- I have provided a hard coded value for the logged in user's ID