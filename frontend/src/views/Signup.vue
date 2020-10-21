<template>
  <div>
    <h1>Sign Up</h1>
    <div class="progress" v-if="signingUp">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: 100%"
      ></div>
    </div>

    <form v-if="!signingUp" @submit.prevent="signup">
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
          v-model="user.username"
          type="text"
          class="form-control"
          placeholder="Username"
          required
        />
        <small id="username" class="form-text text-muted"
          >Username must be longer than 2 chars and less than 30, Username can
          only contain alphanumeric and ' _ ' chars
        </small>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
          <small id="passHelp" class="form-text text-muted"
            >Passwrod must be longer than 10 chars
          </small>
        </div>
        <div class="form-group col-md-6">
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm Password"
            required
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Signup</button>
    </form>
  </div>
</template>

<script>
import Joi from "joi";
const signup_url = "http://localhost:3000/auth/signup";
const schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
  confirmPassword: Joi.string()
    .trim()
    .min(10)
    .required(),
});

export default {
  data: () => ({
    signingUp: false,
    errorMessage: "",
    user: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
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
    signup() {
      this.errorMessage = "";
      if (this.isValidUser()) {
        const body = {
          email: this.user.email,
          username: this.user.username,
          password: this.user.password,
        };

        this.signingUp = true;
        fetch(signup_url, {
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
          .then(() => {
            setTimeout(() => {
              this.signingUp = false;
              this.$router.push("/login");
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.signingUp = false;
              this.errorMessage = error.message;
            }, 1000);
          });
      }
    },
    isValidUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = " Password does not match! 😭";
        return false;
      }

      const result = schema.validate(this.user);
      if (result.error === undefined) {
        return true;
      }
      if (result.error.message.includes("username")) {
        this.errorMessage = " Username is not valid! 😭";
      } else if (result.error.message.includes("email")) {
        this.errorMessage = " email should be valid! 😭";
      } else if (result.error.message.includes("password")) {
        this.errorMessage = " password is not valid 😭";
      }
      return false;
    },
  },
};
</script>

<style></style>
