var urlApi = 'http://127.0.0.1:3000';
var db = new Dexie("Delicase");
db.version(1).stores({
    Pedidos: `++id,
nombre,
correo,
telefono,
direccion,
referencias,
carritoProductos
`
  }
  );
function sincronizacion(){
    db.transaction('rw', db.Pedidos, () => {
 
        let data = db.Pedidos;
        console.log(data);
        if(data!= undefined){
         data.each((element)=>{
         
          syncpedido(element);
          db.Pedidos.delete(element.id)
        })
       }});
}
function addtoIndexdb(jsonData){
    db.Pedidos.bulkPut([jsonData]).then(()=>{
      
  
    }).catch(function(error){
    
    })
}
function syncpedido(pedido) {
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
      })
}


