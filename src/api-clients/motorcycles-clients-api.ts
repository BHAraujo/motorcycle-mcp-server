import { BASE_URL } from '../server.js'
import type { MotorcycleCreate, MotorcycleDelete, MotorcycleListAll, MotorcycleListAllResponse, MotorcycleUpdate } from '../types/motorcycle.interface.js';



class MotorcycleClientApi {

   async create(request: MotorcycleCreate){
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      return response.json()
      
    } catch (error) {
      console.error('Error when try to get the mortorcycles list');
      return {error};
    }
   }

   async listAll(request: MotorcycleReadAll){
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    
      return response.json()
      
    } catch (error) {
      console.error('Error when try to get the mortorcycles list');
      return {error};
    }
   }

    async update(request: MotorcycleUpdate){
    try {
      const response = await fetch(`${request.url}/${request.body.id}`, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      return response.json()
      
    } catch (error) {
      console.error('Error when try to update the mortorcycle');
      return {error};
    }
   }

    async deleteById(request: MotorcycleDelete){
    try {
      const response = await fetch(`${request.url}/${request.id}`,  {
        method: request.method,
        headers: request.headers,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    
      return response.json()
      
    } catch (error) {
      console.error('Error when try to get the mortorcycles list');
      return {error};
    }
   }
}




export const motorcycleClientApi = new MotorcycleClientApi()