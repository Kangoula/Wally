#!/bin/bash

docker-compose -f docker/docker-compose.yml up -d
sleep 10 
nodemon server.js


