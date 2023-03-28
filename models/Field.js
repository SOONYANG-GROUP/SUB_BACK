const mongoose = require("mongoose");
const { Schema } = mongoose;

const FieldSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    detailFields: [
        {
            type: String,
            required: true
        }
    ]
});

const Field = mongoose.model("Field", FieldSchema);
module.exports = Field;