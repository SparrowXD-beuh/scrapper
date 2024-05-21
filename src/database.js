const { MongoClient } = require("mongodb");
require("dotenv/config");

const database = new MongoClient(`mongodb+srv://user1:${process.env.PASS_DB}@freecluster.7xu0m7g.mongodb.net/?retryWrites=true&w=majority`);
async function connectToDatabase() {
    try {
      await database.connect();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Database Error: ", error.message);
    }
};

async function find(filename, folderId) {
  fetch(`https://api.gofile.io/contents/${process.env.ACCOUNT_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.TOKEN}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error(error));
};

async function insert(file, folderId) {
  const formData = new FormData();
  formData.append("file", 'https://gredirect.info/download.php?url=aHR0cHM6LyAdeqwrwedffryretgsdFrsftrsvfsfsr9hb3NuNTURASDGHUSRFSJGYfdsffsderFStewthsfSFtrftesdflvN2t5LmFuZjU5OC5jb20vdXNlcjEzNDIvZTVkZWMzNDc3NmFmNzAwMzQ4Y2EzYzZjZmMzNjU2NWIvRVAuMS52MS4xMDgwcC5tcDQ/dG9rZW49WmFvOUhpOG0zbWlqa3JVWWlDUG8xQSZleHBpcmVzPTE3MTU3MDUyMzEmaWQ9MTcyNDQ2');
  formData.append("folderId", "2d563cf5-8210-445e-a198-2507742b237e");
  
  fetch('https://store1.gofile.io/contents/uploadfile', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${process.env.TOKEN}`
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
  })
  .catch(error => console.error(error));
}

module.exports = { connectToDatabase, find, insert }