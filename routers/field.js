const router = require('express').Router();
const Field = require("../models/Field");


router.get("/detail/:name", async(req, res) => {
    let { name } = req.params;
    try
    {
        if(name === "frontend")
            name = "프론트 엔드";
        else if(name === "backend")
            name = "백 엔드";
        else
            name = "해킹 및 보안";

        await Field.find({ name: name })
        .then((foundFields) => {
            return res.status(200).send({
                field: foundFields
            });
        })
        .catch((err) => {
            console.error(err);
            throw err;
        })
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: "Server Error"
        });
    }
})

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

        const isFieldExisted = await Field.findOne({ name: currentFieldName });
        if(!isFieldExisted)
        {
            const foundField = await Field.findOne({ name: exFieldName })
            let editedFoundDetailField = foundField.detailFields;
            const indexOfName = editedFoundDetailField.indexOf(name);
            editedFoundDetailField.splice(indexOfName, 1);

            await Field.findOneAndReplace({
                name: exFieldName
            }, {
                name: exFieldName,
                detailFields: editedFoundDetailField
            });


            await Field.create({ name: currentFieldName, detailFields: [ name ] })
            .then(() => {
                return res.status(200).send({
                    field: currentFieldName
                });
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
        }
        else
        {
            if(isFieldChanged)
            {
                const foundField = await Field.findOne({ name: exFieldName })
                
                let editedFoundDetailField = foundField.detailFields;
                const indexOfName = editedFoundDetailField.indexOf(name);
                editedFoundDetailField.splice(indexOfName, 1);

                await Field.findOneAndReplace({
                    name: exFieldName
                }, {
                    name: exFieldName,
                    detailFields: editedFoundDetailField
                });


                let editedCurrentDetailFields = isFieldExisted.detailFields;
                editedCurrentDetailFields.push(name)
                
                await Field.findOneAndReplace({
                    name: currentFieldName
                }, {
                    name: currentFieldName,
                    detailFields: editedCurrentDetailFields
                })
                .then((editedField) => {
                    return res.status(200).send({
                        field: currentFieldName
                    })
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                })
            }
            else
            {
                return res.status(200).send({
                    field: currentFieldName
                })
            }
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