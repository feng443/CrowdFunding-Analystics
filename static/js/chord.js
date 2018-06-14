console.log('begin')

country_url = '/data/country'
//country_url = 'static/csv/test.csv'

//TODO: fix SyntaxError: Unexpected token N in JSON at position 13701
d3.json(country_url, function(error, data) {
    if (error) return console.log(error)
    console.log('read json')
    console.log(data)
    console.log('done read json')
    return data
})


//console.log('end')