const { mongoose } = require('../config/mongoose');
const InvestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Invest = mongoose.model('Invest', InvestSchema);
module.exports = { Invest };