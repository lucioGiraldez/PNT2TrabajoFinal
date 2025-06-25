
<template>
  <div class="container">
    <h1>Mis Tareas</h1>
    <div class="card" v-for="tarea in tareas" :key="tarea.id">
      <h2>{{ tarea.titulo }}</h2>
      <p>{{ tarea.descripcion }}</p>
      <button class="button" @click="editarTarea(tarea.id)">Editar</button>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';


</script>

<style>
.container{
    display: flex;
}

.content{
    flex: 1;
    padding: 20px;
}

</style>