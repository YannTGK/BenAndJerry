<template>
  <div class="page">
    <!-- ▸ Header -->
    <header class="header">
      <div class="brand">
        <span class="shop-title">Ben & Jerry's</span>
        <img :src="logo" alt="Ben & Jerry’s logo" class="logo" />
      </div>

      <nav class="nav">
        <RouterLink to="/" class="active">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>

    <!-- ▸ Main -->
    <main class="main">
      <model-viewer
        src="/models/Popsicle.glb"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        class="viewer"
      />

      <section class="customizer">
        <h2>Stel je ijsje samen</h2>

        <!-- Smaken (3 delen) -->
        <div v-for="(flavor, i) in flavors" :key="i" class="form-group">
          <span>Smaak {{ i + 1 }}</span>
          <select v-model="flavors[i]">
            <option v-for="opt in flavorOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }} (+€{{ opt.price }})
            </option>
          </select>
        </div>

        <!-- Gegevens klant -->
        <div class="form-group">
          <span>Naam</span>
          <input v-model="customer.name" placeholder="Voornaam Achternaam" />
        </div>

        <div class="form-group">
          <span>Adres</span>
          <input v-model="customer.address" placeholder="Straat 12, Stad" />
        </div>

        <!-- Totaal -->
        <div class="total">
          <span>Totaal</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>

        <button class="btn" @click="placeOrder">Bestel</button>
      </section>
    </main>

    <!-- ▸ Pop-up ------------------------------------------------------ -->
    <div v-if="showPopup" class="overlay">
      <div class="popup">
        <h3>Bedankt voor je bestelling, {{ customer.name }}!</h3>
        <p>We bezorgen je ijsje op:</p>
        <p><strong>{{ customer.address }}</strong></p>
        <p><strong>Totaal:</strong> €{{ total.toFixed(2) }}</p>
        <button class="btn" @click="showPopup = false">Sluiten</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@google/model-viewer';
import { ref, computed } from 'vue';
import logo from '@/assets/ben-and-jerrys-logo.svg';

/* – smaken – */
const flavors = ref(['vanilla', 'vanilla', 'vanilla']);
const flavorOptions = [
  { value: 'vanilla',    label: 'Vanille',   price: 1.0 },
  { value: 'strawberry', label: 'Aardbei',   price: 1.2 },
  { value: 'chocolate',  label: 'Chocolade', price: 1.3 },
];

/* – klantgegevens – */
const customer = ref({ name: '', address: '' });

/* – totaalprijs – */
const total = computed(() =>
  flavors.value.reduce(
    (sum, f) => sum + flavorOptions.find(o => o.value === f).price,
    0
  )
);

const showPopup = ref(false);

function placeOrder() {
  if (!customer.value.name || !customer.value.address) {
    alert('Gelieve naam en adres in te vullen.');
    return;
  }
  console.table({ ...customer.value, flavors: [...flavors.value], total: total.value });
  showPopup.value = true;
}
</script>

<style scoped>
/* basislayout & shared styles – unchanged behalve input-styling toegevoegd */
.page   { min-height:100vh; display:flex; flex-direction:column; font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; }
.header { background:#FAB20B; color:#fff; padding:1rem 2rem; display:flex; justify-content:space-between; align-items:center; }
.brand  { display:flex; align-items:center; gap:.5rem; }
.logo   { height:50px; }
.shop-title { font-size:1.4rem; font-weight:600; }
.nav a { margin-left:1.25rem; color:#fff; text-decoration:none; font-weight:500; }
.nav a.active, .nav a:hover { text-decoration:underline; }

.main { flex:1; display:flex; flex-wrap:wrap; gap:2rem; padding:2rem; align-items:flex-start; justify-content:center; }
.viewer { width:500px; height:500px; border-radius:1rem; box-shadow:0 4px 20px rgba(0,0,0,.15); background:#fff; }
.customizer { width:320px; background:#fff; border-radius:1.5rem; padding:2rem; box-shadow:0 4px 20px rgba(0,0,0,.1); }
.customizer h2 { margin-bottom:1.25rem; font-size:1.5rem; }

.form-group { margin-bottom:1rem; display:flex; flex-direction:column; gap:.35rem; }
.form-group select,
.form-group input { padding:.6rem .8rem; border:1px solid #d6d6d6; border-radius:.6rem; font-size:1rem; }

.total { display:flex; justify-content:space-between; font-weight:700; font-size:1.2rem; margin:1rem 0; }

.btn { width:100%; padding:.9rem 1rem; background:#FAB20B; color:#fff; border:none; border-radius:.7rem; font-size:1.05rem; font-weight:600; cursor:pointer; text-align:center; }
.btn:hover { background:#d0960f; }

/* pop-up */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; justify-content:center; align-items:center; z-index:1000; }
.popup   { background:#fff; padding:2rem 2.5rem; border-radius:1rem; box-shadow:0 6px 24px rgba(0,0,0,.2); text-align:center; width:300px; }
.popup h3 { margin-bottom:1rem; font-size:1.4rem; }
.popup p  { margin-bottom:1rem; }
.popup .btn { width:auto; }
</style>