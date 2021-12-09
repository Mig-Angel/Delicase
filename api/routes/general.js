const express = require('express');
var bodyParser = require('body-parser')
const router = express.Router();

const mysqlConnection  = require('../database.js');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// Lista todos los tipos de producto
router.get('/general/getAllTiposProducto', (req, res) => {
  mysqlConnection.query('CALL sp_tipoPruductoGetAll()', (err, rows, fields) => {
    if(!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });  
});

// Obtiene todos los productos
router.get('/general/getAllProductos', (req, res) => {
  const { tp_id, key_words } = req.query; 
  mysqlConnection.query(`CALL sp_pruductoGetAll(${tp_id}, '${key_words}')`, (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// Obtiene todos los productos
router.get('/general/getProducto', (req, res) => {
  const { pr_id } = req.query; 
  mysqlConnection.query(`SELECT * FROM c_producto WHERE pr_id = ${pr_id};`, (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// inserta un pedido
router.post('/general/guardaPedido', urlencodedParser, (req, res) => {
  const {nombre, correo, telefono, direccion, referencias, carritoProductos} = req.body;
  var pe_id = 0;
  console.log(carritoProductos);

  const query = `
  INSERT INTO c_pedido VALUES (DEFAULT, NOW(), 1, '${direccion}', '${nombre}', '${referencias}', '${telefono}', '${correo}');
  `;
  mysqlConnection.query(query, (err, rows, fields) => {
    if (err) throw err;
    pe_id = rows.insertId;

    carritoProductos.forEach(function(producto){
      const query2 = `
      INSERT INTO r_productoPedido VALUES (DEFAULT, 1, ${producto.pr_costo}, 1, NOW(), ${producto.pr_id}, ${pe_id});
      `;
      mysqlConnection.query(query2, (err, rows, fields) => {
        if (err) throw err;
      });
    });
    
    res.json({
      result: true,
      message: `Su pedido con folio ${rows.insertId} fue guardado con éxito, guárdelo para confirmar en la entrega.`,
    });
  });

});

module.exports = router;
