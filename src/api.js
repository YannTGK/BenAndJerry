/* src/api.js ------------------------------------------------------- */
const BASE= import.meta.env.VITE_API_URL + '/api';

export async function createOrder(data) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Bestelling opslaan mislukt');
  return res.json();
}
