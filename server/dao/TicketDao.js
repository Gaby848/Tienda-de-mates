import Ticket from '../models/Ticket.js';

class TicketDao {
    async create(ticketData) {
        try {
            const ticket = new Ticket({
                ...ticketData,
                code: Ticket.generateTicketCode()
            });
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Ticket.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error al buscar ticket por ID: ${error.message}`);
        }
    }

    async findByPurchaser(purchaser) {
        try {
            return await Ticket.find({ purchaser }).populate('products.product').sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error al buscar tickets por comprador: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await Ticket.find().populate('products.product').sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error al obtener todos los tickets: ${error.message}`);
        }
    }

    async findByCode(code) {
        try {
            return await Ticket.findOne({ code }).populate('products.product');
        } catch (error) {
            throw new Error(`Error al buscar ticket por código: ${error.message}`);
        }
    }

    async updateStatus(id, status) {
        try {
            return await Ticket.findByIdAndUpdate(id, { status }, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar estado del ticket: ${error.message}`);
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            return await Ticket.find({
                purchase_datetime: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('products.product').sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error al buscar tickets por rango de fechas: ${error.message}`);
        }
    }

    async getTotalSales() {
        try {
            const result = await Ticket.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalTickets: { $sum: 1 }
                    }
                }
            ]);
            return result[0] || { totalAmount: 0, totalTickets: 0 };
        } catch (error) {
            throw new Error(`Error al calcular ventas totales: ${error.message}`);
        }
    }
}

export default new TicketDao();
