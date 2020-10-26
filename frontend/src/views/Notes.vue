<template>
  <div>
    <h1>
      Hello, <span style="color: lightblue">{{ user.username }}</span>
    </h1>

    <form @submit.prevent="addNote">
      <div class="form-group">
        <label for="noteTitle">Ttile</label>
        <input
          v-model="post.title"
          type="text"
          class="form-control"
          id="noteTitle"
        />
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">Write Your Notes</label>
        <textarea
          v-model="post.text"
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
      </div>
      <button class="btn btn-warning" type="submit">Add Note</button>
    </form>

    <button @click="logout()" class="btn btn-danger">Logout</button>

    <div v-for="note in notes" :key="note.title">
      {{ note.title }}
      {{ note.text }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    notes: [],
    user: {},
    post: {
      title: "",
      text: "",
    },
  }),

  mounted() {
    const API_URL = "http://localhost:3000";
    const GET_NOTE_URL = "http://localhost:3000/api/notes";

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

    fetch(GET_NOTE_URL, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();

        return response.json().then((error) => {
          throw new Error(error.message);
        });
      })
      .then((result) => {
        this.notes = result;
        console.log(this.notes);
      });
  },

  methods: {
    addNote() {
      const NOTE_URL = "http://localhost:3000/api/notes";
      const body = {
        title: this.post.title,
        text: this.post.text,
      };
      fetch(NOTE_URL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.token}`,
        },
      });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
