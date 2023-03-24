const express = require('express');
const mongoose = require('mongoose');


const app = express();

// connect to MongoDB
const DB = "mongodb+srv://Prasanta:Prasanta@cluster0.z4m8koz.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DB).then(() => {
    console.log("Connection Success")
}).catch((err) => {
    console.log(err.massage)
})

// create a mongoose schema for the event model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 200 },
  location: { type: String, required: true, maxLength: 50 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});


const Event = mongoose.model('Event', eventSchema);


app.use(express.json());

// define the endpoint for creating a new event
app.post('/vi/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/vi/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/vl/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    console.log(event);
    if (!event) {
      res.status(404).json({ error: 'There is no event with that id' });
      return;
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/vl/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'There is no event with that id' });
      return;
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.delete('/vl/events/:id', async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        res.status(404).json({ error: 'There is no event with that id' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  });
  

  let port = 8080;
  app.listen(port, () => {
    console.log(`Server start at ${port}`);
  });
  
