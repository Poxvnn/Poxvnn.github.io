const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://quyettamdqt:poxdeptraivcl@poxdeptraivcl.d9lqd2z.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const creditsSchema = new mongoose.Schema({
  user_id: String,
  credits: Number
});

const Credit = mongoose.model('Credit', creditsSchema);

app.use(bodyParser.json());

app.post('/paypal/success', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const creditsAdded = req.body.quantity;

    const updatedCredits = await Credit.findOneAndUpdate(
      { user_id: user_id },
      { $inc: { credits: creditsAdded } },
      { new: true, upsert: true }
    );

    const updatedURL = `https://donepoxvnn.github.io?user_id=${user_id}`;
    res.status(200).json({ updatedURL, updatedCredits });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
