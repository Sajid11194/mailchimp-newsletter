const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 80, () => {
    console.log("Server Online");
});
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    postData = req.body;
    const firstName = postData.fname;
    const lastName = postData.lname;
    const email = postData.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const listId = "fba88cc83b";
    const apiKey = "f9757df1d97ac04304c46e0bbaef7ee1-us18";
    const url = `https://us18.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "post",
        auth: `admin:${apiKey}`
    }
    let request = https.request(url, options, (response) => {

        response.on("data",(data) => {
            let rec =JSON.parse(data);
            if(response.statusCode==200 && rec.error_count==0 )
            {
                res.sendFile(__dirname+"/success.html");
            }
            else
            {
                res.sendFile(__dirname+"/failure.html");
            }
        });

    });
    request.write(jsonData);
    request.end();
});

