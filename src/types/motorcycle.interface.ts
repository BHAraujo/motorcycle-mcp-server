import type { HttpMethod } from "./motorcycle.enum.js";

interface Motorcycle {
    brand: string;
    model: string;
    cc: number;
    description: string;

}

export interface MotorcycleCreate {
    url: string;
    method: HttpMethod; 
    headers: HeadersInit;
    body: Motorcycle

}

export interface MotorcycleReadAll {
    url: string;
    method: HttpMethod; 
    headers: HeadersInit;

}

export interface MotorcycleWithId extends Motorcycle {
  id: string;
}

export interface MotorcycleUpdate {
    url: string;
    method: HttpMethod; 
    headers: HeadersInit;
    body: MotorcycleWithId
}

export interface MotorcycleDelete {
    url: string;
    method: HttpMethod; 
    headers: HeadersInit;
    id: number
}
