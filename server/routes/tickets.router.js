import { Router } from 'express';
import ticketRepository from '../repositories/TicketRepository.js';
import cartRepository from '../repositories/CartRepository.js';
import userRepository from '../repositories/UserRepository.js';
import TicketDTO from '../dto/TicketDTO.js';
import emailService from '../services/EmailService.js';
import { cartAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Obtener todos los tickets (solo admin)
router.get('/', async (req, res) => {
    try {
        const tickets = await ticketRepository.getAllTickets();
        res.json({
            status: 'success',
            payload: tickets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Obtener ticket por ID
router.get('/:tid', async (req, res) => {
    try {
        const ticket = await ticketRepository.getTicketById(req.params.tid);
        if (!ticket) {
            return res.status(404).json({
                status: 'error',
                message: 'Ticket no encontrado'
            });
        }
        res.json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Obtener tickets del usuario actual
router.get('/user/my-tickets', async (req, res) => {
    try {
        // Aquí deberías obtener el usuario del token JWT
        const userEmail = req.user.email; // Asumiendo que tienes el middleware de autenticación
        const tickets = await ticketRepository.getTicketsByPurchaser(userEmail);
        res.json({
            status: 'success',
            payload: tickets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Realizar compra (procesar carrito a ticket)
router.post('/purchase', ...cartAuthMiddleware.purchase, async (req, res) => {
    try {
        const cartId = req.user.cart;
        
        // Obtener datos del carrito para la compra
        const purchaseData = await cartRepository.purchaseCart(cartId, req.user.id);
        
        // Generar ticket
        const ticket = await ticketRepository.generatePurchaseTicket(purchaseData, req.user);
        
        // Confirmar compra (vaciar carrito)
        await cartRepository.confirmPurchase(cartId, req.user.id);
        
        // Enviar email de confirmación
        await emailService.sendPurchaseConfirmationEmail(req.user.email, ticket);
        
        res.status(201).json({
            status: 'success',
            message: 'Compra realizada exitosamente',
            payload: {
                ticket: ticket,
                purchaseData: purchaseData
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Cancelar ticket
router.put('/:tid/cancel', async (req, res) => {
    try {
        const ticket = await ticketRepository.cancelTicket(req.params.tid);
        res.json({
            status: 'success',
            message: 'Ticket cancelado exitosamente',
            payload: ticket
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Obtener estadísticas de ventas (solo admin)
router.get('/stats/sales', async (req, res) => {
    try {
        const stats = await ticketRepository.getTotalSales();
        res.json({
            status: 'success',
            payload: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
