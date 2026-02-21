<template>
  <div>
    <form action="" @submit.prevent="handleLogin">
      <h1>Login Page</h1>
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "sanctum:guest",
});

const formData = ref({
  email: "",
  password: "",
});
const handleLogin = (e) => {
  console.log("login submit");
};
</script>

<style scoped></style>
