import ticketDao from '../dao/TicketDao.js';
import TicketDTO from '../dto/TicketDTO.js';

class TicketRepository {
    async createTicket(ticketData) {
        try {
            const ticket = await ticketDao.create(ticketData);
            return TicketDTO.fromTicket(ticket);
        } catch (error) {
            throw new Error(`Error en TicketRepository.createTicket: ${error.message}`);
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await ticketDao.findById(id);
            return ticket ? TicketDTO.fromTicket(ticket) : null;
        } catch (error) {
            throw new Error(`Error en TicketRepository.getTicketById: ${error.message}`);
        }
    }

    async getTicketsByPurchaser(purchaser) {
        try {
            const tickets = await ticketDao.findByPurchaser(purchaser);
            return TicketDTO.fromTickets(tickets);
        } catch (error) {
            throw new Error(`Error en TicketRepository.getTicketsByPurchaser: ${error.message}`);
        }
    }

    async getAllTickets() {
        try {
            const tickets = await ticketDao.findAll();
            return TicketDTO.fromTickets(tickets);
        } catch (error) {
            throw new Error(`Error en TicketRepository.getAllTickets: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            const ticket = await ticketDao.findByCode(code);
            return ticket ? TicketDTO.fromTicket(ticket) : null;
        } catch (error) {
            throw new Error(`Error en TicketRepository.getTicketByCode: ${error.message}`);
        }
    }

    async updateTicketStatus(id, status) {
        try {
            const ticket = await ticketDao.updateStatus(id, status);
            return TicketDTO.fromTicket(ticket);
        } catch (error) {
            throw new Error(`Error en TicketRepository.updateTicketStatus: ${error.message}`);
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            const tickets = await ticketDao.getTicketsByDateRange(startDate, endDate);
            return TicketDTO.fromTickets(tickets);
        } catch (error) {
            throw new Error(`Error en TicketRepository.getTicketsByDateRange: ${error.message}`);
        }
    }

    async getTotalSales() {
        try {
            return await ticketDao.getTotalSales();
        } catch (error) {
            throw new Error(`Error en TicketRepository.getTotalSales: ${error.message}`);
        }
    }

    async generatePurchaseTicket(cartData, userData) {
        try {
            const ticketData = {
                purchaser: userData.email,
                purchaser_data: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email
                },
                products: cartData.products,
                amount: cartData.total
            };

            return await this.createTicket(ticketData);
        } catch (error) {
            throw new Error(`Error en TicketRepository.generatePurchaseTicket: ${error.message}`);
        }
    }

    async getUserPurchaseHistory(userId, userEmail) {
        try {
            return await this.getTicketsByPurchaser(userEmail);
        } catch (error) {
            throw new Error(`Error en TicketRepository.getUserPurchaseHistory: ${error.message}`);
        }
    }

    async cancelTicket(ticketId) {
        try {
            const ticket = await this.getTicketById(ticketId);
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            if (ticket.status === 'cancelled') {
                throw new Error('El ticket ya está cancelado');
            }

            return await this.updateTicketStatus(ticketId, 'cancelled');
        } catch (error) {
            throw new Error(`Error en TicketRepository.cancelTicket: ${error.message}`);
        }
    }
}

export default new TicketRepository();
