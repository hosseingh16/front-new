<template>
  <div>
    <form action="" @submit.prevent="handleLogin">
      <h1>Login Page</h1>
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>

    <button type="button" @click="getPing">get OK</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  //middleware: "sanctum:guest",
});

const formData = ref({
  email: "",
  password: "",
});

const { login } = useSanctumAuth();
const config = useRuntimeConfig();
const client = useSanctumClient();

const api = useApi()

const getPing = async () => {
 const result = await api.get<string>('/ping')
  //console.log(text)
};


const handleLogin = async () => {
  await login({
    username: '09020077714',    
  });
};
</script>

<style scoped></style>
