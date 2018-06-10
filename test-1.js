const _fetchBestClients = require('./app');

//it will run test 1 by default
_fetchBestClients()
.then( result => console.log(result) )
.catch( error => console.log(error) );