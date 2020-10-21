<template>
  <div>
    <h1>Login Page</h1>
    <div class="progress" v-if="loggingIn">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: 100%"
      ></div>
    </div>

    <form v-if="!loggingIn" @submit.prevent="login">
      <div v-if="errorMessage" class="alert alert-dismissible alert-danger">
        {{ errorMessage }}
      </div>
      <div class="form-group">
        <input
          v-model="user.email"
          type="email"
          class="form-control"
          placeholder="Email Adress"
          required
        />
        <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small
        >
      </div>

      <div class="form-group">
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
const login_url = "http://localhost:3000/auth/login";

import Joi from "joi";
const schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

export default {
  data: () => ({
    user: { email: "", password: "" },
    errorMessage: "",
    loggingIn: false,
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = "";
      },
      deep: true,
    },
  },
  methods: {
    login() {
      this.errorMessage = "";
      if (this.validateUser()) {
        const body = {
          email: this.user.email,
          password: this.user.password,
        };

        this.loggingIn = true;
        fetch(login_url, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "content-type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) return response.json();

            return response.json().then((error) => {
              throw new Error(error.message);
            });
          })
          .then((result) => {
            console.log(result);
            setTimeout(() => {
              this.loggingIn = false;
              this.$router.push("/notes");
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.loggingIn = false;
              this.errorMessage = error.message;
            }, 1000);
          });
      }
    },
    validateUser() {
      const result = schema.validate(this.user);
      if (result.error === undefined) return true;
      if (result.error.message.includes("email"))
        this.errorMessage = " email should be valid! 😭";
      else if (result.error.message.includes("password"))
        this.errorMessage = " password is not valid 😭";

      return false;
    },
  },
};
</script>

<style></style>
