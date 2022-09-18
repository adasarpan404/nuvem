const userModel = require('../Model/user.model')
const CatchAsync = require('../Utils/CatchAsync')
const jwt = require('jsonwebtoken')
const signToken = id => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signup = CatchAsync(async(req, res, next)=>{
    console.log(req.body)
    const {firstName, lastName} = req.body;
    const user = await userModel.create({
        firstName: firstName,
        lastName: lastName,
        userId: `${firstName}-${lastName}-${Date.now()}`
    })
    createSendToken(user, 201, res);
})

exports.login = CatchAsync(async(req, res, next)=>{
    const { userId } = req.body;
    if (!userId) {
        return next(new AppError('please provide email and password', 400));
    }
    const user = await userModel.findOne({ userId })
    if (!user) {
        return next(new AppError('incorrect email and password', 401))
    }
    createSendToken(user,200, res);
})