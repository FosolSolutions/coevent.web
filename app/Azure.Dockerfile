# Stage 1 - the build process
FROM node:10-slim as build-deps

# install build toolchain
RUN apt-get update \
    && apt-get install --no-install-recommends -y dumb-init \
    && rm -rf /var/lib/apt/lists/*

# set entrypoint to `dumb-init` as it handles being pid 1 and forwarding signals
# so that you dont need to bake that logic into your node app
ENTRYPOINT ["dumb-init", "--"]

WORKDIR /usr/app

# install a specific NPM version
RUN npm install -g npm@6.9.0

COPY package*.json ./

RUN npm set progress=false \
    && npm ci

COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM nginx:stable-alpine

COPY --from=build-deps /usr/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
