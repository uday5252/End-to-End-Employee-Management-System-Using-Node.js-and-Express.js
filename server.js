const Express = require("express")
const FileSystem = require("fs")
const Multer = require("multer")
// 2 things are 
// 1)We need to tell multer, hey you dont give any default name, ill tell thne name 
// 2)Extension



const details = Multer.diskStorage({
    //exactly 2 keys
    // exactly 3 parameters 
    destination: function(req, file, info)
    {
        //Tell the destination where the file should be kept
        // info(new Error("Destination folder not created"), "images/")
        info(null, "images/")
        // null --> there will be no error, developer is confident
    },

    filename: function(req, file, info)
    {
        console.log(file)
        info(null, file.originalname)
        // null --> I am confident that this filename will get created
    }
})


let upload = Multer({ storage: details })//destination
let app = Express()

app.use(Express.urlencoded())

app.use("/images",Express.static('images'))
app.use("/scripts", Express.static('scripts'))

app.set("view engine", "ejs")

// view --> display

app.get("/", function(req, res)
{
    res.sendFile(__dirname+"/Templates/home.html")
})

app.get("/add", function(req, res)
{
    res.sendFile(__dirname+"/Templates/AddEmployeeForm.html")
})

// No --> Because servers created using express.js can collect the text data
// if we use urlencoded(), BUT we cannot make files like images, pdf, word, ...
// to be collected by the server even tough we use urlencoded()
// The solution is to use multer library in the server side, because
// multer was designed to collect the files which are submitted by the users to the server

app.post("/add", upload.single("profile"),  function(req, res)
{
    let empData = req.body
    empData.info = req.file.path
    
    
    let empArray = JSON.parse(FileSystem.readFileSync("employeedata.json"))//[]
    empArray.push(empData)//[{}, {}]

    let empJsonArray = JSON.stringify(empArray)
    
    FileSystem.writeFile("employeedata.json", empJsonArray, function(error)
    {
        if(error)
        {
            console.log("Data is not written to the file!")
        }
        else
        {
            console.log("Data is written successfully!")
        }
    })

    res.redirect("/")
})

app.get("/view", function(req, res)
{
    // ?sort=ASC ==> ???????
    //Read the data
    let readEmployeeData = FileSystem.readFileSync("employeedata.json", "utf-8")//[{}, {}]
    let employeeJavascriptData = JSON.parse(readEmployeeData)
    // employeeJavascriptData --> [{}, {}, {}]
    // if sort = ASC, then only employeeJavascriptData --> [{}, {}, {}]
    // whould be sorted and then sent to the file
    console.log(req.query.sort)
    if(req.query.sort != undefined)
    {
        //Query parameter exist
        // sort the data(employeeJavascriptData)
        employeeJavascriptData.sort(function(a, b)
        {       
            // "Rohit" < "Arun"(false)
            // if(a.firstName < b.firstName)
            // {
            //     return -1//No Swapping
            // }
            // else{
            //     return 1//Swapping
            // }

            console.log(a.firstName - b.firstName)
        })
    }
    
    res.render("viewStudentData.ejs",{ empdata :employeeJavascriptData } )
})


app.get("/employees/:empid", function(req, res)
{
    //Logic to extract that particular employee details
    const id = req.params.empid//id = 2(details of the 1st employee)

    const readJsonData = FileSystem.readFileSync("employeedata.json", "utf-8")
    // readJsonData(JSON Data) --> Javascript Format

    const employeeJavascriptData = JSON.parse(readJsonData)

    employeeJavascriptData.map(function(i)
    {
        // {1}, {2}, {3}, {4}, {5}

        if(id === i.employeeId)
        {
            console.log(i)
            //Extract that employee data
            res.render("displayParticularEmployee.ejs", { employee: i })
        }
    })

    res.render("404.ejs")
    
})

// Pug 

app.listen(8000, function()
{
    console.log("Server is running on the port 8000!")
})

// ejs(Embedded Javscript --> Template Engine)

// http://localhost:8000/employees/1 --> All the Rohit details
// http://localhost:8000/employees/2 --> All the Arun details

