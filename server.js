const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://quyettamdqt:poxdeptraivcl@poxdeptraivcl.d9lqd2z.mongodb.net/main', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const creditsSchema = new mongoose.Schema({
    user_id: String,
    credits: Number
});

// Đặt tên collection là "credits"
const Credit = mongoose.model('Credit', creditsSchema, 'credits');

app.use(bodyParser.json());

// Endpoint để lấy danh sách user_id
app.get('/main/credits/user_ids', async (req, res) => {
    try {
        const userIDs = await Credit.find({}, 'user_id');
        res.status(200).json(userIDs.map(doc => doc.user_id));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint để xử lý thanh toán thành công
app.post('/paypal/success', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const creditsAdded = req.body.quantity;

        // Cập nhật số credits trong MongoDB
        await Credit.findOneAndUpdate(
            { user_id: user_id },
            { $inc: { credits: creditsAdded } },
            { new: true, upsert: true }
        );

        // Gửi lại URL đã được cập nhật với số credits mới
        const updatedURL = `https://donepoxvnn.github.io?user_id=${user_id}`;
        res.status(200).json({ updatedURL });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
