import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library',
        required: true
    },
    loanDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    },
    returned: {
        type: Boolean,
        default: false
    }
});

const Loan = mongoose.model("Loan", LoanSchema);

export default Loan;