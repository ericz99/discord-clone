FROM public.ecr.aws/bitnami/node:12

WORKDIR /usr/src/app

# copy packge lock over
COPY package*.json ./

# run clean install production
RUN npm ci --production

# build dist
RUN npm run build

# only copy dist over
COPY /dist ./

# run node index.js
CMD [ "node", "index.js" ]