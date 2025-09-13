import { Router } from 'express';
import { CreateEventController } from '@modules/events/services/createEvent/CreateEventController';
import { ListEventController } from '@modules/events/services/listEvent/ListEventController';
import { SellTicketController } from '@modules/events/services/sellTicket/CreateEventController';

const eventRouter = Router();

const createEventController = new CreateEventController()
const listEventController = new ListEventController()
const sellTicketController = new SellTicketController()


eventRouter
  .route('/events')
  .post(createEventController.handle)
  .get(listEventController.handle);

eventRouter.route('/events/sell-ticket').post(sellTicketController.handle)

export { eventRouter };
