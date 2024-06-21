# Task Project management
## project task management REST API

### Requirements
- [Node.js](https://nodejs.org)
- [Yarn](https://classic.yarnpkg.com)
- [nvm](https://github.com/nvm-sh/nvm)
- [Docker](https://docs.docker.com/get-docker/)
- [mongoDB](https://hub.docker.com/_/mongo)
- [mongo-express](https://hub.docker.com/_/mongo-express)

### Get Started
1. Open with code editor eg: [vscode](https://code.visualstudio.com/download)
2. Make sure you are in the root project directory
3. Rename `env-example` to `.env`


### Run with docker
1. Make sure you have already .env
2. Make sure you are in the root project directory
3. Run project with docker compose
```
docker compose up --build -V
```
4. The app will running on default port `*:3000`
5. Test the API with postman 

### Development
1. open terminal switch node version with 
```
nvm use
```
2. Install dependencies with
```
yarn install --frozen-lockfile
```
3. Run backing service with
```
docker compose up db_ptm db_browser_ptm
```
4. Run migration with (make sure you in project directory)
```
yarn db:migrate:up
```
5. run the project with 
```
yarn dev
```
6. Open mongo express in your browser with address `http://localhost:8081`
```
username: admin
password: admin
```
6. The app will running following variable `APP_PORT` in `.env`


### API Docs
- [Docs](https://documenter.getpostman.com/view/32128861/2sA3XV8zRh)

### Contributor
- [Rifky](https://github.com/mqnoy/)
