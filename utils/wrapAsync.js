module.exports= function wrapeAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}