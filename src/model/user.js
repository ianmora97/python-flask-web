const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model('User', userSchema);

exports.get = async () => {
    const users = await User.find();
    return users;
};

exports.getById = async (data) => {
    const user = await User.findById(data.id);
    return user;
};

exports.create = async (data) => {
    const user = await User.create(data);
    return user;
};

exports.update = async (data) => {
    const user = await User.findByIdAndUpdate(data.id, data);
    return user;
};

exports.delete = async (data) => {
    await User.findByIdAndDelete(data.id);
    return true;
};