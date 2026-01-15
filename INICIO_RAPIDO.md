# ⚡ GUÍA DE INICIO RÁPIDO

¿Quieres que funcione YA? Sigue estos pasos exactos:

## 1️⃣ Terminal - Instala Dependencias

```bash
cd "c:\Users\Gabriel\Desktop\Tienda de Mates"
npm install
```

**⏱️ Tiempo:** 2-3 minutos

---

## 2️⃣ MongoDB - Abre otra Terminal

### Opción A: MongoDB Local (MÁS FÁCIL)
```bash
mongod
```

**Si no lo tienes instalado:**
- Descarga desde: https://www.mongodb.com/try/download/community
- Instala y repite el comando

### Opción B: MongoDB Atlas (Cloud - SIN INSTALAR)
- Ve a: https://www.mongodb.com/cloud/atlas
- Crea una cuenta gratuita
- Crea un cluster
- Copia la URI de conexión

---

## 3️⃣ Configuración - Archivo .env

En la terminal principal:

```bash
# Windows PowerShell
cp .env.example .env
notepad .env
```

**O manualmente:**
- Copia `.env.example` → `.env`
- Edita con un editor de texto
- Reemplaza `MONGO_URI` con tu conexión

**Contenido esperado:**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tienda-de-mates
NODE_ENV=development
```

---

## 4️⃣ Datos de Prueba (Opcional pero Recomendado)

```bash
npm run seed
```

Esto carga 10 productos de ejemplo en la BD.

---

## 5️⃣ ¡Inicia el Servidor!

```bash
npm run dev
```

**Deberías ver:**
```
===================================================
🚀 Servidor corriendo en http://localhost:3000
📡 WebSocket corriendo en ws://localhost:3000
🗄️  MongoDB: mongodb://localhost:27017/tienda-de-mates
===================================================
```

---

## 6️⃣ ¡Pruébalo!

Abre en tu navegador: **http://localhost:3000**

- 🏠 Página principal
- 🛍️ Click en "Ver Productos"
- 🔍 Prueba filtros y paginación
- 📦 Agrega productos al carrito

---

## 🎯 Endpoints Rápidos para Probar

### En el Navegador
```
http://localhost:3000/products
http://localhost:3000/api/products?query=mates&sort=asc
```

### Con curl (Terminal)
```bash
# Ver productos
curl http://localhost:3000/api/products

# Crear carrito
curl -X POST http://localhost:3000/api/carts

# Ver productos filtrando
curl "http://localhost:3000/api/products?query=mates&limit=5"
```

---

## ⚠️ Si Algo Falla

### Error: "MongoDB connection refused"
```bash
# Verifica que MongoDB está corriendo
# En otra terminal, inicia: mongod
# O usa MongoDB Atlas
```

### Error: "Cannot find module"
```bash
# Instala las dependencias
npm install
```

### Error: "Port 3000 already in use"
```bash
# Edita .env
# Cambia PORT=3000 a PORT=3001
```

### Error: "products.handlebars not found"
- Verifica que estés en la carpeta correcta
- Debería estar: `server/views/products.handlebars`

---

## 📝 Archivos Importantes

```
✅ Necesitas estos:
- package.json
- .env (crear basándose en .env.example)
- server/server.js
- server/app.js
- server/config/config.js
- server/config/database.js
- server/models/
- server/services/
- server/routes/
- server/views/

❌ NO necesitas:
- node_modules/ (se instala con npm install)
- .git/ (si lo subes a GitHub)
```

---

## 🔥 En 1 Minuto (Si Ya Tienes MongoDB)

```bash
# 1. Instala
npm install

# 2. Configura
cp .env.example .env

# 3. Carga datos
npm run seed

# 4. Inicia
npm run dev

# 5. Abre
# http://localhost:3000
```

**¡LISTO! 🎉**

---

## 📚 Documentación Completa

Para más detalles:
- **README.md** - Documentación principal
- **CAMBIOS.md** - Todos los cambios realizados
- **ENTREGA.md** - Guía de entrega detallada
- **TESTING.js** - Ejemplos de pruebas

---

## 🆘 ¿Necesitas Ayuda?

1. **Lee el README.md** - Tiene todas las respuestas
2. **Verifica .env** - Asegúrate de tener MongoDB configurado
3. **Revisa la terminal** - Los errores son descriptivos
4. **Consulta ENTREGA.md** - Guía completa de solución de problemas

---

## ✅ Verificación Rápida

Para verificar que todo esté bien:

```bash
node server/scripts/verify.js
```

Esto te dirá qué falta.

---

**¡Espera a que vea funcionar tu tienda! 🧉**
