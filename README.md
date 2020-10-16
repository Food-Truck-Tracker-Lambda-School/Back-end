# Back-end

Deploy Link - https://foodtrucktrackers.herokuapp.com/


# /api/auth

## POST /login
##### Required Body
```
{
  username,
  password
}
```
##### Returns
```
{
  id,
  username,
  roleId,
  token
}
```

## POST /register
##### Required Body
```
{
  username,
  password,
  roleId,
  name,
  phoneNumber,
  email
}
```
##### Returns
```
{
  {
    id,
    username,
    roleId,
    token
  }
}
```
