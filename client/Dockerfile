FROM public.ecr.aws/bitnami/node:12

WORKDIR /usr/src/app

COPY package.*json ./

RUN yarn install

COPY . .

CMD ["npm", "run", "start"]

