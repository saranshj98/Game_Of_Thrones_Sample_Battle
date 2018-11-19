# Game_Of_Thrones_Sample_Battle API

### Tools needed to run and test app
1. Nodejs and npm


### Steps to install app
1. git clone https://github.com/saranshj98/Game_Of_Thrones_Sample_Battle.git
2. cd Game_Of_Thrones_Sample_Battle
3. nodemon install (if don't have nodemon, you can use npm or do 'npm install -g nodemon')
4. nodemon server/app.js or npm run start (this will start app and listen at localhost:8080)


### Using the api (I suggest to use postman to test rest end points)
##### below end points have been designed and working according to given 
assignment requirement

###### GET localhost:8080/api/battles/count
###### GET localhost:8080/api/battles/list
###### GET localhost:8080/api/battles/stats
###### GET localhost:8080/api/battles/search

##### Search api receives query params or else throw 404 error
###### example
###### localhost:8080/api/battles/search?attacker_king=Robb Stark
###### localhost:8080/api/battles/search?attacker_king=Robb Stark&location=Darry&type=pitched battle


### to run test cases
1. npm run test