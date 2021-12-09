var session;

function conteoCarrito() {
	session = sessionStorage.getItem('carrito');

	if(session != null){
		var carritoProductos = JSON.parse(session);
		$('#conteoCarrito').html(carritoProductos.length);
	} else {
		$('#conteoCarrito').html('0');
	}
}

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

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	  navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	  });
	});
  }

  navigator.serviceWorker.ready.then((swRegistration)=>{
	return swRegistration.sync.register('sincronizacion');
}).then(function (){
	console.log('Se inicio la sincronización');
}) 