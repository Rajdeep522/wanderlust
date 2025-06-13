const mongoose=require("mongoose");
const listingSchema= new mongoose.Schema({
    title: {
        type: String,
        require: !true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
        // require: true,
        // default: ,
    },
    price: Number,
    location: {
        type: String,
        require:true,
    },
    country: String,
    //creating a reference to the review model
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
})

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;