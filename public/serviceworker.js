importScripts('/dixie.js');
importScripts('/bd.js');

let staticCache = "static-v1";
let dynamicCache = "dynamic-v1";
let inmutableCache = "inmutable-v1";

self.addEventListener("install", (result) => {
  // Lista de archivos que conforman el carcaron
  // o estructura basica de la aplicacion
  let files_appShell = [
    "/",
    "/index.html",
    "/assets/favicon.ico",
    "/css/styles.css",
    "/js/scripts.js",
    "/js/detalle.js",
    "/js/carrito.js",
    "/js/index.js",
    "/bd.js"
  ];

  // se guarda el files_appShell, pues es lo vasico para que funcoine la aplicacion
  const static_cache = caches.open(staticCache).then((cacheStatic) => {
    cacheStatic.addAll(files_appShell);
  });

  // Lista de archivos que no cambian, pues son lobrerias que no se deben modificar
  const inmutable_cache_files = [
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js",
    "/dixie.js"
  ];

  // Crea la cache para los archivos locales
  const inmutable_cache=caches.open(inmutableCache).then((cacheInmutable) => {
    cacheInmutable.addAll(inmutable_cache_files);
  });

  // Espera a que termine el waitUntil para instalar el serviceworker
  result.waitUntil(Promise.allSettled([static_cache, inmutable_cache]));
});

// Elimina cualquier archivo que ya no sea necesario,
// ademas limpia la aplicación en general
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cachesList) =>
        Promise.all(
          cachesList.map((cacheName) => {
            if (staticCache != cacheName && inmutableCache != cacheName) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => {
        console.log("V2 now ready to handle fetches!");
      })
  );
});

// Evento que atrapa todas las peticiones fetch de la PWA
self.addEventListener('fetch', (event) => {
  var requestClone = event.request.clone();

  // Si es un evento post se realiza la peticion
  if(event.request.url.includes("/general/guardaPedido")){
    fetch(event.request);
  }else{ // Si no lo es se reponde con los archivos del cache
    event.respondWith(caches.match(event.request).then(
      cacheResponse => {
        // Verifica si el archivo se encuentra en cache 
        // si no lo manda a traer y lo actualiza
        return cacheResponse || fetch(event.request).then(
          networkResponse => {
            caches.open(dynamicCache).then(cache => {
                cache.put(event.request, networkResponse.clone())
                return networkResponse;
            });
          }
        )
      }
    ));
  }
});

// Evento message
self.addEventListener("message", (obj) => {
  // revisar si el msj tiene el mensaje 'skipWaiting'
  if (obj.data.action === "skipWaiting") {
    // ejecutar el skipWaiting
    self.skipWaiting();
  }
});

// Evento que maneja la sincronizacion, se invoca en scripts.js linea 70
self.addEventListener('sync',function(event) {
  if(event.tag=='sincronizacion'){
    // Sincroniza los datos del indexdb 
    event.waitUntil( sincronizacion());
  }
});