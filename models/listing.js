const mongoose=require("mongoose");
const Review=require("./review.js");
const listingSchema= new mongoose.Schema({
    title: {
        type: String,
        require: !true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type:String,
            default: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
        // require: true,
       
    },
    price: Number,
    location: {
        type: String,
        require:true,
    },
    country: String,
    //creating a reference to the review model
    Reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
})

// middleware to delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.Reviews}});     
    }
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;