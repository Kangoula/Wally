#!/bin/bash

docker-compose -f docker/docker-compose.yml up -d

nodemon server.js


