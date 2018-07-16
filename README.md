![cf](https://i.imgur.com/7v5ASc8.png) Lab 16: Basic Authentication
======

## Travis badge
[![Build Status](https://travis-ci.org/kgamer007/16-19-auth-asset-mgt.svg?branch=master)](https://travis-ci.org/kgamer007/16-19-auth-asset-mgt)

## Heroku
https://lab-16-19-kevin.herokuapp.com/


## API Endpoints
POST api/signup
Creates new user account. Body request must include a username, password and email.
```
http POST localhost:3000/api/signup username=Paul password=aslkdjf email='wonderworld@somemail.com'
```

GET api/login
This route requires the username and password to be base 64 encrypted
