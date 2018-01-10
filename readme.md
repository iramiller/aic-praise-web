# PRAiSE Web Demonstration Server

This project is a simple web server and client browser interface used to test and demonstrate the capabilities of the AIC-PRAiSE library.

## Getting Started

 - Clone and build a copy of the [SRI AIC PRAiSE](1) software.
 - Place a copy of the AIC-PRAiSE with dependencies jar file in the `./server` folder or set an environment variable `JAR_PATH` with the full path to the jar.
 - Run `npm install` within the `server` folder
 - Run `npm start` to launch a copy of the server
 - Open a web browser and connect to `http://localhost:3000` to view the interface

### Containerization

The PRAiSE web demonstration system is designed to be hosted within a docker container.  The software can be packaged and built into an image using the `./deployment/package.sh` script.  Once the image is built it can be launched with:

    docker run -p 3000:3000 -it --rm CONTAINER_TAG_NAME_OR_HASH_ID

#### Acknowledgements

SRI International gratefully acknowledges the support of the Defense Advanced Research Projects Agency (DARPA) Machine Reading Program, and Probabilistic Programming for Advanced Machine Learning Program, under Air Force Research Laboratory (AFRL) prime Contract Nos. FA8750-09-C-0181 and FA8750-14-C-0005, respectively. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the view of DARPA, AFRL, or the US government.

[1](https://github.com/aic-sri-international/aic-praise)
