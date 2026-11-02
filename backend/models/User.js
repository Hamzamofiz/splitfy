const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please add a name'],
        trim: true,
    },
    email:{
        type:String,
        required:[true, 'please add an email'],
        unique:true,
        lowercase: true,
        trim : true,
    },
    password:{
        type:String,
        required: [true, 'Please add a password'],
        minlength: 6,
    },
    role:{
        type:String,
        enum:['roommate','group_leader', 'tenant', 'landlord'],
        default:'roommate'
     },
     phone:{
        type : String,
        trim : true,
     },
     roomId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Room', 
        default: null,
     },
    },
    {timestamps:true,
}
);

module.exports = mongoose.model('User', userSchema )