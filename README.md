# Back-end

### Base URL - https://foodtrucktrackers.herokuapp.com/

- [Server Info](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#server-info)
  - [Get Roles](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-roles)
  - [Get Cuisines](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-cuisines)
- [Authentication Routes](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#authentication-routes)
  - [User Sign In](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#user-sign-in)
  - [User Sign Up](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#user-sign-up)
- [Truck Routes](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#truck-routes)
  - [Get All Trucks](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-a-list-of-all-trucks)
  - [Get All Trucks in Radius](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-all-trucks-within-radius)
  - [Get truck with id](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-basic-information-for-a-specific-truck)
  - [Get Truck Ratings](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-all-ratings-for-a-specific-truck)
  - [Get Truck Menu](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-all-menu-items-for-a-specific-truck)
- [Diner Routes](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#diner-routes)
  - [Get Diner](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-all-of-a-diners-information)
  - [Get Diner Favorites](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-a-diners-list-of-favorite-trucks)
  - [Add Favorite](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#add-a-new-truck-to-a-users-favorite-list)
  - [Remove Favorite](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#remove-a-truck-from-a-users-favorite-list)
  - [Get Diner's Ratings](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-all-ratings-a-user-has-submitted)
- [Operator Routes](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#operator-routes)
  -[Get Operator's Trucks](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-operators-trucks)
  -[Add New Truck](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#add-new-truck)
  -[Get Specified Truck](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-specified-truck)
  -[Edit Truck](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#edit-truck)
  -[Remove Truck](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#remove-truck)
  -[Get Truck's Menu](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#get-trucks-menu)
  -[Add Item to Truck's Menu](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#add-item-to-trucks-menu)
  -[Remove Item from Truck's Menu](https://github.com/Food-Truck-Tracker-Lambda-School/Back-end#remove-item-from-trucks-menu)


---------------------------------------------

## Server Info
### Get Roles
#### GET */api/roles*
gets all roles available for a user
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/roles')
```
##### Response
```
[
  {
    id: 1,
    role: 'user'
  },
  {
    id: 2,
    role: 'owner'
  }
]
```

### Get Cuisines
#### GET */api/cuisines*
gets all roles available for a user
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/cuisines')
```
##### Response
```
[
  {
    "id": 0,
    "name": "other"
  },
  {
    "id": 1,
    "name": "african"
  },
  {
    "id": 2,
    "name": "american"
  },
  {
    "id": 3,
    "name": "asian"
  },
  {
    "id": 4,
    "name": "cuban"
  },
  {
    "id": 5,
    "name": "european"
  },
  {
    "id": 6,
    "name": "mexican"
  },
  {
    "id": 7,
    "name": "middle eastern"
  },
  {
    "id": 8,
    "name": "south american"
  },
  {
    "id": 9,
    "name": "bakery"
  },
  {
    "id": 10,
    "name": "breakfast"
  },
  {
    "id": 11,
    "name": "treats"
  }
]
```


## Authentication Routes

### User Sign In
#### POST */api/auth/login*
Authenticates user's credentials, returns JSON object with token
##### Request
```
Axios.post('https://foodtrucktrackers.herokuapp.com/api/auth/register, {
  username: 'bilbo',
  password: 'baggins'
})
```
##### Response
```
{
  id: 1,
  username: 'bilbo',
  roleId: '1',
  name: 'gandalf',
  phoneNumber: 3608675309,
  email: 'bagend@shire.me',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNjAyODI0NzY1LCJleHAiOjE2MDI5MTExNjV9.72QcurVABMnlGP0COF08bEB05NE_SbzJrfvw7-HKhYo',
}
```
### User Sign Up
#### POST */api/auth/register*
Registers a new user account in the database
##### Request
```
Axios.post('https://foodtrucktrackers.herokuapp.com/api/auth/register, {
  username: 'bilbo',
  password: 'baggins',
  roleId: '1',
  name: 'gandalf',              //optional
  phoneNumber: 3608675309,      //optional
  email: 'bagend@shire.me',
})
```
##### Response
```
{
  id: 1,
  username: 'bilbo',
  roleId: '1',
  name: 'gandalf',
  phoneNumber: 3608675309,
  email: 'bagend@shire.me',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNjAyODI0NzY1LCJleHAiOjE2MDI5MTExNjV9.72QcurVABMnlGP0COF08bEB05NE_SbzJrfvw7-HKhYo',
}
```

## Truck Routes

### Get a list of all Trucks
#### GET */api/trucks/*
Retrieves a list of all trucks in the database and returns a json object containing an array of all truck data
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/trucks')
```
##### Response
```
[
  {
    "id": 1,
    "name": "truck of today",
    "location": "37.422161 -122.084267",     
    "departureTime": "1602876339100",
    "cuisineId": 0,
    "photoId": 1,
    "photoUrl": "http://www.google.com"
  },
  {
    "id": 2,
    "name": "truck of tomorrow",
    "location": "47.639881 -122.124382",     
    "departureTime": "1602876339100",
    "cuisineId": 4,
    "photoId": 2,
    "photoUrl": "http://www.microsoft.com"
  }
]
```

### Get all trucks within radius
#### GET */api/trucks?location=$location&radius=$radius
Retrieves a list of all trucks in a given radius around a location
##### Request
```
  Axios.get(`https://foodtrucktrackers.herokuapp.com/api/trucks?location=${location}&radius=${50}`)
```
*not implemented*

### Get basic information for a specific truck
#### GET /api/trucks/:id
Retrieves all the base information for the specified truck and returns a JSON object
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/trucks/1')
```
##### Response
```
{
  "id": 1,
  "name": "truck of today",
  "location": "37.422161 -122.084267",     
  "departureTime": "1602876339100",
  "cuisineId": 0,
  "photoId": 1,
  "photoUrl": "http://www.google.com"
}
```

### Get all ratings for a specific truck
#### GET /api/trucks/:id/ratings
Retrieves all ratings for a truck and returns a JSON object containing an array of all review values
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/trucks/1/ratings')
```
##### Response
```
[
  3,
  4,
  2,
  5,
  1
]
```

### Get all menu items for a specific truck
#### GET /api/trucks/:id/menu
Retrieves a list of all menu items for a specified truck, and returns a JSON object containing all relevent information
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/trucks/1/menu')
```
##### Response
```
[
  {
    "id": 1,
    "name": "pizza",
    "price": 12.99,
    "description": "Delicious",
    "photos": [
      {
        "id": 1,
        "url": "http://google.com"
      }
    ],
    "ratings": [
      4,
      2,
      1,
      5
    ]
  }
]
```


## Diner Routes
### Get all of a diner's information
#### GET /api/diner/:id
# Warning, returns a large object, only use if you need everything all at once
Returns all information availible from diner route in a single object
##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/diner/1')
```
##### Response
```
{
  "favorites": [
    {
      "id": 1,
      "name": "truck of today",
      "location": "37.422161 -122.084267",     
      "departureTime": "1602876339100",
      "cuisineId": 0,
      "photoId": 1,
      "photoUrl": "http://www.google.com"
    },
    {
      "id": 2,
      "name": "truck of tomorrow",
      "location": "47.639881 -122.124382",     
      "departureTime": "1602876339100",
      "cuisineId": 4,
      "photoId": 2,
      "photoUrl": "http://www.microsoft.com"
    }
  ],
  "ratings": [
    {
      "id": 1,
      "name": "truck of today",
      "rating": 0,
      "menuItemRatings": [
        {
          "truckId": 1,
          "truckName": "truck of today",
          "id": 1,
          "name": "pizza",
          "rating": 0
        },
        {
          "truckId": 1,
          "truckName": "truck of today",
          "id": 2,
          "name": "tacos",
          "rating": 0
        }
      ]
    },
    {
      "id": 2,
      "name": "truck of tomorrow",
      "menuItemRatings": [
        {
          "truckId": 2,
          "truckName": "truck of tomorrow",
          "id": 3,
          "name": "nachos",
          "rating": 0
        }
      ]
    }
  ]
}
```

### Get a diner's list of favorite trucks
#### GET /api/diner/:id/favorites

##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/diner/1/favorites')
```
##### Response
```
[
  {
    "id": 1,
    "name": "truck of today",
    "location": "37.422161 -122.084267",     
    "departureTime": "1602876339100",
    "cuisineId": 0,
    "photoId": 1,
    "photoUrl": "http://www.google.com"
  },
  {
    "id": 2,
    "name": "truck of tomorrow",
    "location": "47.639881 -122.124382",     
    "departureTime": "1602876339100",
    "cuisineId": 4,
    "photoId": 2,
    "photoUrl": "http://www.microsoft.com"
  }
]
```

### Add a new truck to a user's favorite list
#### POST /api/diner/:id/favorites

##### Request
```
  Axios.post('https://foodtrucktrackers.herokuapp.com/api/diner/1/favorites', {
    truckId: 3
  })
```
##### Response
```
[
  {
    "id": 1,
    "name": "truck of today",
    "location": "37.422161 -122.084267",     
    "departureTime": "1602876339100",
    "cuisineId": 0,
    "photoId": 1,
    "photoUrl": "http://www.google.com"
  },
  {
    "id": 2,
    "name": "truck of tomorrow",
    "location": "47.639881 -122.124382",     
    "departureTime": "1602876339100",
    "cuisineId": 4,
    "photoId": 2,
    "photoUrl": "http://www.microsoft.com"
  },
  {
    "id": 3,
    "name": "truck of yesterday",
    "location": "37.394798 -121.952911",     
    "departureTime": "1602876339100",
    "cuisineId": 9,
    "photoId": 3,
    "photoUrl": "https://en.wikipedia.org/wiki/Sun_Microsystems"
  },
]
```

### Remove a truck from a user's favorite list
#### DELETE /api/diner/:id/favorite/:fId

##### Request
```
  Axios.delete('https://foodtrucktrackers.herokuapp.com/api/diner/1/favorite/1')
```
##### Response
```
  *204 - no content*
```

### Get all ratings a user has submitted
#### GET /api/diner/:id/ratings

##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/diner/1/ratings')
```
##### Response
```
[
  {
    "id": 1,
    "name": "truck of today",
    "rating": 5,
    "menuItemRatings": [
      {
        "truckId": 1,
        "truckName": "truck of today",
        "id": 1,
        "name": "pizza",
        "rating": 1
      },
      {
        "truckId": 1,
        "truckName": "truck of today",
        "id": 2,
        "name": "tacos",
        "rating": 5
      }
    ]
  },
  {
    "id": 2,
    "name": "truck of tomorrow",
    "menuItemRatings": [
      {
          "truckId": 2,
          "truckName": "truck of tomorrow",
          "id": 3,
          "name": "nachos",
          "rating": 2
      }
    ]
  }
]
```

## Operator Routes

### Get Operator's Trucks
#### GET /api/operator/:id/trucks/

##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks')
```
##### Response
```
  [
    {
      "id": 1,
      "name": "truck of today",
      "userId": 1,
      "location": "here",
      "cuisineId": 0,
      "photoId": 1,
      "departureTime": null
    },
    {
      "id": 3,
      "name": "Truck of an Alternate Timeline",
      "userId": 1,
      "location": "another world",
      "cuisineId": 9,
      "photoId": 1,
      "departureTime": null
    }
]
```

### Add New Truck
#### POST /api/operator/:id/trucks/

##### Request
```
  Axios.post('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks' , {
    "name": "truck of today",
    "userId": 1,
    "location": "here",
    "cuisineId": 0,
    "photoId": 1,
  })
```
##### Response
```
  {
    "id": 1,
    "name": "truck of today",
    "userId": 1,
    "location": "here",
    "cuisineId": 0,
    "photoId": 1,
    "departureTime": null
  }
```

### Get Specified Truck
#### GET /api/operator/:id/trucks/:tId

##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1')
```
##### Response
```
  {
    "id": 1,
    "name": "truck of today",
    "userId": 1,
    "location": "here",
    "cuisineId": 0,
    "photoId": 1,
    "departureTime": null
  }
```

### Edit Truck
#### PUT /api/operator/:id/trucks/:tId

##### Request
```
  Axios.put('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1', {
    "name": "truck of today",
    "location": "here",
    "cuisineId": 0,
    "photoId": 1,
    "departureTime": "10/17/2020 12:00:00PST"
  })
```
##### Response
```
  {
    "id": 1,
    "name": "truck of today",
    "userId": 1,
    "location": "here",
    "cuisineId": 0,
    "photoId": 1,
    "departureTime": "10/17/2020 12:00:00PST"
}
```

### Remove Truck
#### DELETE /api/operator/:id/trucks/:tId

##### Request
```
  Axios.delete('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1')
```
##### Response
```
  204 - no response
```

### Get Truck's Menu
#### GET /api/operator/:id/trucks/:tId/menu

##### Request
```
  Axios.get('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1/menu')
```
##### Response
```
  [
    {
      "id": 1,
      "name": "pizza",
      "price": 12.99,
      "description": "delicious"
    },
    {
      "id": 4,
      "name": "orange chicken",
      "price": 15.99,
      "description": "amazing"
    },
]
```

### Add Item to Truck's Menu
#### POST /api/operator/:id/trucks/:tId/menu/

##### Request
```
  Axios.post('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1/menu', {
    "name": "french toast",
    "price": 9.99,
    "description": "toast covered in eggs and spices, fried in butter"
  })
```
##### Response
```
  [
    {
      "id": 1,
      "name": "pizza",
      "price": 12.99,
      "description": "delicious"
    },
    {
      "id": 4,
      "name": "orange chicken",
      "price": 15.99,
      "description": "amazing"
    },
    {
      "id": 5,
      "name": "french toast",
      "price": 9.99,
      "description": "toast covered in eggs and spices, fried in butter"
    }
]
```

### Remove item from Truck's menu
#### DELETE /api/operator/:id/trucks/:tId/menu/:mId

##### Request
```
  Axios.delete('https://foodtrucktrackers.herokuapp.com/api/operator/1/trucks/1/menu/1')
```
##### Response
```
  204 - no response
```


