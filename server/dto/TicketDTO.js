class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.purchaser_data = ticket.purchaser_data;
        this.products = ticket.products;
        this.status = ticket.status;
        this.createdAt = ticket.createdAt;
        this.updatedAt = ticket.updatedAt;
    }

    static fromTicket(ticket) {
        return new TicketDTO(ticket);
    }

    static fromTickets(tickets) {
        return tickets.map(ticket => new TicketDTO(ticket));
    }

    toJSON() {
        return {
            id: this.id,
            code: this.code,
            purchase_datetime: this.purchase_datetime,
            amount: this.amount,
            purchaser: this.purchaser,
            purchaser_data: this.purchaser_data,
            products: this.products,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default TicketDTO;
