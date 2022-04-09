var express = require('express')
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var Schema = mongoose.Schema;
mongoose.connect(process.env.M_URI);

// all strings !
var projectSchema = new Schema({
  title:String,
  description:String,
  imageURL:String,
  url:String
})

var Project = mongoose.model("Project",projectSchema);
app.use(cookieParser())
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}))
// Thanks to IronCladDev for this function
function renderFile(file) {
  return (req, res) => res.sendFile(path.join(__dirname, "/templates/" + file))
}
app.get('/', renderFile('index.html'))
app.get('/admin',(req,res) => {
  if(req.cookies.admin == process.env.admin){
    res.sendFile(__dirname + "/templates/admin.html")
  }
  else {
    res.send("<h1>Login In</h1>")
  }
})
app.get('/work', renderFile('work.html'))
app.get('/about', renderFile('about.html'))
// Thanks to IronCladDev
app.get("/api/projects", async (req, res) => {
  let data = await Project.find({ __v: 0 });
  res.send(data);
})

app.post('/add-work',(req,res) => {
  if(req.body.password == process.env.pass){
    var proj = new Project({
      title:req.body.title,
      description:req.body.description,
      imageURL:req.body['i-url'],
      url:req.body.url
    })
    proj.save();
   


    res.redirect('/work')
  }
  else {
    res.send("Failed, don't hack me")
  }
})
app.post("/del-proj",(req,res) => {
  if(req.body.password == process.env.pass){
    Project.remove({ _id: req.body.projid},(err,d) => {
      if(err) console.log(err)
      else res.redirect("/work")
    })

  }
  else {
    res.send("Don't try and hack me >:D")
  }
})

app.get("*" , renderFile("404.html"))
app.listen(3025,(err) => {
  console.clear()
  if(err) console.log(err)
  else console.log("running on port 3025")
})