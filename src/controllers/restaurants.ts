import axios from "axios"
import { Request, Response } from "express";
import { History, IHistory } from "../models/history";


//* Find nearby restaurants
const findRestaurants = async (req: Request, res: Response) => {
    const  userId  = req.userId;
    const { lon, lat } = req.body.coordinates;
    const city = req.body.city;

    try {
        const url = `${String(process.env['MB_URL_SUGGEST'])}?q=${String(process.env['MB_SEARCH'])}&language=en&proximity=${lon},${lat}&session_token=${String(process.env['MB_SESSION_TOKEN'])}&access_token=${String(process.env['MB_ACCESS_TOKEN'])}`

        const places = await axios.get( url );

        const mapBoxIds = places.data.suggestions.map((el: any) => el.mapbox_id)

        const response = [];
        const history: Omit <IHistory,'id'|'createdAt'|'updatedAt'>[] = [];

        for( let id of mapBoxIds  ){
            const url = `${String(process.env['MB_URL_RETRIEVE'])}/${id}?session_token=${String(process.env['MB_SESSION_TOKEN'])}&access_token=${String(process.env['MB_ACCESS_TOKEN'])}`
            
            const placeData = await axios.get( url );

            const { name, full_address } = placeData.data.features[0].properties;

            response.push({ name, full_address });
            history.push({ name, address: full_address, userId, ciudad: city, longitude: lon, latitude: lat, });
        }

        await History.bulkCreate(history);
        
        return res.status(200).json({ places: response });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500); 
    }
}

export default { findRestaurants };