const router = require('express').Router();
const Field = require("../models/Field");


router.post("/create", async(req, res) => {
    const { fieldName, name } = req.body;
    try
    {
        // Field가 있는지 확인
        const foundField = await Field.findOne({ name: fieldName });
        

        if(foundField)
        {
            let editedDetailFields = foundField.detailFields;
            editedDetailFields[editedDetailFields.length] = name;
            await Field.findOneAndReplace({
                name: fieldName   
            }, {
                name: fieldName,
                detailFields: editedDetailFields
            })
            .then((editedField) => {
                return res.status(200).send({
                    field: editedField.name
                })
            })
            .catch((err) => {
                throw err;
            });
        }
        else
        {
            await Field.create({
                name: fieldName,
                detailFields: [name]
            })
            .then((createadField) => {
                return res.status(200).send({
                    field: createadField.name
                })
            })
            .catch((err) => {
                throw err;
            })
        }
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: "Server Error"
        });
    }
});

router.post("/edit/", async (req, res) => {
    const { exFieldName, currentFieldName, name, isFieldChanged } = req.body;

    try
    {
        if(isFieldChanged)
        {
            return res.status(200).send({
                field: currentFieldName
            })
        }
        else
        {
            const foundField = await Field.findOne({ name: exFieldName })
            
            let editedFoundDetailField = foundField.detailFields;
            const indexOfName = editedFoundDetailField.indexOf(name);
            editedFoundDetailField.splice(indexOfName, 1);
            await Field.findOneAndReplace({
                name: exFieldName
            }, {
                name: currentFieldName,
                detailFields: editedFoundDetailField
            })
            return res.status(200).send({
                field: currentFieldName
            })            
        }
    }
    catch(error)
    {
        return res.status(500).send({
            message: "Server Error"
        })
    }
})

module.exports = router;