const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


const stack=[];

// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot Directions!');
});

    
// Route for processing user input and generating directions
app.post('/', (req, res) => {
  const { message } = req.body;
  
  // Extract the starting location and destination from the user's message
  const { startingLocation, destination } = extractLocations(message);
  
  // Call the getDirections function passing starting location and destination
  getDirections(startingLocation, destination)
    .then((dataTuple) => {
      // Push the dataTuple to the stack
      stack.push(dataTuple);

      // Send a success response to the client
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    });

});
// Define route to handle GET request for stack data
app.get('/stack',  (req, res) => {
  // Send the stack as the response to the client
   res.json(stack);
});

// Function to extract starting location and destination from the user's message
function extractLocations(message) {
  // Your implementation here
  const regex = /directions to (.+) from (.+)/i;
  const matches = message.match(regex);
  
  if (matches && matches.length === 3) {
    return {
      startingLocation: matches[1],
      destination: matches[2]
    };
  } else {
      // Handle the case when the user's message doesn't match the expected format
      // You can provide a default starting location and ask the user for clarification
      return {
        startingLocation: 'Mallepally',
        destination: 'Nampally'
      };
  }
}

  
function getDirections(startingLocation, destination) {
  return new Promise((resolve, reject) => {
  // Create the service object
  const serviceObject = {
  // Your service object properties
    startingLocation: startingLocation,
    destination: destination
  };

  // Convert the service object to a JSON string
  const serviceObjectJSON = JSON.stringify(serviceObject);

  // Spawn the Python script and pass the service object through stdin
  const pythonScript = spawn('python', ['maps.py'], { stdio: ['pipe', 'pipe', process.stderr] });
  pythonScript.stdin.write(serviceObjectJSON);
  pythonScript.stdin.end();

  pythonScript.stdout.on('data', (data) => {
    const responseJSON = data.toString();
    const dataTuple = JSON.parse(responseJSON);

    // Resolve the promise with the dataTuple
    resolve(dataTuple);
  });

  // Handle the completion of the Python script
  pythonScript.on('close', (code) => {
    if (code !== 0) {
      // Python script execution encountered an error
      reject(new Error(`Python script execution failed with code: ${code}`));
    }
  });
});
}


 

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
