const express=require("express"); 
const app= express();  

app.get("/", function(req,res){
    res.send("Welcome to the my nft back")
  });

app.listen(5000, function(){
        console.log("SERVER STARTED ON localhost:5000");     
})