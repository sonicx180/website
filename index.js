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
app.use(bodyParser.urlencoded({extended:false}))

// Thanks to IronCladDev for this function 
// I modifed it
function renderFile(file) {
  return (req, res) => res.sendFile(path.join(__dirname, "/templates/" + file + ".html"))
}
app.get('/', renderFile('index'))
app.get('/admin',(req,res) => {
  if(req.cookies.admin == process.env.admin){
    res.sendFile(__dirname + "/templates/admin.html")
  }
  else {
    res.send("<h1>Login In</h1>")
  }
})
app.get('/work', renderFile('work'))
app.get('/about', renderFile('about'))
app.get('/contact', renderFile('contact'))
// Thanks to IronCladDev
app.get("/api/projects", async (req, res) => {
  let data = await Project.find({ __v: 0 });
  res.send(data);
})
app.get("/public/:file",(req,res) => {
  res.sendFile(__dirname + `/public/${req.params.file}`)
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
app.post("/edit-proj",(req,res) => {
  if(req.body.password == process.env.pass) {
    Project.findOne({ _id:req.body.projid},(e,d) => {
     if(e) console.log(e);
      else {
        d.title = req.body.title;
        d.description = req.body.desc;
        d.url = req.body.url;

        d.save((e,D) => {
          if(e) console.log(e)

          else res.redirect("/work")
        })
      }
    })
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
app.get("*",renderFile("404"));

app.listen(Math.floor(Math.random()*9000))
