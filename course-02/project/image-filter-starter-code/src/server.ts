import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
const fs = require('fs');
const path = require("path");

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port: any = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /*app.get("/filteredimage", async (req:any, res:any) => {
    const keys:string[] = Object.keys(req.query);
    // Do we have enough query parameters?
    if (!keys.length){
      return res.status(422).send('Please select an image url to upload');
    } 
  
    const testFolder:string = __dirname +'/util/tmp/';
   
    let files: any[] = [];
    
    const getFilesRecursively = (directory: any) => {
      const filesInDirectory:string[] = fs.readdirSync(directory);
      for (const file of filesInDirectory) {
        const absolute:string = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
        }
      }
    };
    getFilesRecursively(testFolder);
    deleteLocalFiles(files);
    let image_url : string = req.query.image_url;
    let filteredpath : any= filterImageFromURL(image_url);
    
    res.status(422).sendFile(await filteredpath);
  });
*/

  app.get("/filteredimage/", async (req:any, res:any) => {
    try {
      let image_url : string = req.query.image_url;
      if (!image_url) {
        return res.status(400).send("Please select an image url to upload");
      }
 
      const path: string = await filterImageFromURL(image_url);
      res.sendFile(path);
      res.on('finish', () => deleteLocalFiles([path]));
    } catch {
      return res.status(500).send({ error: 'Unable to process your request' });
    }
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: any, res: any) => {
    res.send("Welcome to Image filter service")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();