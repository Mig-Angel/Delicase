var searchParams = new URLSearchParams(window.location.search),
    pr_id = searchParams.get('pr_id');
var urlApi = 'http://127.0.0.1:3000';

function cargaProducto(pr_id = 0) {

    fetch(urlApi + '/general/getProducto?pr_id='+pr_id).then(response => response.json()).then(function (data) {
        document.getElementById('imagen').src= data.pr_imagen;
        document.getElementById('titulo').innerHTML= data.pr_nombre;
        document.getElementById('descripcion').innerHTML= data.pr_descripcion 

        document.getElementById('agregar').addEventListener('click',function(){

            agregaProductoCarrito(data);
        });
    });
}

cargaProducto(pr_id);