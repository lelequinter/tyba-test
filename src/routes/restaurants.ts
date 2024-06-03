import { Router } from "express";
import RestaurantsController from "../controllers/restaurants";
import { createRoute, Route } from '../util/router';
import { object, z } from "zod";

const restaurantRouter = Router();

//* CRUD Routes /restaurants
const routes: Route[] = [
    {
        router: restaurantRouter,
        path: '/',
        method: 'post',
        needAuth: true,
        handler: RestaurantsController.findRestaurants,
        validators: {
            body: z.object({
                coordinates: z.object({
                    lon: z.number(),
                    lat: z.number()
                }).optional(),
                city: z.string().optional()
            })
        }
    },
]

routes.forEach( (route: Route) => {
    createRoute( route );
});

export default restaurantRouter;