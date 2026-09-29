import 'dotenv/config'
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} não definida`);
  return value;
}

export const env = {
  BASE_URL: required('BASE_URL'),
  API_TOKEN: required('API_TOKEN'),
  PORT: Number(process.env.PORT ?? 3000),
} as const;