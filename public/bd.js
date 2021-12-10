var urlApi = 'https://delicase.vercel.app/';
var db = new Dexie("Delicase");

// define la informacion a almacenar en la base de datos 
db.version(1).stores({
    Pedidos: `
      ++id,
      nombre,
      correo,
      telefono,
      direccion,
      referencias,
      carritoProductos`
  }
);

// metodo que llama desde el serviceWorker en el evento 'syn'
// este recorre los registros en el indexdb e intenda enviarlos al servidor
function sincronizacion(){
  db.transaction('rw', db.Pedidos, () => {
    let data = db.Pedidos;
    
    if(data!= undefined){
      data.each((element)=>{
        // sincroniza el pedido
        syncpedido(element);
        db.Pedidos.delete(element.id)
      });
    }
  });
}

// Añada un elemento al index db
function addtoIndexdb(jsonData){
    db.Pedidos.bulkPut([jsonData]).then(()=>{
  
    }).catch(function(error){
    
    })
}

// Metodo para sincronizar el pedido
function syncpedido(pedido) {
  // Por el momento solo apunta a un lugar, pues solo hay un post
  fetch(urlApi+'/general/guardaPedido', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(pedido) // body data type must match "Content-Type" header
  }).then(response => response.json()).then(function (data) {
    if(data.result){
      bootbox.alert(data.message);
    }else{
      bootbox.alert("Error al procesar su solicitud");
    }
  }).catch(function (error) {
    bootbox.alert("No tienes conexión a internet, por favor no borres tu pedido hasta que te vuelvas conectar para enviar tu pedido");
    addtoIndexdb(data);
  });
}


