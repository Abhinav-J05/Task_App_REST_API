const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    age:{
        type: Number
    },
    password:{
        type: String,
        required: true,
        trim: true,
    
        validate(value){
            if(!value.includes(value)){
                throw new Error('PASSWORD PROBLEM!')
            }
        }
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('NOT VALID')
            }
        }
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }        
    }]
}, {
    timestamps: true
}) 

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject  = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'thisisnewproject')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    console.log('kaam kar rha h')
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id})

    next()
})


const User = new mongoose.model('User', userSchema)


module.exports = User