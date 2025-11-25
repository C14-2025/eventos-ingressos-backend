import { Router } from 'express';
import { CreateEventController } from '@modules/events/services/createEvent/CreateEventController';
import { ListEventController } from '@modules/events/services/listEvent/ListEventController';
import { SellTicketController } from '@modules/events/services/sellTicket/SellTicketController';
import { ShowEventController } from '@modules/events/services/showEvent/ShowEventController';
import { UpdateEventController } from '@modules/events/services/updateEvent/UpdateEventController';
import { DeleteEventController } from '@modules/events/services/deleteEvent/DeleteEventController';

const eventRouter = Router();

const createEventController = new CreateEventController()
const listEventController = new ListEventController()
const showEventController = new ShowEventController()
const sellTicketController = new SellTicketController()
const updateEventController = new UpdateEventController()
const deleteEventController = new DeleteEventController()

eventRouter
  .route('/events')
  .post(createEventController.handle)
  .get(listEventController.handle)

eventRouter
  .route('/events/:id')
  .get(showEventController.handle)
  .put(updateEventController.handle)
  .delete(deleteEventController.handle);

eventRouter.route('/events/sell-ticket').post(sellTicketController.handle)

export { eventRouter };
