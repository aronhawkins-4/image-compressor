FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4322
EXPOSE 4322
CMD node ./dist/server/entry.mjs
