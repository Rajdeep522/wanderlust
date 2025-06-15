const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const Listing=require("./models/listing");
const methodOverride = require('method-override'); 
const wrapeAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const {listingSchema, reviewSchema}=require('./schema.js');
const Review=require("./models/review.js");

const cors = require('cors');
app.use(cors());



const ejsmate=require('ejs-mate');
app.engine('ejs',ejsmate);


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));

main()
    .then(()=>{
        console.log('MongoDB is connected');
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}



// creating a middleware to schema validation
const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,message);
    }else{
        next();
    }
}


//creating a middleware for review validation
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,message);
    }else{
        next();
    }
}


// show route

app.get("/listing",wrapeAsync( async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});
    // res.render("someView", { body: "Content goes here" });

}));

app.get("/listing/new",wrapeAsync(async(req,res)=>{
    res.render("listing/new.ejs");
}));


// show route

app.get("/listing/:id",wrapeAsync(async(req,res,next)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id).populate('Reviews');
        res.render("listing/show.ejs",{listing});
    
}))




// create route

app.post("/listing",validateListing,wrapeAsync(async(req,res,next)=>{ 
    const NewListing=new Listing(req.body.listing);
    await NewListing.save();
    res.redirect("/listing");
    
    
}));


//edit the listing
app.get("/listing/:id/edit",wrapeAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
}));


//creating the update route

app.put("/listing/:id",validateListing,wrapeAsync(async(req,res)=>{
    if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing,{new:true});
    res.redirect(`/listing/${listing._id}`);
    }));

//deleting the listing

app.delete("/listing/:id",wrapeAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));



// post route
// for reviews
app.post("/listing/:id/reviews",validateReview, wrapeAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReviews=new Review(req.body.Review);

    listing.Reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listing/${listing._id}`);
}));



// delete route for Review

app.delete("/listing/:id/reviews/:reviewId",wrapeAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{Reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));




//error handler middleware
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});



app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});


app.get('/',(req,res)=>{
    res.send('root is running');
})
app.listen(8000,()=>{
    console.log('server is listening is port 8080')
})