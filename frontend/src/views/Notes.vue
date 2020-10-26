<template>
  <div>
    <h1>Hello, {{ user.email }}</h1>
    <button @click="logout()" class="btn btn-danger">Logout</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
  }),

  mounted() {
    const API_URL = "http://localhost:3000";
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.user) this.user = result.user;
        else {
          localStorage.removeItem("token");
          this.$router.push("/login");
        }
      });
  },

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
