const mongoose = require('mongoose');

function connection(){
    mongoose.connect('mongodb://localhost:27017/flask', {
    }).then(db => console.log('[OK] MongoDB connected'))
    .catch(err => console.log(err));
}

connection();