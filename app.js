const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const Listing=require("./models/listing");
const methodOverride = require('method-override'); 
const wrapeAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');


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

// show route

app.get("/listing",wrapeAsync( async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});
    // res.render("someView", { body: "Content goes here" });

}));

app.get("/listing/new",wrapeAsync(async(req,res)=>{
    res.render("listing/new.ejs");
}));


app.get("/listing/:id",wrapeAsync(async(req,res,next)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listing/show.ejs",{listing});
    
}))


app.post("/listing",wrapeAsync(async(req,res,next)=>{
    if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
    if(!req.body.listing.title) throw new ExpressError(400,"Title is required");
    if(!req.body.listing.price) throw new ExpressError(400,"Price is required");
    if(!req.body.listing.description) throw new ExpressError(400,"Description is required");
    if(!req.body.listing.location) throw new ExpressError(400,"Location is required");
    if(!req.body.listing.country) throw new ExpressError(400,"country is required");
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

app.put("/listing/:id",wrapeAsync(async(req,res)=>{
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