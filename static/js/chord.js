console.log('begin')

country_url = '/data/country'
loan_lender_url = '/data/monthly_loan_lender_summary/2016/05'
//country_url = 'static/csv/test.csv'

//TODO: fix SyntaxError: Unexpected token N in JSON at position 13701

d3.queue()
.defer(d3.json, country_url)
.defer(d3.json, loan_lender_url)
.await(function(error, countryData, loanLenderData) {
    if (error) return console.log(error)
    console.log('read json')
    console.log(countryData)
    console.log('loan lender data')
    console.log(loanLenderData)
    console.log('done read json')
})


//console.log('end')