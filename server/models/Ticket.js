import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    purchaser: {
        type: String,
        required: true
    },
    purchaser_data: {
        first_name: String,
        last_name: String,
        email: String
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    }
}, {
    timestamps: true
});

// Método estático para generar código único
ticketSchema.statics.generateTicketCode = function() {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TICKET-${timestamp}-${random}`;
};

// Índice para búsquedas eficientes
ticketSchema.index({ purchaser: 1 });
ticketSchema.index({ purchase_datetime: -1 });
ticketSchema.index({ code: 1 }, { unique: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
