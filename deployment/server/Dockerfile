FROM java:8

LABEL name "PRAiSE Web Demonstration"
LABEL maintainer "Ira Miller <ira.miller@sri.com>"

# Add the server software (built in a custom tgz using the `../package.sh` command)
ADD contents.tgz /

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash - && \
    apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
  && rm -rf /var/lib/apt/lists/* \
  && npm install
#    build-essential \


ADD entrypoint.sh entrypoint.sh

ENV JAR_PATH praise.jar
ENV PORT 3000
ENV NODE_ENV production

WORKDIR /

EXPOSE 3000/tcp 3000

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "praise-server" ]
