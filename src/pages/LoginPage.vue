<script setup>
import { ref, onMounted } from 'vue';     
import { useRouter }      from 'vue-router';
import logo from '@/assets/ben-and-jerrys-logo.svg';

const router   = useRouter();
const email    = ref('');
const password = ref('');
const errorMsg = ref('');

const BASE       = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';
const LOGIN_URL  = `${BASE}/api/auth/login`;
const TOKEN_KEY  = 'token';

/* ▸ automatische redirect bij “actieve” token ---------------------- */
onMounted(() => {
  if (localStorage.getItem(TOKEN_KEY)) {
    router.replace('/admin');
  }
});

async function login() {
  errorMsg.value = '';

  if (!email.value || !password.value) {
    errorMsg.value = 'E-mail en wachtwoord verplicht';
    return;
  }

  try {
    const res = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (!res.ok) throw new Error(await res.text());

    const { token } = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    router.push('/admin');
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Login mislukt – controleer gegevens';
  }
}
</script>

<template>
  <div class="page">
    <!-- ▸ Header -->
    <header class="header">
      <div class="brand">
        <img :src="logo" alt="Ben & Jerry’s logo" class="logo" />
        <span class="shop-title">Peace, Love & Ice Cream</span>
      </div>

      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login" class="active">Login</RouterLink>
      </nav>
    </header>

    <!-- ▸ Main -->
    <main class="main">
      <section class="login-card">
        <h2>Admin login</h2>

        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="E-mail" required />
          <input
            v-model="password"
            type="password"
            placeholder="Wachtwoord"
            required
          />
          <button class="btn">Log in</button>
        </form>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* – basislayout ------------------------------------------------------- */
.page   { min-height:100vh; display:flex; flex-direction:column; font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; }
.header { background:#FAB20B; color:#fff; padding:1rem 2rem; display:flex; justify-content:space-between; align-items:center; }
.brand  { display:flex; align-items:center; gap:.5rem; }
.logo   { height:50px; }
.shop-title { font-size:1.4rem; font-weight:600; }
.nav a { margin-left:1.25rem; color:#fff; text-decoration:none; font-weight:500; }
.nav a.active, .nav a:hover { text-decoration:underline; }

/* – main & card ------------------------------------------------------- */
.main { flex:1; display:flex; justify-content:center; align-items:center; padding:2rem; }
.login-card { width:320px; background:#fff; border-radius:1.5rem; padding:2rem 2.25rem; box-shadow:0 4px 20px rgba(0,0,0,.1); text-align:center; }
.login-card h2 { font-size:1.6rem; margin-bottom:1.25rem; }
.login-card form { display:flex; flex-direction:column; gap:1rem; }
.login-card input { padding:.65rem .9rem; border:1px solid #d6d6d6; border-radius:.6rem; font-size:1rem; }
.hint { margin-top:1rem; font-size:.9rem; color:#666; }

/* – button ------------------------------------------------------------ */
.btn { width:100%; padding:.9rem 1rem; background:#FAB20B; color:#fff; border:none; border-radius:.7rem; font-size:1.05rem; font-weight:600; cursor:pointer; }
.btn:hover { background:#d0960f; }
</style>