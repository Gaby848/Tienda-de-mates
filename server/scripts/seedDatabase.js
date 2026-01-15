/**
 * Script para llenar la base de datos con productos de ejemplo
 * 
 * Uso: node server/scripts/seedDatabase.js
 */

import mongoose from 'mongoose';
import { config } from '../config/config.js';
import Product from '../models/Product.js';

// Conectar a MongoDB
mongoose.connect(config.MONGODB.URI, config.MONGODB.options)
    .then(async () => {
        console.log('✓ Conectado a MongoDB');

        try {
            // Limpiar colección anterior (opcional)
            await Product.deleteMany({});
            console.log('🗑️  Colección de productos limpiada');

            // Productos de ejemplo
            const productsData = [
                {
                    title: 'Mate de Vidrio Clásico',
                    description: 'Mate tradicional de vidrio templado con diseño clásico. Perfecto para disfrutar del mate tradicional.',
                    code: 'MAT001',
                    price: 2500,
                    stock: 50,
                    category: 'mates',
                    thumbnails: ['https://www.belloexport.com.ar/wp-content/uploads/2018/05/HZ_3580.jpg'],
                    status: true
                },
                {
                    title: 'Mate de Cerámica Decorado',
                    description: 'Mate artesanal de cerámica con decoraciones típicas. Único y especial.',
                    code: 'MAT002',
                    price: 3500,
                    stock: 30,
                    category: 'mates',
                    thumbnails: ['https://acdn-us.mitiendanube.com/stores/001/150/477/products/003727_7-957842eeea6241ff1617271893044040-640-0.webp'],
                    status: true
                },
                {
                    title: 'Bombilla de Plata 925',
                    description: 'Bombilla elaborada en plata pura con filtro de calidad superior.',
                    code: 'BOM001',
                    price: 8000,
                    stock: 15,
                    category: 'bombillas',
                    thumbnails: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjbyZRE8S90brqm4B5sjEWZJNpool2Q4N_DA&s'],
                    status: true
                },
                {
                    title: 'Bombilla de Acero Inoxidable',
                    description: 'Bombilla práctica y duradera de acero inoxidable. Ideal para viajes.',
                    code: 'BOM002',
                    price: 1500,
                    stock: 100,
                    category: 'bombillas',
                    thumbnails: ['https://astralproductos.com/wp-content/uploads/2024/08/gris-oscuro-4.jpg'],
                    status: true
                },
                {
                    title: 'Termo de 1 Litro Stanley',
                    description: 'Termo de acero inoxidable con doble pared aislante. Mantiene el agua caliente por horas.',
                    code: 'TER001',
                    price: 4500,
                    stock: 45,
                    category: 'termos',
                    thumbnails: ['https://atacadoiguazu.com.ar/wp-content/uploads/2025/03/diseno-sin-titulo-6-177f403eb172edbf4d17263715423242-1024-1024.png'],
                    status: true
                },
                {
                    title: 'Termo de 1.5 Litros Premium',
                    description: 'Termo premium con filtro incorporado y capacidad extra. Perfecto para compartir.',
                    code: 'TER002',
                    price: 6500,
                    stock: 25,
                    category: 'termos',
                    thumbnails: ['https://stanleypm.vtexassets.com/arquivos/ids/161033/Ecomerce_-MateSystem1.2_MB1.jpg?v=639007995247100000'],
                    status: true
                },
                {
                    title: 'Yerbera de Madera Maciza',
                    description: 'Contenedor artesanal de madera maciza para almacenar yerba. Mantiene la frescura.',
                    code: 'ACC001',
                    price: 2000,
                    stock: 20,
                    category: 'accesorios',
                    thumbnails: ['https://talabarterialarodada.com/wp-content/uploads/2019/05/20191224_094829.jpg'],
                    status: true
                },
                {
                    title: 'Cepillo Limpiador de Bombilla',
                    description: 'Cepillo especialmente diseñado para limpiar bombillas. Con cerdas suaves.',
                    code: 'ACC002',
                    price: 500,
                    stock: 200,
                    category: 'accesorios',
                    thumbnails: ['https://indulimp.com.ar/wp-content/uploads/2023/04/CEPILLO-LIMPIA-BOMBILLAS.jpg'],
                    status: true
                },
                {
                    title: 'Yerba Mate Premium 500g',
                    description: 'Yerba mate de excelente calidad, molida sin palos. Sabor auténtico y tradicional.',
                    code: 'YER001',
                    price: 1200,
                    stock: 150,
                    category: 'yerba',
                    thumbnails: ['https://dcdn-us.mitiendanube.com/stores/005/858/029/products/35-a74d86bc8f491be52217537920594223-1024-1024.webp'],
                    status: true
                },
                {
                    title: 'Yerba Mate Elaborada 500g',
                    description: 'Yerba mate elaborada con monte y hierbas. Sabor más intenso y aromático.',
                    code: 'YER002',
                    price: 1500,
                    stock: 100,
                    category: 'yerba',
                    thumbnails: ['https://acdn-us.mitiendanube.com/stores/001/154/359/products/1-0dd870b7eb40da780217551092288274-480-0.webp'],
                    status: true
                }
            ];

            // Insertar productos
            const createdProducts = await Product.insertMany(productsData);
            console.log(`✓ ${createdProducts.length} productos insertados correctamente`);

            // Mostrar resumen
            console.log('\n📊 Productos creados:');
            createdProducts.forEach(product => {
                console.log(`  - ${product.title} (${product.category}) - $${product.price}`);
            });

            console.log('\n✅ Base de datos poblada correctamente');
            process.exit(0);

        } catch (error) {
            console.error('❌ Error al insertar productos:', error.message);
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    });
