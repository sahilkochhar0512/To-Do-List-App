const express=require("express");
const bodyParser=require("body-parser");
//Below is our own module created
const date=require(__dirname+"/date.js")
const mongoose=require("mongoose");
const app=express();
const _=require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//telling express to use static files like css in the public folder
app.set('view engine', 'ejs');

day=date.getDay();
    //or we can say day=date.getDate()
    //since our module can export values from different functions

//connecting mongoose with database
mongoose.connect("mongodb://127.0.0.1:27017/listDB", {useNewUrlParser:true});

const itemSchema= new mongoose.Schema({
    name:String});

const Item=mongoose.model("Item",itemSchema);
const item1= new Item({
    name:"Coding"});

const item2= new Item({
    name:"Web Dev"});

const item3= new Item({
    name:"Project"});

const defaultItems=[item1,item2,item3];



const listSchema=new mongoose.Schema({
    name: String,
    items: [itemSchema]});

const List=mongoose.model("List", listSchema);

//First our home route will get a request to add a title that is the current date
app.get("/", function(req,res){

//using our mongoose model to find all data in it
    Item.find({}, function(err,foundItems){
        if(foundItems.length===0)
        {
    //Using our Item Model to insert data
            Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);}
            else{
                console.log("Success");};
            });
            res.redirect("/");
        }
        else {
            res.render("list", {listTitle:day, newListItems:foundItems});
    }
    });


    //kindOfDay is a variable inside ejs in which we will put the  value of day
    //express will look into the folder views to see if there is a file called list
    });

app.get("/:customListName", function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName}, function(err, foundList){
    if(!err){
        if(!foundList){
        const list=new List({
        name: customListName,
        items: defaultItems});
        list.save();
        res.redirect("/"+customListName);}
        else{
        res.render("list",{listTitle:customListName, newListItems:foundList.items});
        };
        };
        });
    });

//app.get("/work", function(req,res){
//    res.render("list", {listTitle: "Work List", newListItems:workItems});
//    });

//Second our home route will get a call when user enters a list item
//This will redirect to our home route if the call is made from home route page
//This will redirect to our work route if the call is made from work route page
app.post("/", function(req,res){
        //Getting access to what item is entered
        const newItem=req.body.newItem;
        //Getting access to which list is it coming from
        const listName=req.body.list;
        const item= new Item({
        name:newItem});
        if(listName===day){
        //saving the item in our database using save
        item.save();
        //Then redirecting to our home route to show it on website
        res.redirect("/");
        }
        else{
        List.findOne({name:listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);})
        };

    });

//Delete request received from delete form
app.post("/delete", function(req,res){
    const listName=req.body.listName;
    if(listName===day){
    Item.findByIdAndRemove({_id: req.body.checkbox}, function(err){
    if(err){
    console.log(err);}
    else {
    console.log("Successfully Removed");
    res.redirect("/");};});}
    else{
    //We want to update a value in a list of items
    // $pull removes an item from an array of items
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: req.body.checkbox}}}, function(err){
    if(!err){
    res.redirect("/"+listName);}
    else{
    console.log(err);
    };});
    };
    });



app.listen(3000,function(){
console.log("Listening on port 3000");});
