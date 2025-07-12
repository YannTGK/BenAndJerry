<template>
  <div class="page">
    <!-- ▸ Header ------------------------------------------------------ -->
    <header class="header">
      <div class="brand">
        <span class="shop-title">Ben & Jerry's</span>
        <img :src="logo" class="logo" alt="logo" />
      </div>

      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Logout</RouterLink>
      </nav>
    </header>

    <!-- ▸ Main -------------------------------------------------------- -->
    <main class="main">
      <section class="admin-card">
        <h2>Bestellingen</h2>

        <table class="order-table">
          <thead>
            <tr>
              <th>Klant</th>
              <th>Prijs</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o._id">
              <td @click="select(o)" class="clickable">{{ o.name }}</td>
              <td>€{{ o.price.toFixed(2) }}</td>
              <td>
                <select v-model="o.status" @change="updateStatus(o)">
                  <option>te verwerken</option>
                  <option>verzonden</option>
                  <option>geannuleerd</option>
                </select>
              </td>
              <td>
                <button class="del-btn" @click="remove(o._id)">🗑</button>
              </td>
            </tr>

            <tr v-if="!orders.length">
              <td colspan="4" class="empty">Geen bestellingen</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- ▸ Detail-slideover ------------------------------------------- -->
    <div v-if="detail" class="overlay" @click.self="detail = null">
      <aside class="slideover">
        <h3>Order #{{ detail._id }}</h3>

        <p><strong>Klant:</strong> {{ detail.name }}</p>
        <p><strong>Adres:</strong> {{ detail.address }}</p>
        <p><strong>Totaal:</strong> €{{ detail.price.toFixed(2) }}</p>
        <p><strong>Status:</strong> {{ detail.status }}</p>

        <div class="flavor-list">
          <p><strong>Smaken:</strong></p>
          <ul>
            <li v-for="(f, i) in detail.flavors" :key="i">{{ f }}</li>
          </ul>
        </div>

        <button class="btn" @click="detail = null">Sluit</button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import logo from '@/assets/ben-and-jerrys-logo.svg';

/* ─ Dummy data (vervang later door fetch('/orders')) ─ */
const orders = reactive([
  {
    _id: '1',
    name: 'Alice',
    address: 'Kerkstraat 10, Antwerpen',
    flavors: ['vanilla', 'chocolate', 'strawberry'],
    price: 7.5,
    status: 'te verwerken',
  },
  {
    _id: '2',
    name: 'Bob',
    address: 'Stationslaan 5, Gent',
    flavors: ['chocolate', 'chocolate', 'vanilla'],
    price: 9.0,
    status: 'verzonden',
  },
]);

const detail = ref(null);

function select(o) {
  detail.value = { ...o };
}

function remove(id) {
  const idx = orders.findIndex(o => o._id === id);
  if (idx !== -1) orders.splice(idx, 1);
}

function updateStatus(order) {
  /* TODO: PATCH /orders/:id  */
}
</script>

<style scoped>
/* — basislayout ------------------------------------------------------- */
.page   { min-height:100vh; display:flex; flex-direction:column; font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; }
.header { background:#FAB20B; color:#fff; padding:1rem 2rem; display:flex; justify-content:space-between; align-items:center; }
.brand  { display:flex; align-items:center; gap:.5rem; }
.logo   { height:50px; }
.shop-title { font-size:1.4rem; font-weight:600; }
.nav a { margin-left:1.25rem; color:#fff; text-decoration:none; font-weight:500; }
.nav a:hover { text-decoration:underline; }

/* — main & card ------------------------------------------------------- */
.main { flex:1; display:flex; justify-content:center; padding:2rem; }
.admin-card { width:760px; background:#fff; border-radius:1.5rem; padding:2rem 2.25rem; box-shadow:0 4px 20px rgba(0,0,0,.1); }
.admin-card h2 { font-size:1.6rem; margin-bottom:1.25rem; }

/* — table ------------------------------------------------------------- */
.order-table { width:100%; border-collapse:collapse; }
.order-table th, .order-table td { padding:.75rem; border-bottom:1px solid #e3e3e3; text-align:left; }
.order-table th { background:#fafafa; font-weight:600; }
.order-table select { padding:.35rem .6rem; border:1px solid #ccc; border-radius:.4rem; }
.clickable { cursor:pointer; color:#0077c8; }
.clickable:hover { text-decoration:underline; }
.del-btn { background:none; border:none; cursor:pointer; font-size:1.1rem; }
.empty { text-align:center; padding:2rem 0; color:#777; }

/* — buttons ----------------------------------------------------------- */
.btn { margin-top:1.5rem; width:100%; padding:.9rem 1rem; background:#FAB20B; color:#fff; border:none; border-radius:.7rem; font-size:1.05rem; font-weight:600; cursor:pointer; }
.btn:hover { background:#d0960f; }

/* — slideover --------------------------------------------------------- */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; justify-content:flex-end; }
.slideover { width:300px; max-width:100%; height:100%; background:#fff; padding:2rem; box-shadow:-4px 0 20px rgba(0,0,0,.2); display:flex; flex-direction:column; gap:.8rem; }
.slideover h3 { font-size:1.4rem; margin-bottom:.5rem; }

/* — smaken lijst ------------------------------------------------------ */
.flavor-list { margin:.5rem 0 1rem; }
.flavor-list ul { margin-left:1rem; }
</style>