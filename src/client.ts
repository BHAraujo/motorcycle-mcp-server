import { Client } from '@prefecthq/fastmcp-ts/client'

const client = await Client.connect('http://127.0.0.1:8080/mcp')

console.log('tools:', await client.listTools())

const motorcyclesList = await client.callTool('motorcycle_list')
console.log('motorcycle_list =', motorcyclesList)

async function getData() {
  const url = "http://localhost:3000/motorcycles";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro when try to get the mortorcycles list');
  }
}

const motorcycles = await getData()

console.log(motorcycles)




