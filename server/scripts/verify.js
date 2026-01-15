/**
 * Script de Verificación Rápida
 * 
 * Verifica que todos los módulos requeridos estén instalados
 * y que la estructura del proyecto sea correcta
 * 
 * Uso: node server/scripts/verify.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');

console.log('\n🔍 Verificando la estructura del proyecto...\n');

// Archivos y carpetas requeridas
const requiredStructure = [
    'server/models/Product.js',
    'server/models/Cart.js',
    'server/config/config.js',
    'server/config/database.js',
    'server/services/ProductService.js',
    'server/services/CartService.js',
    'server/routes/products.router.js',
    'server/routes/carts.router.js',
    'server/routes/views.router.js',
    'server/views/products.handlebars',
    'server/views/product.handlebars',
    'server/views/carts.handlebars',
    'server/views/home.handlebars',
    'server/views/error.handlebars',
    'package.json',
    '.env.example',
    '.gitignore',
    'README.md',
    'CAMBIOS.md',
    'ENTREGA.md'
];

let allFilesExist = true;

console.log('📂 Verificando archivos...');
requiredStructure.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - NO ENCONTRADO`);
        allFilesExist = false;
    }
});

console.log('\n📦 Verificando dependencias...');

// Leer package.json
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = ['mongoose', 'express', 'express-handlebars', 'cors', 'socket.io', 'dotenv'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`  ✅ ${dep} - ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`  ❌ ${dep} - NO INSTALADA`);
        }
    });

    // Verificar scripts
    console.log('\n🔧 Verificando scripts npm...');
    const requiredScripts = ['start', 'dev', 'seed'];
    requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            console.log(`  ✅ npm run ${script}`);
        } else {
            console.log(`  ❌ npm run ${script} - NO DEFINIDO`);
        }
    });
} else {
    console.log('  ❌ package.json - NO ENCONTRADO');
    allFilesExist = false;
}

// Verificar .env
console.log('\n🔐 Verificando configuración...');
const envPath = path.join(projectRoot, '.env');
const envExamplePath = path.join(projectRoot, '.env.example');

if (fs.existsSync(envPath)) {
    console.log('  ✅ .env - Configurado (local)');
} else {
    console.log('  ⚠️  .env - No existe (usar .env.example como plantilla)');
}

if (fs.existsSync(envExamplePath)) {
    console.log('  ✅ .env.example - Plantilla disponible');
} else {
    console.log('  ❌ .env.example - NO ENCONTRADO');
    allFilesExist = false;
}

// Resumen
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('✅ VERIFICACIÓN EXITOSA');
    console.log('\nProximos pasos:');
    console.log('1. npm install');
    console.log('2. Crear .env (copiar de .env.example)');
    console.log('3. npm run seed (opcional, para cargar datos de prueba)');
    console.log('4. npm run dev (iniciar servidor)');
} else {
    console.log('❌ FALTAN ARCHIVOS O CONFIGURACIÓN');
    console.log('\nPor favor, revisa la lista anterior.');
}
console.log('='.repeat(50) + '\n');
