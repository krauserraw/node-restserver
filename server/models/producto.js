const mongoose = require('mongoose').set('useCreateIndex', true).set('useFindAndModify', false);

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        uppercase: true,
        required: [true, 'El nombre del producto es obligatorio']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es obligatorio']
    },
    descripcion: {
        type: String,
        uppercase: true,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoría del producto es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Producto', productoSchema);