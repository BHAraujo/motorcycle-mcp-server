
import { env } from './env.js';
import { FastMCP } from '@prefecthq/fastmcp-ts/server'
import { z } from 'zod'
import { motorcycleClientApi } from './api-clients/motorcycles-clients-api.js'
import { HttpMethod } from './types/motorcycle.enum.js'
import type { MotorcycleCreate, MotorcycleReadAll, MotorcycleUpdate, ResponseContent } from './types/motorcycle.interface.js'
import type { CallToolResult } from '@prefecthq/fastmcp-ts/client'

const server = new FastMCP({ name: 'motorcycle-mcp-server', version: '1.0.0' })
export const BASE_URL = env.BASE_URL

server.tool(
  {
    name: 'motorcycle_create',
    description: 'Create a new motorcycle',
    input: z.object({
      brand: z.string(),
      model: z.string(),
      cc: z.number(),
      description: z.string(),
    }),
  },
  async ({ brand, model, cc, description }):Promise<CallToolResult>  => {
   const request = {} as MotorcycleCreate
    
   request.url = BASE_URL
   request.method = HttpMethod.POST
   request.headers = {
          "Content-Type": "application/json",
        }
  request.body.brand = brand
  request.body.model = model
  request.body.cc = cc
  request.body.description = description

  const response = await motorcycleClientApi.create(request)
  
  return {
    isError: false,
    structuredContent: { motorcycle: response },
    content: [{type: 'text', text: response}]}

}
);

server.tool(
  {
    name: 'motorcycle_list',
    description: 'List all motorcycles that were created',
  },
  async ():Promise<CallToolResult> => {
    const request = {} as MotorcycleReadAll

    request.url = BASE_URL
    request.method = HttpMethod.GET
    request.headers = {
          "Content-Type": "application/json",
        }

    const response = await  motorcycleClientApi.listAll(request);
    
    return {
      isError: false,
      structuredContent: { motorcycles: response },  
      content: [{ type: 'text', text: response}]};
    } 
);


server.tool(
  {
    name: 'motorcycle_update',
    description: 'Update a motorcycle has been created',
    input: z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      cc: z.number(),
      description: z.string(),
    }),
  },
  async ({id, brand, model, cc, description }):Promise<CallToolResult>  => {
   const request = {} as MotorcycleUpdate
    
   request.url = BASE_URL
   request.method = HttpMethod.PUT
   request.headers = {
          "Content-Type": "application/json",
        }
  request.body.brand = brand
  request.body.model = model
  request.body.cc = cc
  request.body.description = description

  const response = await motorcycleClientApi.update(request)
  
  return {
    isError: false,
    structuredContent: { motorcycle: response },
    content: [{type: 'text', text: response}]}

}
);


server.tool({
  name: "motorcycle_delete",
  description: "Delete a motorcycle by id",
  input: z.object({ id: z.number() }),
},
async ({ id }) => {
  
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return  {
              isError: false,
              structuredContent: {motorcycle: response},
              content:[{ type: 'text', text: response }]}
  
  });

await server.run({
  transport: 'http',
  host: '127.0.0.1',
  port: 8080,
  health: { path: '/healthCheck', status: 200, body: 'Motor Cycle MCP SERVER is Running...' },
});

