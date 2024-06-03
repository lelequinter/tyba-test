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
            }).refine( data => (data.coordinates ? !data.city : data.city ), {
                message: 'Solo Puede proveer una de las dos propiedades, coordenadas o ciudad',
                path: ['coordinates', 'city']
            })
        }
    },
    {
        router: restaurantRouter,
        path: '/history',
        method: 'post',
        needAuth: true,
        handler: RestaurantsController.getRestaurantsHistory,
        validators: {
            body: z.object({
                limit: z.number().min(1),
                offset: z.number().min(0),
            })
        }
    },
]

routes.forEach( (route: Route) => {
    createRoute( route );
});

export default restaurantRouter;