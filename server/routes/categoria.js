const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre correo')
        .exec((err, categorias) => {

            if (err) { return res.status(500).json({ ok: false, err }); }

            Categoria.countDocuments({}, (err, conteo) => {

                if (err) { return res.status(500).json({ ok: false, err }); }

                res.json({ ok: true, categorias, cuantos: conteo });

            });

        });

});

app.get('/categoria/:idCategoria', verificaToken, (req, res) => {

    let id = req.params.idCategoria;

    Categoria.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre correo')
        .exec((err, categoriaDB) => {

            if (err) { return res.status(500).json({ ok: false, err }); }

            if (!categoriaDB) { return res.status(400).json({ ok: false, err: { message: 'La categoría no esite' } }); }

            res.json({ ok: true, categoria: categoriaDB });

        });

});

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    body.usuario = req.usuario._id;

    let categoria = new Categoria(body);

    categoria.save((err, categoriaDB) => {

        if (err) { return res.status(500).json({ ok: false, err }); }

        if (!categoriaDB) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, categoria: categoriaDB, message: 'Categoría Creada' });

    });

});

app.put('/categoria/:idCategoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.idCategoria;

    let body = req.body;

    body.usuario = req.usuario._id;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) { return res.status(500).json({ ok: false, err }); }

        if (!categoriaDB) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, categoria: categoriaDB, message: 'Categoría actualizada' });

    });

});

app.delete('/categoria/:idCategoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.idCategoria;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) { return res.status(500).json({ ok: false, err }); }

        if (!categoriaDB) { return res.status(400).json({ ok: false, err: { message: 'La categoría no esite' } }); }

        res.json({ ok: true, categoria: categoriaDB, message: 'Categoría eliminada' });

    });

});


module.exports = app