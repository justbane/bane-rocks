<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <h1>Bane Rocks E-commerce</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
    </div>
    <p>
      Edit <code>src/App.vue</code> to get started.
    </p>
  </div>
</template>

<style scoped>
.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
