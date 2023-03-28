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
    category: {
        type: String
    }
});

const Skill = mongoose.model("Skill", SkillSchema);
module.exports = Skill;