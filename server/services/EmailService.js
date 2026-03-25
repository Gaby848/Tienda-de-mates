import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.EMAIL.SERVICE,
            port: config.EMAIL.PORT,
            secure: false,
            auth: {
                user: config.EMAIL.USER,
                pass: config.EMAIL.PASSWORD
            }
        });
    }

    async sendPasswordResetEmail(email, resetToken) {
        try {
            const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            const mailOptions = {
                from: config.EMAIL.USER,
                to: email,
                subject: 'Recuperación de Contraseña - Tienda de Mates',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                            <h1 style="color: #343a40; margin-bottom: 20px;">🔒 Recuperación de Contraseña</h1>
                            <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">
                                Hemos recibido una solicitud para restablecer tu contraseña. 
                                Haz clic en el botón de abajo para continuar.
                            </p>
                            <div style="margin: 30px 0;">
                                <a href="${resetUrl}" 
                                   style="background-color: #007bff; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; font-weight: bold; 
                                          display: inline-block;">
                                    Restablecer Contraseña
                                </a>
                            </div>
                            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                                Este enlace expirará en <strong>1 hora</strong>.
                            </p>
                            <p style="color: #6c757d; font-size: 14px;">
                                Si no solicitaste este cambio, puedes ignorar este correo.
                            </p>
                            <hr style="margin: 30px 0; border: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 12px;">
                                <strong>Tienda de Mates</strong><br>
                                Tu tienda de confianza para mates de calidad
                            </p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email de recuperación enviado a ${email}`);
            return true;
        } catch (error) {
            console.error('Error al enviar email de recuperación:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }

    async sendPurchaseConfirmationEmail(email, ticketData) {
        try {
            const mailOptions = {
                from: config.EMAIL.USER,
                to: email,
                subject: 'Confirmación de Compra - Tienda de Mates',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                            <h1 style="color: #28a745; text-align: center; margin-bottom: 20px;">
                                ✅ Confirmación de Compra
                            </h1>
                            <p style="color: #6c757d; font-size: 16px;">
                                ¡Gracias por tu compra en Tienda de Mates!
                            </p>
                            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #343a40; margin-bottom: 15px;">Detalles del Pedido</h3>
                                <p><strong>Código de Pedido:</strong> ${ticketData.code}</p>
                                <p><strong>Fecha:</strong> ${new Date(ticketData.purchase_datetime).toLocaleString()}</p>
                                <p><strong>Total:</strong> $${ticketData.amount.toFixed(2)}</p>
                            </div>
                            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #343a40; margin-bottom: 15px;">Productos Comprados</h3>
                                ${ticketData.products.map(product => `
                                    <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
                                        <p><strong>${product.product.title}</strong></p>
                                        <p>Cantidad: ${product.quantity} | Precio: $${product.price} | Subtotal: $${product.subtotal}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <p style="color: #6c757d; font-size: 14px; text-align: center; margin-top: 30px;">
                                <strong>Tienda de Mates</strong><br>
                                ¡Gracias por tu confianza!
                            </p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email de confirmación enviado a ${email}`);
            return true;
        } catch (error) {
            console.error('Error al enviar email de confirmación:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }

    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Conexión con servidor de email establecida');
            return true;
        } catch (error) {
            console.error('❌ Error en conexión con servidor de email:', error);
            throw new Error(`Error de conexión: ${error.message}`);
        }
    }
}

export default new EmailService();
