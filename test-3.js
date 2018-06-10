const _fetchBestClients     = require('./app');
const THIRD_TEST_CASE       = './test/transaction_data_3.csv';
const NUMBER_OF_CUSTOMERS   = 3;

_fetchBestClients(THIRD_TEST_CASE, NUMBER_OF_CUSTOMERS)
.then( result => console.log(result) )
.catch( error => console.log(error) );