const mongoose = require("mongoose");
const { Schema } = mongoose;

const SkillSchema = new Schema({
    name: String,
    studyTip: String,
    references: [String],
    imagePublicId: {
        type: String
    },
    imageSecureUrl: {
        type: String
    },
    helloworld: {
        type: String
    },
    downloadLibrary: {
        type: String
    },
    category: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    renewalDate: {
        type: Date,
        default: Date.now()
    }
});

const Skill = mongoose.model("Skill", SkillSchema);
module.exports = Skill;