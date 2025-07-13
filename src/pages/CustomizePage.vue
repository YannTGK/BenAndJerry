<template>
  <div class="page">
    <!-- ▸ Header -->
    <header class="header">
      <div class="brand">
        <img :src="logo" alt="Ben & Jerry’s logo" class="logo" />
        <span class="shop-title">Peace, Love & Ice Cream</span>
      </div>

      <nav class="nav">
        <RouterLink to="/" class="active">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>

    <!-- ▸ Main -->
    <main class="main">
      <model-viewer
        ref="viewerRef"
        src="/models/Popsicle2.glb"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        class="viewer"
      />

      <section class="customizer">
        <h2>Stel je ijsje samen</h2>

        <!-- IJslaag (paarse laag) -->
        <div class="form-group">
          <span>Ijsjes Smaak</span>
          <select v-model="toppingFlavor">
            <option v-for="opt in flavorOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }} (+€{{ opt.price }})
            </option>
          </select>
        </div>

        <!-- Topping (bruine laag) -->
        <div class="form-group">
          <span>Topping Smaak</span>
          <select v-model="iceFlavor">
            <option v-for="opt in flavorOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }} (+€{{ opt.price }})
            </option>
          </select>
        </div>

        <!-- Klantgegevens -->
        <div class="form-group">
          <span>Naam</span>
          <input v-model="customer.name" placeholder="Voornaam Achternaam" />
          <small v-if="errors.name" class="error">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <span>Adres</span>
          <input v-model="customer.address" placeholder="Straat 12, Stad" />
          <small v-if="errors.address" class="error">{{ errors.address }}</small>
        </div>

        <!-- Totaal -->
        <div class="total">
          <span>Totaal</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>

        <button class="btn" @click="placeOrder">Bestel</button>
      </section>
    </main>

    <!-- ▸ Pop-up -->
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
import { ref, computed, onMounted, watch } from 'vue';
import logo from '@/assets/ben-and-jerrys-logo.svg';
import { createOrder } from '@/api';

/* — opties — */
const flavorOptions = [
  { value: 'vanilla',    label: 'Vanille',   price: 1.0 },
  { value: 'strawberry', label: 'Aardbei',   price: 1.2 },
  { value: 'chocolate',  label: 'Chocolade', price: 1.3 },
];

/* — smaken — */
const toppingFlavor = ref('vanilla');     // paarse laag (purpleLight)
const iceFlavor     = ref('chocolate');   // bruine laag (brownDark)

/* — prijs — */
const total = computed(() =>
  [toppingFlavor.value, iceFlavor.value].reduce(
    (sum, f) => sum + flavorOptions.find(o => o.value === f).price,
    0,
  ),
);

/* — klant & validatie — */
const customer = ref({ name: '', address: '' });
const errors   = ref({ name: '', address: '' });

/* — pop-up — */
const showPopup = ref(false);
async function placeOrder() {
  errors.value = { name: '', address: '' };
  if (!customer.value.name)    errors.value.name    = 'Naam is verplicht';
  if (!customer.value.address) errors.value.address = 'Adres is verplicht';
  if (errors.value.name || errors.value.address) return;

  const payload = {
    customerName:  customer.value.name,
    customerAddr:  customer.value.address,
    toppingFlavor: toppingFlavor.value,
    iceFlavor:     iceFlavor.value,
    total:         total.value,
  };

  try {
    await createOrder(payload);          // ← call Render-API
    showPopup.value = true;              // success-popup
  } catch (err) {
    console.error(err);
    errors.value.general = 'Server fout, probeer later opnieuw.';
  }
}

/* — model-viewer kleuren — */
const viewerRef = ref(null);
const flavorColors = {
  vanilla:    [1.0, 1.0, 1.0, 1],   // wit
  strawberry: [1.0, 0.41, 0.79, 1], // roze
  chocolate:  [0.6, 0.22, 0.11, 1], // bruin
};

function updatePopsicleColors() {
  const mv = viewerRef.value;
  if (!mv?.model) return;

  const purpleMat = mv.model.materials.find(m => m.name === 'purpleLight');
  const brownMat  = mv.model.materials.find(m => m.name === 'brownDark');

  purpleMat?.pbrMetallicRoughness.setBaseColorFactor(
    flavorColors[toppingFlavor.value],
  );
  brownMat?.pbrMetallicRoughness.setBaseColorFactor(
    flavorColors[iceFlavor.value],
  );
}

onMounted(() => {
  viewerRef.value.addEventListener('load', updatePopsicleColors);
});
watch([toppingFlavor, iceFlavor], updatePopsicleColors, { immediate: true });
</script>

<style scoped>
/* — layout & stijl — (grotendeels ongewijzigd) */
.page     { min-height: 100vh; display: flex; flex-direction: column; font-family: Arial, Helvetica, sans-serif; background: #f7f7f7; }
.header   { background: #FAB20B; color: #fff; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.brand    { display: flex; align-items: center; gap: .5rem; }
.logo     { height: 50px; }
.shop-title { font-size: 1.4rem; font-weight: 600; }
.nav a    { margin-left: 1.25rem; color: #fff; text-decoration: none; font-weight: 500; }
.nav a.active, .nav a:hover { text-decoration: underline; }

.main       { flex: 1; display: flex; flex-wrap: wrap; gap: 2rem; padding: 2rem; align-items: flex-start; justify-content: center; }
.viewer     { width: 550px; height: 550px; border-radius: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,.15); background: #fff; }
.customizer { width: 320px; background: #fff; border-radius: 1.5rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
.customizer h2 { margin-bottom: 1.25rem; font-size: 1.5rem; }

.form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: .4rem; }
.form-group select,
.form-group input { padding: .6rem .8rem; border: 1px solid #d6d6d6; border-radius: .6rem; font-size: 1rem; }

.error { color: #d33434; font-size: .85rem; }

.total    { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem; margin: 1rem 0; }

.btn      { width: 100%; padding: .9rem 1rem; background: #FAB20B; color: #fff; border: none; border-radius: .7rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }
.btn:hover { background: #d0960f; }

.overlay  { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.popup    { background: #fff; padding: 2rem 2.5rem; border-radius: 1rem; box-shadow: 0 6px 24px rgba(0,0,0,.2); text-align: center; width: 300px; }
.popup h3 { margin-bottom: 1rem; font-size: 1.4rem; }
.popup p  { margin-bottom: 1rem; }
.popup .btn { width: auto; }
</style>