<!-- src/views/AdminOrders.vue -->
<template>
  <div class="page">
    <!-- ▸ Header -->
    <header class="header">
      <div class="brand">
        <img :src="logo" class="logo" alt="logo" />
        <span class="shop-title">Peace, Love & Ice Cream</span>
      </div>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <a @click.prevent="logout">Logout</a>
      </nav>
    </header>

    <!-- ▸ Main -->
    <main class="main">
      <section class="admin-card">
        <h2>Bestellingen</h2>

        <p v-if="busy">Laden…</p>
        <p v-if="error" class="error">{{ error }}</p>

        <table v-if="!busy" class="order-table">
          <thead>
            <tr>
              <th>Klant</th><th>Ijs-smaak</th><th>Topping</th>
              <th>Prijs</th><th>Status</th><th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="o in orders" :key="o._id">
              <td @click="select(o)" class="clickable">{{ o.customerName }}</td>
              <td>{{ o.iceFlavor }}</td>
              <td>{{ o.toppingFlavor }}</td>
              <td>€{{ o.total.toFixed(2) }}</td>

              <td>
                <select v-model="o.status" @change="onStatusChange(o)">
                  <option>te verwerken</option>
                  <option>verzonden</option>
                  <option>geannuleerd</option>
                </select>
              </td>

              <td><button class="del-btn" @click="openConfirm(o)">🗑</button></td>
            </tr>

            <tr v-if="!orders.length && !busy">
              <td colspan="6" class="empty">Geen bestellingen</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- ▸ Detail-slideover -->
    <div v-if="detail" class="overlay" @click.self="detail = null">
      <aside class="slideover">
        <h3>Order #{{ detail._id }}</h3>
        <p><strong>Klant:</strong> {{ detail.customerName }}</p>
        <p><strong>Adres:</strong> {{ detail.customerAddr }}</p>
        <p><strong>Totaal:</strong> €{{ detail.total.toFixed(2) }}</p>
        <p><strong>Status:</strong> {{ detail.status }}</p>
        <p><strong>Ijs-smaak:</strong> {{ detail.iceFlavor }}</p>
        <p><strong>Topping:</strong> {{ detail.toppingFlavor }}</p>
        <button class="btn" @click="detail = null">Sluit</button>
      </aside>
    </div>

    <!-- ▸ Verwijder-bevestiging -->
    <div v-if="confirmOrder" class="overlay" @click.self="closeConfirm">
      <div class="confirm-box">
        <p>
          Weet je zeker dat je bestelling van<br />
          <strong>{{ confirmOrder.customerName }}</strong> wilt verwijderen?
        </p>
        <div class="confirm-actions">
          <button class="btn secondary" @click="closeConfirm">Annuleer</button>
          <button class="btn" @click="confirmDelete">Verwijder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter }      from 'vue-router';
import logo from '@/assets/ben-and-jerrys-logo.svg';

/* — config — */
const BASE      = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';
const API_USERS = `${BASE}/api/users/me`;
const API_ORDERS= `${BASE}/api/orders`;
const TOKEN_KEY = 'token';

const router = useRouter();

/* — state — */
const orders       = ref([]);
const detail       = ref(null);
const busy         = ref(false);
const error        = ref('');
const confirmOrder = ref(null);

/* — auth helpers — */
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function authHeaders() {
  const t = getToken();
  return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
}
function forceLogout() {
  localStorage.removeItem(TOKEN_KEY);
  router.replace('/login');
}

/* — verify token on mount — */
async function ensureAuth() {
  const token = getToken();
  if (!token) { forceLogout(); return; }

  try {
    const res = await fetch(API_USERS, { headers: authHeaders() });
    if (!res.ok) throw new Error();
  } catch {
    forceLogout();              // verlopen / ongeldig token
  }
}

/* — API calls — */
async function loadOrders() {
  try {
    busy.value = true;
    const res  = await fetch(API_ORDERS, { headers: authHeaders() });
    if (!res.ok) throw new Error(await res.text());
    orders.value = await res.json();
  } catch (e) {
    console.error(e);
    error.value = 'Laden mislukt.';
  } finally { busy.value = false; }
}

async function onStatusChange(o) {
  const prev = o.status;
  try {
    const res = await fetch(`${API_ORDERS}/${o._id}`, {
      method:'PATCH',
      headers:authHeaders(),
      body:JSON.stringify({ status:o.status }),
    });
    if (!res.ok) throw new Error(await res.text());
  } catch (e) {
    console.error(e);
    error.value = 'Status niet opgeslagen – ongedaan gemaakt.';
    o.status = prev;
  }
}

function openConfirm(order)  { confirmOrder.value = order; }
function closeConfirm()      { confirmOrder.value = null; }

async function confirmDelete() {
  const id = confirmOrder.value._id;
  closeConfirm();
  try {
    await fetch(`${API_ORDERS}/${id}`, { method:'DELETE', headers:authHeaders() });
    orders.value = orders.value.filter(o => o._id !== id);
    if (detail.value?._id === id) detail.value = null;
  } catch (e) {
    console.error(e);
    error.value = 'Verwijderen mislukt.';
  }
}

/* — UI helpers — */
const select = o => (detail.value = { ...o });
const logout = forceLogout;

/* — init — */
onMounted(async () => {
  await ensureAuth();     // valideer token of redirect
  await loadOrders();     // laad data als auth ok
});
</script>

<style scoped>
/* bestaande styles ------------------------------------------------- */
.page   { min-height:100vh; display:flex; flex-direction:column; font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; }
.header { background:#FAB20B; color:#fff; padding:1rem 2rem; display:flex; justify-content:space-between; align-items:center; }
.brand  { display:flex; align-items:center; gap:.5rem; }
.logo   { height:50px; }
.shop-title { font-size:1.4rem; font-weight:600; }
.nav a { margin-left:1.25rem; color:#fff; text-decoration:none; font-weight:500; }
.nav a:hover { text-decoration:underline; }

.main { flex:1; display:flex; justify-content:center; padding:2rem; }
.admin-card { width:760px; background:#fff; border-radius:1.5rem; padding:2rem 2.25rem; box-shadow:0 4px 20px rgba(0,0,0,.1); }
.admin-card h2 { font-size:1.6rem; margin-bottom:1.25rem; }

.order-table { width:100%; border-collapse:collapse; }
.order-table th, .order-table td { padding:.75rem; border-bottom:1px solid #e3e3e3; text-align:left; }
.order-table th { background:#fafafa; font-weight:600; }
.order-table select { padding:.35rem .6rem; border:1px solid #ccc; border-radius:.4rem; }
.clickable { cursor:pointer; color:#0077c8; }
.clickable:hover { text-decoration:underline; }
.del-btn { background:none; border:none; cursor:pointer; font-size:1.1rem; }
.empty { text-align:center; padding:2rem 0; color:#777; }
.error { color:#d33434; margin:.5rem 0; }

.btn { padding:.8rem 1.1rem; background:#FAB20B; color:#fff; border:none; border-radius:.7rem; font-weight:600; cursor:pointer; }
.btn:hover { background:#d0960f; }
.btn.secondary { background:#e0e0e0; color:#333; }
.btn.secondary:hover { background:#c7c7c7; }

/* overlay & slideover (reeds aanwezig) */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; justify-content:flex-end; }
.slideover { width:300px; background:#fff; padding:2rem; box-shadow:-4px 0 20px rgba(0,0,0,.2); display:flex; flex-direction:column; gap:.8rem; }
.slideover h3 { font-size:1.4rem; margin-bottom:.5rem; }

/* ─ pop-up voor verwijderen ─ */
.confirm-box {
  margin:auto;
  background:#fff;
  padding:1.8rem 2.2rem;
  border-radius:1rem;
  box-shadow:0 6px 24px rgba(0,0,0,.2);
  text-align:center;
  max-width:320px;
}
.confirm-box p { margin-bottom:1.2rem; line-height:1.4; }
.confirm-actions { display:flex; gap:1rem; justify-content:center; }
</style>