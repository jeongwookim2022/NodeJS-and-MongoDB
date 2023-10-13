const express = require("express");
const app = express();

// CSS DIR
app.use(express.static(__dirname + "/public"));
// EJS
app.set("view engine", "ejs");

// DB
const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://jeongwookim:kim1234@cluster0.4ytv3ej.mongodb.net/?retryWrites=true&w=majority";
new MongoClient(url)
  .connect() // To connect DB
  .then((client) => {
    console.log("Successfully DB connected!");
    db = client.db("nodejs_mongodb");

    // Launching a SERVER
    app.listen(8080, () => {
      console.log("Server launched at http://localhost:8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (request, response) => {
  // response.send("Nice to meet you!");
  response.sendFile(__dirname + "/index.html");
});

app.get("/news", (request, response) => {
  // TEST: Saving things in DB
  // db.collection("post").insertOne({ title: "Title(Test)" });

  response.send("Rainy Today. Economy.");
});
app.get("/shop", (request, response) => {
  response.send("Shopping Page.");
});
app.get("/about", (request, response) => {
  response.sendFile(__dirname + "/about.html");
});

// POST LISTs
app.get("/list", async (request, response) => {
  // response.send("Posts in DB");

  let result = await db.collection("post").find().toArray();
  response.render(__dirname + "/views/list.ejs", { post: result });
});
