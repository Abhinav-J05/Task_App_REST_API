const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewURLParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//end