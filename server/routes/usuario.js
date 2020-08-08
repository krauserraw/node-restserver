const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 1;
    desde = Number(desde) - 1;

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre correo')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) { return res.status(400).json({ ok: false, err }); }

            Usuario.countDocuments({}, (err, conteo) => {
                res.json({ ok: true, usuarios, cuantos: conteo });
            });

        });
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    // let usuario = new Usuario({
    //     nombre: body.nombre,
    //     correo: body.correo,
    //     password: body.password,
    //     role: body.role
    // });
    if (body.password) body.password = bcrypt.hashSync(body.password, 10);
    let usuario = new Usuario(body);

    usuario.save((err, usuarioDB) => {

        if (err) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, usuario: usuarioDB });

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, usuario: usuarioDB });

    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //no borrar
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) { return res.status(400).json({ ok: false, err }); }

    //     if (!usuarioBorrado) return res.status(400).json({ ok: false, err: { message: 'Usuario no encontrado' } });

    //     res.json({ ok: true, usuario: usuarioBorrado });

    // });

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, usuario: usuarioBorrado });

    });
});


module.exports = app