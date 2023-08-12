import { ticketsModel } from "../models/tickets.model.js"
import { v4 as uuidv4 } from 'uuid'

class TicketManager {
    constructor() { }

    async newTicket(arr, email) {
        try {
            const amount = arr.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0)
            const datetime = new Date().toISOString();
            const purchaser = email
            const code = uuidv4()
            const newTicket = {
                code: code,
                purchase_datetime: datetime,
                amount: amount,
                purchaser: purchaser
            }
            const Ticket = await ticketsModel.create(newTicket)
            console.log("ticket", Ticket)
            return Ticket
        } catch (err) {
            throw new Error
        }
    }
}

export default TicketManager;