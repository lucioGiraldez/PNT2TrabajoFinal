<template>
  <H1>ESTAMOS APRENDIENDO VUE.JS</H1>
  <h2></h2>
  <h2>{{ contador }}</h2>
  <button @click="incrementar">+</button>
  <button @click="decrementar">-</button>
</template>

<script setup>
import { ref } from 'vue'; //ref es para crear una variable reactiva
let contador = ref(0)

const incrementar = () => {
  contador.value++
}


const decrementar = () => {
  contador.value--
}
</script>

<style scoped>
h2{
  color: aqua;
}
</style>