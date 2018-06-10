const _fetchBestClients = require('./app');
const SECOND_TEST_CASE  = './test/transaction_data_2.csv';
const NUMBER_OF_CUSTOMERS = 2;

_fetchBestClients(SECOND_TEST_CASE, NUMBER_OF_CUSTOMERS)
.then( result => console.log(result) )
.catch( error => console.log(error) );;