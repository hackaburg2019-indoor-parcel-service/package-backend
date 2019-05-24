import { Router } from 'express';
import { DeliveryController } from '@home/controller';
import { DeliveryValidator } from '@home/misc';

const router: Router = Router();

router.post('/', DeliveryValidator.newDelivery(), DeliveryController.postCreateDelivery);

export const DeliveryRoute: Router = router;
