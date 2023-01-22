const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { update } = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { Router } = require('express')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET requests not available')
//     }  else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Currently down for maintanance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () =>{
    console.log('Server is up on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

const main = async () =>{
    const user = await User.findById('63cbdf453a9525360054f2d9')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}


main()