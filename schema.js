
// install the npm pacage "joi" and validate the schema using these code


const joi = require('joi');
module.exports.listingSchema = joi.object({
    listing:joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.string().required().min(0),
        country:joi.string().required()
    }).required(),
});

module.exports.reviewSchema = joi.object({
    Review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required(),
});