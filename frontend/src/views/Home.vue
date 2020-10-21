<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Auth From Scratch</h1>
      <p class="lead">
        JWT-based Authentication to a MEVN Stack Application
      </p>
      <hr class="my-4" />
      <p>
        Implementing Auth is fun 🔐
      </p>
      <p class="lead">
        <router-link
          class="btn btn-primary btn-lg"
          :to="{ name: 'signup' }"
          role="button"
          >Sign Up</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>
