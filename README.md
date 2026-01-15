# 🧉 Tienda de Mates

Proyecto de tienda online especializada en mates y accesorios relacionados. Esta es la entrega final con integración de **MongoDB** como sistema de persistencia principal, endpoints profesionalizados con paginación, filtros y ordenamientos, y vistas interactivas con Handlebars.

## ✨ Características

### API REST Endpoints

#### Productos
- **GET** `/api/products` - Obtener productos con paginación, filtros y ordenamiento
  - Query params: `limit` (default: 10), `page` (default: 1), `query` (filtro por categoría), `sort` (asc/desc por precio)
  - Respuesta: Objeto con `payload`, `totalPages`, `page`, `hasPrevPage`, `hasNextPage`, `prevLink`, `nextLink`
- **GET** `/api/products/:pid` - Obtener un producto específico
- **POST** `/api/products` - Crear un nuevo producto
- **PUT** `/api/products/:pid` - Actualizar un producto
- **DELETE** `/api/products/:pid` - Eliminar un producto

#### Carritos
- **POST** `/api/carts` - Crear un nuevo carrito
- **GET** `/api/carts/:cid` - Obtener un carrito con productos "populados" desde MongoDB
- **POST** `/api/carts/:cid/products/:pid` - Agregar un producto al carrito
- **DELETE** `/api/carts/:cid/products/:pid` - Eliminar un producto del carrito
- **PUT** `/api/carts/:cid/products/:pid` - Actualizar cantidad de un producto
- **PUT** `/api/carts/:cid` - Actualizar todos los productos del carrito
- **DELETE** `/api/carts/:cid` - Vaciar el carrito

### Vistas Handlebars

- **GET** `/products` - Vista de productos con paginación e integración de carrito
- **GET** `/products/:pid` - Detalle del producto con opción de agregar al carrito
- **GET** `/carts/:cid` - Vista del carrito con gestión de cantidades y eliminación de productos

### Características Adicionales

- ✅ WebSocket en tiempo real para notificaciones de nuevos productos
- ✅ Validaciones completas en modelos MongoDB
- ✅ Populate de referencias en carritos (almacenamos IDs, mostramos productos completos)
- ✅ Helpers personalizados en Handlebars
- ✅ Manejo de errores robusto
- ✅ Comentarios extensivos en el código

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB (local o cloud - MongoDB Atlas)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <URL_REPOSITORIO>
cd Tienda-de-mates
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
```

**Configuración de .env:**
```env
PORT=3000

# Para MongoDB local:
MONGO_URI=mongodb://localhost:27017/tienda-de-mates

# Para MongoDB Atlas (cloud):
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tienda-de-mates

NODE_ENV=development
```

4. **Asegurarse que MongoDB está corriendo**

**En Windows (si está instalado localmente):**
```bash
mongod
```

**O usar MongoDB Atlas (cloud)** - Solo necesitas la URI de conexión

5. **Iniciar el servidor**
```bash
npm start          # Modo producción
npm run dev        # Modo desarrollo (con nodemon)
```

El servidor estará disponible en `http://localhost:3000`

## 📋 Ejemplos de Uso

### Crear un Producto (API)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mate de Vidrio",
    "description": "Mate tradicional de vidrio con diseño moderno",
    "code": "MAT001",
    "price": 2500,
    "stock": 50,
    "category": "mates",
    "thumbnails": ["https://ejemplo.com/imagen1.jpg"],
    "status": true
  }'
```

### Obtener Productos con Paginación y Filtros
```bash
# Obtener página 2 con 5 productos por página
http://localhost:3000/api/products?page=2&limit=5

# Filtrar por categoría "mates" ordenado por precio ascendente
http://localhost:3000/api/products?query=mates&sort=asc

# Obtener productos disponibles descendentes
http://localhost:3000/api/products?query=disponible&sort=desc
```

### Crear un Carrito
```bash
curl -X POST http://localhost:3000/api/carts
```

Respuesta (guardar el `_id` para usar después):
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439011",
    "products": [],
    "createdAt": "2026-01-11T...",
    "updatedAt": "2026-01-11T..."
  }
}
```

### Agregar Producto al Carrito
```bash
curl -X POST http://localhost:3000/api/carts/507f1f77bcf86cd799439011/products/507f191e810c19729de860ea \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

### Ver Vista de Productos
```
http://localhost:3000/products
```

### Ver Detalle de Producto
```
http://localhost:3000/products/507f191e810c19729de860ea
```

### Ver Carrito
```
http://localhost:3000/carts/507f1f77bcf86cd799439011
```

## 📁 Estructura del Proyecto

```
server/
├── config/
│   ├── config.js              # Configuración principal
│   └── database.js            # Conexión a MongoDB
├── models/
│   ├── Product.js             # Esquema de Producto
│   └── Cart.js                # Esquema de Carrito
├── routes/
│   ├── products.router.js      # Endpoints de productos
│   ├── carts.router.js         # Endpoints de carritos
│   └── views.router.js         # Rutas de vistas
├── services/
│   ├── ProductService.js       # Lógica de productos
│   └── CartService.js          # Lógica de carritos
├── views/
│   ├── products.handlebars     # Lista de productos
│   ├── product.handlebars      # Detalle de producto
│   ├── carts.handlebars        # Vista del carrito
│   ├── home.handlebars         # Página principal
│   ├── error.handlebars        # Página de error
│   └── layouts/
│       └── main.handlebars     # Layout principal
├── public/
│   └── js/                     # JavaScript del cliente
├── app.js                      # Configuración de Express
└── server.js                   # Punto de entrada

package.json                    # Dependencias
.env.example                    # Variables de entorno (ejemplo)
.gitignore                      # Archivos a ignorar
README.md                       # Este archivo
```

## 🔧 Dependencias Principales

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **express-handlebars** - Motor de plantillas
- **cors** - Middleware CORS
- **socket.io** - WebSocket en tiempo real
- **nodemon** - Recarga automática en desarrollo

## 📚 Modelos de Datos

### Product
```javascript
{
  title: String (requerido),
  description: String (requerido),
  code: String (único, requerido),
  price: Number (requerido, mínimo 0),
  stock: Number (mínimo 0, default: 0),
  category: String (requerido),
  thumbnails: [String],
  status: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  products: [{
    product: ObjectId (referencia a Product),
    quantity: Number (mínimo 1)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto (default: 3000)
PORT=3000

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/tienda-de-mates

# Ambiente
NODE_ENV=development
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'mongoose'"
```bash
npm install mongoose dotenv
```

### Error: "MongoDB connection failed"
- Verificar que MongoDB está corriendo: `mongod`
- Verificar la URI de conexión en `.env`
- Para MongoDB Atlas, asegurarse de:
  - Crear un usuario en MongoDB Atlas
  - Agregar tu IP a la whitelist
  - Usar la URI correcta

### Error: Puerto ya en uso
```bash
# Cambiar el puerto en .env
PORT=3001
```

## 📝 Notas de Desarrollo

- Los comentarios en el código explican la lógica y son sugeridos por el proyecto
- La lógica de negocio existente se mantiene, solo cambió la persistencia a MongoDB
- Los endpoints siguen la misma estructura y lógica que se ha seguido
- Las vistas se actualizaron para reflejar la nueva estructura de datos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Para más información o preguntas, contactar al equipo de desarrollo.

---

**Última actualización:** 11 de enero de 2026
**Versión:** 2.0.0 (Con MongoDB)
