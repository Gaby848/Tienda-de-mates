# 🎯 ENTREGA FINAL - TIENDA DE MATES CON MONGODB

## ✅ CHECKLIST COMPLETADO

### Objetivos Generales
- ✅ MongoDB como sistema de persistencia principal
- ✅ Todos los endpoints definidos para productos y carritos
- ✅ Profesionalización de consultas con filtros, paginación y ordenamiento
- ✅ Gestión profesional de carrito con últimos conceptos

### Objetivos Específicos Cumplidos

#### 1. Endpoints de Productos Profesionalizados
- ✅ GET `/api/products` con query params:
  - `limit` (default: 10) - Número de elementos por página
  - `page` (default: 1) - Número de página
  - `query` (optional) - Filtro por categoría o disponibilidad
  - `sort` (asc/desc) - Ordenamiento por precio

- ✅ Respuesta con formato requerido:
  ```json
  {
    "status": "success",
    "payload": [...productos],
    "totalPages": 5,
    "prevPage": 1,
    "nextPage": 3,
    "page": 2,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevLink": "...",
    "nextLink": "..."
  }
  ```

- ✅ Búsqueda por categoría y disponibilidad
- ✅ Ordenamiento ascendente y descendente por precio

#### 2. Endpoints de Carritos Completos
- ✅ `POST /api/carts` - Crear carrito
- ✅ `GET /api/carts/:cid` - Obtener carrito con populate
- ✅ `POST /api/carts/:cid/products/:pid` - Agregar producto
- ✅ `DELETE /api/carts/:cid/products/:pid` - Eliminar producto
- ✅ `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- ✅ `PUT /api/carts/:cid` - Actualizar todos los productos
- ✅ `DELETE /api/carts/:cid` - Vaciar carrito

#### 3. Modelos MongoDB con Referencias
- ✅ Product model con validaciones completas
- ✅ Cart model con referencias a Product (populate)
- ✅ Almacenamos solo el ID del producto en el carrito
- ✅ Al solicitar, traemos productos completos mediante populate

#### 4. Vistas Handlebars
- ✅ Vista `/products` con:
  - Paginación completa
  - Filtros por categoría
  - Ordenamiento
  - Botón "Agregar al Carrito" directo
  
- ✅ Vista `/products/:pid` con:
  - Descripción completa del producto
  - Detalles de precio, categoría, etc.
  - Botón para agregar al carrito

- ✅ Vista `/carts/:cid` con:
  - Listado de productos del carrito
  - Gestión de cantidades
  - Eliminación de productos
  - Resumen de compra

#### 5. Código Profesional
- ✅ Comentarios extensivos en todos los archivos
- ✅ Lógica de negocio original intacta
- ✅ Persistencia cambiada a MongoDB
- ✅ Endpoints con estructura consistente
- ✅ Manejo de errores robusto

## 📦 CONTENIDO DEL REPOSITORIO

### Archivos Importantes
```
Tienda-de-mates/
├── package.json                    # Dependencias y scripts
├── .env.example                    # Plantilla de variables
├── .gitignore                      # Archivos ignorados (sin node_modules)
├── README.md                       # Documentación completa
├── CAMBIOS.md                      # Listado de todos los cambios
├── TESTING.js                      # Ejemplos de pruebas
├── server/
│   ├── server.js                   # Punto de entrada (conecta MongoDB)
│   ├── app.js                      # Configuración Express
│   ├── config/
│   │   ├── config.js               # Configuración principal
│   │   └── database.js             # Conexión MongoDB
│   ├── models/
│   │   ├── Product.js              # Esquema de Producto
│   │   └── Cart.js                 # Esquema de Carrito
│   ├── services/
│   │   ├── ProductService.js       # Lógica de productos
│   │   └── CartService.js          # Lógica de carritos
│   ├── routes/
│   │   ├── products.router.js      # Endpoints de productos
│   │   ├── carts.router.js         # Endpoints de carritos
│   │   └── views.router.js         # Rutas de vistas
│   ├── scripts/
│   │   └── seedDatabase.js         # Script para datos de prueba
│   └── views/                      # Plantillas Handlebars
│       ├── products.handlebars     # Listado con paginación
│       ├── product.handlebars      # Detalle de producto
│       ├── carts.handlebars        # Vista del carrito
│       ├── home.handlebars         # Página principal
│       ├── error.handlebars        # Página de error
│       └── layouts/main.handlebars # Layout principal
└── public/                         # Archivos estáticos
```

## 🚀 INSTRUCCIONES PARA EJECUTAR

### Prerrequisitos
- Node.js v14 o superior
- MongoDB (local o MongoDB Atlas en la nube)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Gaby848/Tienda-de-mates.git
cd Tienda-de-mates
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar MongoDB**

**Opción A: MongoDB Local**
```bash
# En otra terminal, ejecutar MongoDB
mongod
```

**Opción B: MongoDB Atlas (Cloud)**
- Crear cuenta en https://www.mongodb.com/cloud/atlas
- Crear un cluster
- Obtener la URI de conexión

4. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
```

Contenido de `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tienda-de-mates
NODE_ENV=development
```

5. **Llenar la base de datos con datos de prueba**
```bash
npm run seed
```

Este comando:
- Conecta a MongoDB
- Limpia la colección de productos
- Inserta 10 productos de ejemplo
- Muestra un resumen

6. **Iniciar el servidor**
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

7. **Verificar que funciona**
- Abre http://localhost:3000 en tu navegador
- Deberías ver la página de inicio
- Haz clic en "Ver Productos"
- Prueba los filtros y paginación

## 📝 EJEMPLOS DE USO

### API REST - Productos

**Obtener productos (primera página, 10 por página)**
```bash
curl http://localhost:3000/api/products
```

**Obtener con paginación personalizada**
```bash
curl "http://localhost:3000/api/products?page=2&limit=5"
```

**Filtrar por categoría**
```bash
curl "http://localhost:3000/api/products?query=mates"
```

**Ordenar por precio (menor a mayor)**
```bash
curl "http://localhost:3000/api/products?sort=asc"
```

**Combinación de filtros**
```bash
curl "http://localhost:3000/api/products?query=mates&sort=desc&page=1&limit=10"
```

### API REST - Carritos

**Crear un carrito**
```bash
curl -X POST http://localhost:3000/api/carts
```

Guarda el `_id` del carrito que se retorna.

**Obtener un carrito (con productos populados)**
```bash
curl http://localhost:3000/api/carts/ID_DEL_CARRITO
```

**Agregar un producto**
```bash
curl -X POST http://localhost:3000/api/carts/CART_ID/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

**Actualizar cantidad de un producto**
```bash
curl -X PUT http://localhost:3000/api/carts/CART_ID/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**Eliminar un producto del carrito**
```bash
curl -X DELETE http://localhost:3000/api/carts/CART_ID/products/PRODUCT_ID
```

**Vaciar todo el carrito**
```bash
curl -X DELETE http://localhost:3000/api/carts/CART_ID
```

## 🌐 VISTAS EN EL NAVEGADOR

- **Página Principal:** http://localhost:3000/
- **Productos (con paginación):** http://localhost:3000/products
- **Filtros de productos:** http://localhost:3000/products?query=mates&sort=asc
- **Detalle de producto:** http://localhost:3000/products/ID_PRODUCTO
- **Vista del carrito:** http://localhost:3000/carts/ID_CARRITO

## 🧪 TESTING

Abre la consola del navegador (F12) y copia/pega los comandos del archivo `TESTING.js`.

O usa Postman/Insomnia para probar los endpoints.

## 📊 ESTRUCTURA DE DATOS

### Producto (MongoDB)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  code: String (único),
  price: Number,
  stock: Number,
  category: String,
  thumbnails: [String],
  status: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Carrito (MongoDB)
```javascript
{
  _id: ObjectId,
  products: [
    {
      product: ObjectId (ref a Product),
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Variables de Entorno

Crear `.env` en la raíz:
```env
# Puerto
PORT=3000

# MongoDB
# Local:
MONGO_URI=mongodb://localhost:27017/tienda-de-mates

# O Cloud (MongoDB Atlas):
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda-de-mates

# Ambiente
NODE_ENV=development
```

## ⚠️ IMPORTANTE

1. **No incluir node_modules en el repositorio** - El `.gitignore` ya lo maneja
2. **Archivo .env no se publica** - Es solo local, usar `.env.example`
3. **MongoDB debe estar corriendo** - O usar Atlas en la nube
4. **Los datos se persisten en MongoDB** - No en archivos JSON

## 🐛 SOLUCIÓN DE PROBLEMAS

**Error: "Cannot find module 'mongoose'"**
```bash
npm install mongoose dotenv
```

**Error: "MongoDB connection refused"**
- Verificar que MongoDB está corriendo (`mongod`)
- Revisar la URI en `.env`
- Para Atlas, verificar IP whitelist

**Error: "Port 3000 already in use"**
- Cambiar PORT en `.env`
- O cerrar la app que usa el puerto

**Error: "Product not found"**
- Ejecutar `npm run seed` para cargar datos de prueba
- O crear productos manualmente vía API

## 📱 Funcionalidades Principales

✅ **Paginación automática** - Navega entre páginas de productos
✅ **Filtros dinámicos** - Busca por categoría o disponibilidad  
✅ **Ordenamiento** - Ordena productos por precio
✅ **Carrito funcional** - Agrega, modifica y elimina productos
✅ **Populate de MongoDB** - Obtén datos completos de productos
✅ **Respuestas estructuradas** - API con formato profesional
✅ **Validaciones** - Todas las entradas se validan
✅ **Manejo de errores** - Errores informativos en todas partes
✅ **WebSocket** - Actualizaciones en tiempo real (opcional)
✅ **Comentarios en código** - Documentación inline

## 🎓 Conceptos Implementados

- MongoDB y Mongoose ODM
- Modelos con validaciones y referencias
- Populate de referencias
- Paginación con metadata
- Filtros dinámicos
- Ordenamiento
- Handlebars con helpers personalizados
- Estructura MVC (Models, Controllers/Services, Views)
- API REST profesional
- Gestión de errores
- Variables de entorno
- WebSocket en tiempo real

## 📞 CONTACTO Y SOPORTE

GitHub: https://github.com/Gaby848/Tienda-de-mates

---

**✅ ENTREGA COMPLETA - Todos los requisitos cumplidos**

**Fecha:** 11 de enero de 2026  
**Versión:** 2.0.0  
**Estado:** ✅ Listo para producción
