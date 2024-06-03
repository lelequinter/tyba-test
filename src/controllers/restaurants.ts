import axios from "axios"
import { Request, Response } from "express";
import { History, IHistory } from "../models/history";

//* Find nearby restaurants
/**
 * Find nearby restaurants
 * @route POST /restaurants
 * @group Restaurants - Operations about restaurants
 * @param {User.model} user.body.required - The restaurants data city name or coordinates
 * @returns {User} 200 - The nearby food places array
 * @returns {ErrorResponse}  500 - Internal server error response
 */
const findRestaurants = async (req: Request, res: Response) => {
    const  userId  = req.userId;
    const { lon, lat } = req.body?.coordinates || {};
    const city = req.body.city;

    try {
        let searchLon = lon;
        let searchLat = lat;

        if( city ){
            const forwardUrl = `${String(process.env['MB_URL_FORWARD'])}?q=${city}&access_token=${String(process.env['MB_ACCESS_TOKEN'])}`;
            const { data: forwardData} = await axios.get( forwardUrl );
            
            const { longitude: cityLon, latitude: cityLat } = forwardData.features[0].properties.coordinates;
            searchLon = cityLon;
            searchLat = cityLat;
        }
        
        const url = `${String(process.env['MB_URL_SUGGEST'])}?q=${String(process.env['MB_SEARCH'])}&language=es&proximity=${searchLon},${searchLat}&session_token=${String(process.env['MB_SESSION_TOKEN'])}&access_token=${String(process.env['MB_ACCESS_TOKEN'])}`;

        const places = await axios.get( url );
        
        const mapBoxIds = places.data.suggestions.map((el: any) => el.mapbox_id);

        const response = [];
        const history: Omit <IHistory,'id'|'createdAt'|'updatedAt'>[] = [];

        for( let id of mapBoxIds  ){
            const url = `${String(process.env['MB_URL_RETRIEVE'])}/${id}?session_token=${String(process.env['MB_SESSION_TOKEN'])}&access_token=${String(process.env['MB_ACCESS_TOKEN'])}`
            
            const placeData = await axios.get( url );
            
            if( !placeData.data.features.length ){
                continue;
            }

            const { name, full_address } = placeData.data.features[0].properties;

            response.push({ name, full_address });
            history.push({ name, address: full_address, userId, ciudad: city, longitude: lon, latitude: lat, });
        }

        await History.bulkCreate(history);
        
        res.status(200).json({ places: response });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500); 
    }
}

//* Get restaurants history
/**
 * Get restaurants history list
 * @route POST /restaurants/history
 * @group Restaurants - Operations about restaurants
 * @param {User.model} user.body.required - The list restaurants history (limit, offset) required
 * @returns {User} 200 - The restaurants history list
 * @returns {ErrorResponse}  500 - Internal server error response
 */
const getRestaurantsHistory = async (req: Request, res: Response) => {
    const { userId } = req;
    const { limit, offset } = req.body;

    try {
        const response = await History.findAll({ where: { userId }, limit, offset });

        const filteredRestaurants = response.map( res => ({ name: res.name, address: res.address }) );

        res.status(200).json( { filteredRestaurants, limit, offset } );
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500); 
    }
}

export default { findRestaurants, getRestaurantsHistory };