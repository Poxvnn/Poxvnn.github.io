const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose.connect('mongodb+srv://quyettamdqt:poxdeptraivcl@poxdeptraivcl.d9lqd2z.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Định nghĩa schema và model cho dữ liệu credits
const creditsSchema = new mongoose.Schema({
  user_id: String,
  credits: Number
});

const Credit = mongoose.model('Credit', creditsSchema);

// Middleware để parse JSON từ request body
app.use(bodyParser.json());

// Route để xử lý thanh toán thành công từ PayPal
app.post('/paypal/success', async (req, res) => {
  try {
    // Lấy user_id từ query parameter trong URL
    const user_id = req.query.user_id;

    // Lấy số credits từ request body của PayPal
    const creditsAdded = req.body.quantity;

    // Cập nhật số credits trong MongoDB
    const updatedCredits = await Credit.findOneAndUpdate(
      { user_id: user_id },
      { $inc: { credits: creditsAdded } },
      { new: true, upsert: true }
    );

    // Gửi lại URL đã được cập nhật với số credits mới
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
