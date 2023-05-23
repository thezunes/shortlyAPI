import joi from 'joi';

const signupSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password:joi.string().min(6).required(),
});

const signinSchema = joi.object({
    email: joi.string().email().max(255).required(),
    password: joi.string().required(),
});

export {signupSchema,signinSchema};