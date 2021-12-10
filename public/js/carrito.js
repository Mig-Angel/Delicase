var urlApi = 'https://delicase.vercel.app';

// Carga los productos del carrito desde la sesion local
function cargaProductosCarrito() {
	var session = sessionStorage.getItem('carrito');
	$('#productos').html('');

	if(session != null){
	    var carritoProductos = JSON.parse(session);
		var productos=document.getElementById('productos');
		var lista=``;
	    carritoProductos.forEach(function (el, i) {
	        lista+=`
	        <div class="col mb-5">
	            <div class="card h-100">
	                <!-- Product image-->
	                <img class="img-responsive" src="${el.pr_imagen}" alt="Now found" />
	                <!-- Product details-->
	                <div class="card-body p-4">
	                    <div class="text-center">
	                        <!-- Product name-->
	                        <h5 class="fw-bolder">${el.pr_nombre}</h5>
	                        <!-- Product price-->
	                        ${el.pr_costo}.00 MXN
	                    </div>
	                </div>
	                <!-- Product actions-->
	                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
	                    <div class="text-center">
							<button type="button" class="btn btn-outline-dark mt-auto" onclick="eliminaProducto(${i})">Eliminar</button>
						</div>
	                </div>
	            </div>
	        </div>
	        `;
	    });
		productos.innerHTML=lista;
	}
}

function eliminaProducto(index){
	eliminaProductoCarrito(index);
	cargaProductosCarrito();
}

// En el submit del formulario de pedido se previene el evento default
// Para que no se recargue la pagina y se hace un fetch para
// realizar el pedido
$('#pedido').submit(function (evt) {
	// Previene la recarga de la pagina
	evt.preventDefault();
	// Se obtiene del session storage los elemenros del carrito
	var session = sessionStorage.getItem('carrito');

	// Se verifica que no esten vacios
	if(session != null){
		// Se convierte en objeto de la session en un objeto JSON
		var carritoProductos = JSON.parse(session);
		
		// Se verifica que tenga mas de un producto
		if(carritoProductos.length > 0){
			// Se crea el objeto para publicar el producto
			var data = {
				nombre: $('#nombre').val(),
				correo: $('#correo').val(),
				telefono: $('#telefono').val(),
				direccion: $('#direccion').val(),
				referencias: $('#referencias').val(),
				carritoProductos: carritoProductos
			};
			
			// Se hace el post del pedido al servidor
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
				body: JSON.stringify(data) // body data type must match "Content-Type" header
			}).then(response => response.json()).then(function (data) {
		        if(data.result){
	        		sessionStorage.removeItem('carrito');
        			conteoCarrito();
        			cargaProductosCarrito();

        			$('#nombre').val('');
					$('#correo').val('');
					$('#telefono').val('');
					$('#direccion').val('');
					$('#referencias').val('');

        			bootbox.alert(data.message);
		        }else{
		        	bootbox.alert("Error al procesar su solicitud");
		        }
		    }).catch(function (error) {
				sessionStorage.removeItem('carrito');
				conteoCarrito();
				cargaProductosCarrito();

				$('#nombre').val('');
				$('#correo').val('');
				$('#telefono').val('');
				$('#direccion').val('');
				$('#referencias').val('');

				// Manejador de error del fetch
			 	bootbox.alert("No tienes conexión a internet, tu pedido ha sido guardado temporalmente, pero solo hasta que te vuelvas a conectar se enviara.");
				
				 // Se añade el cerpo de la peticion al index db 
				// para sincronizar cuendo este de nuevo en linea
				addtoIndexdb(data);
			})
		} else {
			bootbox.alert("Agregue productos a su carrito!");
		}
	} else {
		bootbox.alert("Agregue productos a su carrito!");
	}
});

cargaProductosCarrito();
