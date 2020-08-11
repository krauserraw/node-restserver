const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');

const _ = require('underscore');

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 1;
    desde = Number(desde) - 1;

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre correo')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) { return res.status(500).json({ ok: false, err }); }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                if (err) { return res.status(500).json({ ok: false, err }); }

                res.json({ ok: true, productos, cuantos: conteo });

            });

        });

});

app.get('/producto/:idProducto', verificaToken, (req, res) => {

    let id = req.params.idProducto;

    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre correo')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) { return res.status(500).json({ ok: false, err }); }

            if (!productoDB) { return res.status(400).json({ ok: false, err: { message: 'El producto no existe' } }); }

            res.json({ ok: true, producto: productoDB });

        });

});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) { return res.status(500).json({ ok: false, err }); }

            res.json({ ok: true, productos });

        });

});

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    body.usuario = req.usuario._id;

    let producto = new Producto(body);

    producto.save((err, productoDB) => {

        if (err) { return res.status(500).json({ ok: false, err }); }

        if (!productoDB) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, producto: productoDB, message: 'Producto creado' });

    });

});

app.put('/producto/:idProducto', verificaToken, (req, res) => {

    let id = req.params.idProducto;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    body.usuario = req.usuario._id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) { return res.status(500).json({ ok: false, err }); }

        if (!productoDB) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, producto: productoDB, message: 'Producto actualizado' });

    });

});

app.delete('/producto/:idProducto', verificaToken, (req, res) => {

    let id = req.params.idProducto;

    let cambiarEstado = { disponible: false }

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, productoBorrado) => {

        if (err) { return res.status(400).json({ ok: false, err: { message: 'Error al eliminar el producto' } }); }

        if (!productoBorrado) return res.status(400).json({ ok: false, err: { message: 'Error al eliminar el producto' } });

        res.json({ ok: true, producto: productoBorrado, message: 'Producto eliminado' });

    });
});

module.exports = app