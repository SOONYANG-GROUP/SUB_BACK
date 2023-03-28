const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoadmapSchema = new Schema({
    name: String,
    computerLanguage: String,
    framework: String,
    skills: [
        {
            _id: mongoose.Types.ObjectId,
            imagePublicId: String,
            imageSecureUrl: String,
            name: String
        }
    ],
    imagePublicId: {
        type: String
    },
    imageSecureUrl: {
        type: String
    },
    field: {
        type: String
    },
    references: [String]
});

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
module.exports = Roadmap;