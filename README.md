Express server 

REST API, using:
Node.js / Javascript / Express / MongoDB / Axios / Multer / etc
Tutorial Source: Academind on Youtube (thanks a lot!)


REST:
Representational State Transfer (request / response)
DB <<->>  Server <<->> Client(browser/App) 
Restful APIs are Stateless backends

Ex: 
Constraints:
-	Client-Server Architecture
-	Stateless
-	Cache-ability
-	Layered System
-	Uniform Interface
-	Code on Demand (optional)
 

API - Project Setup for this Scrambler:
- /pictures
    -get
	-post
- /pictures/{id}
    -get
	-patch
	-delete
- /user
    -get		
	-post
- /user/{id}
    -get
	-patch
	-delete
From those routes, I used as examples to make users and pictures entities, as pictures need to get the userId to make a relationship between them.