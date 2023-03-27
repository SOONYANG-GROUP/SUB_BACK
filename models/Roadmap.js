const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoadmapSchema = new Schema({
    name: String,
    computerLanguage: String,
    framework: String,
    skills: [mongoose.Types.ObjectId],
    imagePublicId: {
        type: String
    },
    imageSecureUrl: {
        type: String
    }
});

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
module.exports = Roadmap;