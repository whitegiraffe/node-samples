
exports.setupenv = function(){
    process.env.HOST = (process.env.HOST || 'localhost');
    process.env.PORT = (process.env.PORT || 3000);
    process.env.MONGO_URI = (process.env.MONGO_URI || 'localhost:27017/test');
};