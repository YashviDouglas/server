const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri =
  'mongodb+srv://newuser:123@cluster0.f9d6o.gcp.mongodb.net/activitiescollections';
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const Schema = mongoose.Schema;

// Create a Schema object
const activitySchema = new Schema(
  {
    activity: { type: String, required: true },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// This Activitry creates the collection called activitimodels
const Activitymodel = mongoose.model('Activitymodel', activitySchema);

app.get('/', (req, res) => {
  Activitymodel.find()
    .then((activities) => res.json(activities))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/add', async (req, res) => {
  const activity = req.body.activity;
  // create a new Activity object
  const newActivity = await new Activitymodel({
    activity,
  });
  console.log(newActivity);
  // save the new object (newActivity)
  newActivity
    .save()
    .then(() => res.json('Activity added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.get('/:id', (req, res) => {
  console.log('just id' + req.params.id);
  Activitymodel.findById(req.params.id)
    .then((activity) => res.json(activity))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/update/:id', async (req, res) => {
  console.log(req.params.id);
  await Activitymodel.findById(req.params.id)
    .then((activityforedit) => {
      activityforedit.activity = req.body.activity;

      activityforedit
        .save()
        .then(() => res.json('Activity updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.delete('/delete/:id', async (req, res) => {
  console.log('delete logged');
  await Activitymodel.findByIdAndDelete(req.params.id)
    .then(() => res.json('Activity deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
