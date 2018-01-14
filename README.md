# JSON.encodeCirculars
Replaces circular references with JSON path to the first occurence of the object.

Prevents:
```
> const myArray = [12, 'abc']
undefined
> myArray[2] = myArray
[ 12, 'abc', [Circular] ]
> JSON.stringify(myArray)
TypeError: Converting circular structure to JSON
```

Outputs:
```
> const myArray = [12, 'abc']
> myArray[2] = myArray
[ 12, 'abc', [Circular] ]
> JSON.encodeCirculars(myArray)
[ 12, 'abc', { '$ref': '$' } ]
```


# JSON.decodeCirculars
Replaces JSON paths with referenced object.
Outputs:
```
> const myArray = [ 12, 'abc', { '$ref': '$' } ]
undefined
> JSON.decodeCirculars(myArray)
[ 12, 'abc', [Circular] ]
```


## Tests
- ```npm install``` To install all dependencies
- ```npm run test``` To run unit tests
