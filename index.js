const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();

app.use(bodyParser.json());

// to test server
app.get("/", function (req, res) {
  res.send("API Server started ");
});

const options = {
  url:
    "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences",
  method: "GET",
};

// promise based call to request
function requestData() {
  return new Promise(function (resolve, reject) {
    request(options, (err, res, body) => {
      // in addition to parsing the value, to deal with possible errors
      if (err) return reject(err);
      try {
        // JSON.parse() can throw an exception if not valid JSON
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

// get the data properly from promise
const getData = async () => {
  let data = null;
  try {
    data = await requestData();
  } catch (error) {
    console.err(err);
    return err.message;
  }
  return data;
};

// generates readable text
const prepareHumanReadableFormat = (events) => {
  // index event name at city country from from-date to to-date.
  return events.map(
    (event, index) =>
      `${index + 1}. ${event.confName} conference at ${event.city}, ${
        event.country
      } from ${event.confStartDate} to ${event.confEndDate}.`
  );
};

// type:all/free/paid \n count is optional > 0
app.get("/api/list/:filter/:count?", async (req, res) => {
  try {
    const filter = req.params.filter;
    const count = req.params.count;
    const data = await getData();
    let readable = null;
    let requestedData = [];
    switch (filter) {
      case "free":
        requestedData = data.free;
        break;
      case "paid":
        requestedData = data.paid;
        break;
      case "all":
        requestedData = [...data.free, ...data.paid];
        break;
    }
    if (+count > 0) {
      //avoid negative integers
      requestedData = requestedData.splice(0, count);
    }

    readable = prepareHumanReadableFormat(requestedData);

    res.send(readable);
  } catch (error) {
    res.statusCode(404);
    res.send("Error");
  }
});

app.listen(PORT, async function () {
  console.log("Server is running on Port: " + PORT);

  const data = await getData();
  const readable = prepareHumanReadableFormat(
    [...data.free, ...data.paid].splice(0, 5)
  );
  console.log("\n Events List");
  readable.forEach((element) => {
    console.log(element);
  });
  console.log(
    "\n All events can be seen at http://localhost:4000/api/list/<type>[/<count>] \n type:all/free/paid \n count: integer > 0 \n Please refer readme."
  );
});
