const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    // req.usuario => podemos recuperar el usuario ya validado por el token
    // req.usuario.correo => también podemos extraer las propiedades
    // req.usuario.nombre

    let desde = req.query.desde || 1;
    desde = Number(desde) - 1;

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre correo')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) { return res.status(400).json({ ok: false, err }); }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({ ok: true, usuarios, cuantos: conteo });
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
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

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    // Las propiedades unique no se pueden actualizar
    // Las propiedades entre [] son las unicas que se pueden modificar
    let body = _.pick(req.body, ['nombre', 'estado', 'role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) { return res.status(400).json({ ok: false, err: { message: 'Error al actualizar' } }); }

        if (!usuarioDB) return res.status(400).json({ ok: false, err: { message: 'Error al actualizar' } });

        res.json({ ok: true, usuario: usuarioDB });

    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

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

        if (err) { return res.status(400).json({ ok: false, err: { message: 'Error al eliminar' } }); }

        if (!usuarioBorrado) return res.status(400).json({ ok: false, err: { message: 'Error al eliminar' } });

        res.json({ ok: true, usuario: usuarioBorrado });

    });
});


module.exports = app