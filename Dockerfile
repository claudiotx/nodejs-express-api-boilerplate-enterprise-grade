FROM node:carbon

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . /opt/app

RUN cd /opt/app
RUN \
  npm install -g typescript && \
  npm install pm2 -g -y

RUN npm i

RUN npm run build

EXPOSE 7777
CMD [ "pm2-runtime", "pm2.json" ]