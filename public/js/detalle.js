var searchParams = new URLSearchParams(window.location.search),
    pr_id = searchParams.get('pr_id');
var urlApi = 'https://delicase.vercel.app';

// Pide los datos del producto desde el servidor
function cargaProducto(pr_id = 0) {

    fetch(urlApi + '/general/getProducto?pr_id='+pr_id).then(response => response.json()).then(function (data) {
        // Agrega la informacion recivida a la pantalla
        document.getElementById('imagen').src= data.pr_imagen;
        document.getElementById('titulo').innerHTML= data.pr_nombre;
        document.getElementById('descripcion').innerHTML= data.pr_descripcion 
        
        // Le agrega al boton de agregar el evento para agregarlo al carrito
        document.getElementById('agregar').addEventListener('click',function(){

            agregaProductoCarrito(data);
        });
    });
}

cargaProducto(pr_id);
