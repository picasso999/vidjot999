if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://user:user@ds151355.mlab.com:51355/vidjot-prod'}
} else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}