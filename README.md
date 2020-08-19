## Events List NodeJS App

Technologies

- NodeJS
- Express Framework
- Request package (for HTTP call to other server)

### Sample calls

Format
`http://localhost:4000/api/list/<type>[/<count>]`

where type can "free" or "paid" or "all"
count is optional integer to fetch only that many records

```
http://localhost:4000/api/list/paid
http://localhost:4000/api/list/free
http://localhost:4000/api/list/all
http://localhost:4000/api/list/paid/10
http://localhost:4000/api/list/free/20
http://localhost:4000/api/list/all/10
```
