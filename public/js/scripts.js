var session;

// Funcion para mostrar el numero de items en el carrito
function conteoCarrito() {
	session = sessionStorage.getItem('carrito');

	if(session != null){
		var carritoProductos = JSON.parse(session);
		$('#conteoCarrito').html(carritoProductos.length);
	} else {
		$('#conteoCarrito').html('0');
	}
}

// Funcion para agregar un alemento al carrito mediante el session storage
function agregaProductoCarrito(producto) {
	session = sessionStorage.getItem('carrito');
	var carritoProductos = [];

	if(session != null) carritoProductos = JSON.parse(session);

	carritoProductos.push(producto);

	sessionStorage.setItem('carrito', JSON.stringify(carritoProductos));

	// Libreria de mensajes de la pagina http://bootboxjs.com/
	bootbox.alert("Producto agregaro al carrito!");
	
	conteoCarrito();
}

// Funcoin para eliminar un producto espesifico en el session storage
function eliminaProductoCarrito(index) {
	session = sessionStorage.getItem('carrito');

	if(session != null){
		var carritoProductos = JSON.parse(session);
		carritoProductos.splice(index, 1);

		sessionStorage.setItem('carrito', JSON.stringify(carritoProductos));

		conteoCarrito();
	}
}

conteoCarrito();

// Se verifica si el navegador soporta el serviceworker
if ('serviceWorker' in navigator) {
	// Al tarminar de cargar la pagina se registra el service worker
	window.addEventListener('load', function() {
		// Se registra el service worker
		navigator.serviceWorker.register('/serviceworker.js')
		.then(
			// Catch en caso de registro exitoso
			function(registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, 
			// Catch en caso de registro fallido 
			function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			}
		);
	});
}

// Dispara el evento 'sync' del service worker
navigator.serviceWorker.ready.then((swRegistration)=>{
	return swRegistration.sync.register('sincronizacion');
}).then(function (){
	console.log('Se inicio la sincronización');
}) 