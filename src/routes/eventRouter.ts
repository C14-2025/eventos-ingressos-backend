import { Router } from 'express';
import { CreateEventController } from '@modules/events/services/createEvent/CreateEventController';
import { ListEventController } from '@modules/events/services/listEvent/ListEventController';
import { SellTicketController } from '@modules/events/services/sellTicket/SellTicketController';
import { ShowEventController } from '@modules/events/services/showEvent/ShowEventController';
import { UpdateEventController } from '@modules/events/services/updateEvent/UpdateEventController';
import { DeleteEventController } from '@modules/events/services/deleteEvent/DeleteEventController';
import { ShowTicketController } from '@modules/events/services/showTicket/ShowTicketController';
import { UpdateTicketController } from '@modules/events/services/updateTicket/UpdateTicketController';

const eventRouter = Router();

const createEventController = new CreateEventController()
const listEventController = new ListEventController()
const showEventController = new ShowEventController()
const sellTicketController = new SellTicketController()
const updateEventController = new UpdateEventController()
const deleteEventController = new DeleteEventController()
const showTicketController = new ShowTicketController()
const updateTicketController = new UpdateTicketController()

eventRouter
  .route('/events')
  .post(createEventController.handle)
  .get(listEventController.handle)

eventRouter
  .route('/tickets/:document')
  .get(showTicketController.handle)

eventRouter
  .route('/tickets/:id')
  .put(updateTicketController.handle)

eventRouter
  .route('/events/:id')
  .get(showEventController.handle)
  .put(updateEventController.handle)
  .delete(deleteEventController.handle);

eventRouter.route('/events/sell-ticket').post(sellTicketController.handle)

export { eventRouter };
