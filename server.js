const express = require("express");
const app = express();
// DB
const { MongoClient, ObjectId } = require("mongodb");

// STATIC: CSS DIR
app.use(express.static(__dirname + "/public"));
// EJS
app.set("view engine", "ejs");
// TO USE 'Request.body': to get data from users via 'form'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// COLLECTIION: POST LISTs
app.get("/list", async (request, response) => {
  let result = await db.collection("post").find().toArray();
  response.render("list.ejs", { post: result });
});

// WRITING
app.get("/writing", (request, response) => {
  response.render("writing.ejs");
});

app.post("/addpost", async (request, response) => {
  const data = request.body; // Getting data from users

  try {
    if (data.title.length == 0 || data.content.length == 0) {
      response.send("Title or Content can't not be empty!");
    } else {
      await db
        .collection("post")
        .insertOne({ title: data.title, content: data.content });

      response.redirect("/list");
    }
  } catch (e) {
    response.status(500).send("SERVER ERROR:", e);
  }
});

// DETAIL: URL PARAMTER
app.get("/detail/:detailId", async (request, response) => {
  try {
    const id = request.params.detailId;
    const result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(id) });

    if (result == null) {
      response.status(404).send("That's not a valid detailId.");
    } else {
      response.render("detail.ejs", { data: result });
    }
  } catch (e) {
    response.status(404).send("That's not a valid detailId.");
  }
});

// EDIT
app.get("/edit/:id", async (request, response) => {
  const id = request.params.id;
  const result = await db.collection("post").findOne({ _id: new ObjectId(id) });

  response.render("edit.ejs", { data: result });
});

app.post("/editpost", async (request, response) => {
  const newData = request.body;

  // EXCEPTION and DATA VALIDATION CHECK
  try {
    if (newData.title.length !== 0 && newData.content.length !== 0) {
      await db
        .collection("post")
        .updateOne(
          { _id: new ObjectId(newData.id) },
          { $set: { title: newData.title, content: newData.content } }
        );

      response.redirect("/list");
    } else {
      response.send(
        "You should write at least one alphabet for title and content!"
      );
    }
  } catch (e) {
    response.status(500).send("That's not a valid data for title and content.");
  }
});
