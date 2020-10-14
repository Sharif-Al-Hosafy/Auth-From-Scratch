const mongoose = require("mongoose");

const db = 'mongodb+srv://sharif:KFAiMY8xfZ3BiV98@warehouse.jrtie.mongodb.net/authNob?retryWrites=true&w=majority'
mongoose
    .connect(db, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;