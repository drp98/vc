const {Schema, model} = require('mongoose')

const schema = new Schema({
    word: {
        type: String,
        required: true
    },
    translate: {
        type: String,
        required: true
    },
    transcription: {
        type: String
    },
    isKnown: {
        type: Boolean,
        required: true
    }
},
{
    collection: 'words'
})

module.exports = model('Word', schema)