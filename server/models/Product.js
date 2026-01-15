import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    description: {
        type: String,
        required: true
    },
    
    code: {
        type: String,
        required: true,
        unique: true
    },
    
    price: {
        type: Number,
        required: true,
        min: 0
    },
    
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    
    category: {
        type: String,
        required: true,
        trim: true
    },
    
    thumbnails: [{
        type: String
    }],
    
    status: {
        type: Boolean,
        default: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
