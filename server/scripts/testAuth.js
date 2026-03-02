// Archivo de prueba para el sistema de autenticación
// Ejecutar con: node server/scripts/testAuth.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Función para probar el registro
async function testRegister() {
    console.log('\n🧪 Probando registro de usuario...');
    
    const userData = {
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@test.com',
        age: 25,
        password: '123456',
        role: 'user'
    };
    
    try {
        const response = await fetch(`${BASE_URL}/api/sessions/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        console.log('✅ Registro:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en registro:', error.message);
    }
}

// Función para probar el login
async function testLogin() {
    console.log('\n🧪 Probando login de usuario...');
    
    const loginData = {
        email: 'juan.perez@test.com',
        password: '123456'
    };
    
    try {
        const response = await fetch(`${BASE_URL}/api/sessions/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        console.log('✅ Login:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en login:', error.message);
    }
}

// Función para probar el endpoint current
async function testCurrent() {
    console.log('\n🧪 Probando endpoint /current...');
    
    try {
        const response = await fetch(`${BASE_URL}/api/sessions/current`);
        const result = await response.json();
        console.log('✅ Current:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en current:', error.message);
    }
}

// Función principal
async function runTests() {
    console.log('🚀 Iniciando pruebas de autenticación...');
    console.log(`📍 URL base: ${BASE_URL}`);
    
    // Verificar si el servidor está corriendo
    try {
        await fetch(`${BASE_URL}/api/products`);
        console.log('✅ Servidor está corriendo');
    } catch (error) {
        console.error('❌ El servidor no está corriendo. Inicia el servidor primero con: npm run dev');
        return;
    }
    
    // Ejecutar pruebas
    await testRegister();
    await testLogin();
    await testCurrent();
    
    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📝 Notas:');
    console.log('- El endpoint /current requiere un token JWT válido');
    console.log('- Las cookies se manejan automáticamente en el navegador');
    console.log('- Para pruebas manuales, usa Postman o similar');
}

// Ejecutar pruebas
runTests().catch(console.error);
