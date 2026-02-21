<template>
  <div>
    <form action="" @submit.prevent="handleRegister">
      <h1>Register Page</h1>
      <input type="text" placeholder="name" v-model="formData.name" />
      <input type="email" placeholder="email" v-model="formData.email" />
      <input
        type="password"
        placeholder="password"
        v-model="formData.password"
      />
      <input
        type="password"
        placeholder="password"
        v-model="formData.password_confirmation"
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "sanctum:guest",
});

const formData = ref({
  email: "",
  name: "",
  password: "",
  password_confirmation: "",
});

const { login } = useSanctumAuth();
const config = useRuntimeConfig();
const client = useSanctumClient();

const handleRegister = async () => {
  const { data } = await client(`${config.public.apiBase}/register`, {
    method: "POST",
    body: formData.value, // ✅ بدون stringify
    headers: { Accept: "application/json" },
  });

  // await login({
  //   email: formData.value.email,
  //   password: formData.value.password,
  // });
};
</script>

<style scoped></style>
