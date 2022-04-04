var express = require('express')
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
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

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}))
// Thanks to IronCladDev for this function
function renderFile(file) {
  return (req, res) => res.sendFile(path.join(__dirname, "/templates/" + file))
}
app.get('/', renderFile('index.html'))
app.get('/admin', renderFile('admin.html'))
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
    res.cookie("admin", process.env.admin)


    res.redirect('/work')
  }
  else {
    res.send("Failed")
  }
})

app.get("*" , renderFile("404.html"))
app.listen(3025,(err) => {
  if(err) console.log(err)
  else console.log("running on port 3025")
})