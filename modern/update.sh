#!/bin/bash

yarn build
cp ./build /home/aneopsy/Dev/traccar/modern -Rf

docker build -t aneopsy/aitotracker /home/aneopsy/Dev/traccar
docker push aneopsy/aitotracker
