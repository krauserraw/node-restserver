const mongoose = require('mongoose').set('useCreateIndex', true).set('useFindAndModify', false);

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        uppercase: true,
        required: [true, 'El nombre de la categoría es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// categoriaSchema.methods.toJSON = function() {
//     let category = this;
//     let categoryObject = category.toObject();
//     delete categoryObject.usuario;
//     return categoryObject;
// }

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);