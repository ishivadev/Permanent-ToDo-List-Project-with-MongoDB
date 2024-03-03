import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';



const app = express();
const port = 3000;
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let tasks = []

//Initializing the collection schema
const listSchema = new mongoose.Schema ({
  title: String
});

//Creating "todoList" model
const todoList = mongoose.model("ListCol", listSchema);

//Sample collections
const milk = new todoList ({ title: "Buy Milk" });
const homework = new todoList ({  title: "Finish Homework" });

//Fetch data from table
app.get("/", (req, res) => {
  // Find all todos in the database
  todoList.find()
  .then(function(listcols) {
    items = [];
    // Iterate over each todo in the listcols array
    listcols.forEach(function(data){
      // Add the todo title to the items array
      items.push(data);
      console.log(`Titles available in the list: ${data.title}`);
          });
   
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items
    });
  }) 
  .catch(function(err){
      console.log(err); // Log any errors that occurred during the database query to the console
  });
});


//Insert a data in the db
app.post("/add", (req, res) => {
  todoList.create( { title: req.body.newItem })
    .then(() => {
      res.redirect("/");
      console.log("Successfully saved the todo in todoList.");
    })
    .catch((err) => {
      console.log(err);
    });
});

//Edit a existing collection record
app.post("/edit", async(req, res) => {
  
  // Create a new ObjectId instance with the updatedItemId parameter from the request body
  const objectId = new ObjectId(req.body.updatedItemId);

  todoList.updateOne( { _id:objectId }, { $set: {title: req.body.updatedItemTitle } } )
    .then( () => {
      res.redirect("/");
      console.log("Data updated successfully.");
    })
    .catch( (err) => {
      console.log(err.message);
    })
})

//Delete a collection from DB
app.post("/delete", async(req, res) => {

  const objectId = new ObjectId(req.body.deleteItemId);
  todoList.deleteOne( { _id : objectId  })
    .then( () => {
      res.redirect("/");
      console.log("Record deleted successfully.");
    })
    .catch( (err) => {
      console.log(err.message);
    }) 
})


app.listen(port, () => {
  console.log("Server running on port " +port);
});
