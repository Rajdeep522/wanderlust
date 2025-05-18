const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const Listing=require("./models/listing");
const methodOverride = require('method-override'); 


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


// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"it is my vila",
//         price:5000,
//         location: "westbengal",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// })

app.get("/listing",async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});
    // res.render("someView", { body: "Content goes here" });

})

app.get("/listing/new",async(req,res)=>{
    res.render("listing/new.ejs");
})


app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
})


app.post("/listing",async(req,res)=>{
    const NewListing=new Listing(req.body.listing);
    await NewListing.save();
    res.redirect("/listing");
})


//edit the listing
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
})


//creating the update route

app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing,{new:true});
    res.redirect(`/listing/${listing._id}`);
    })

//deleting the listing

app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})













app.get('/',(req,res)=>{
    res.send('root is running');
})
app.listen(8080,()=>{
    console.log('server is listening is port 8080')
})