<script setup>
import MainView from './views/MainView.vue';
import Contador from './components/Contador.vue';
import ListaTareas from './components/ListaTareas.vue';
</script>

<template>
<h1>ESTAMOS EN APP.VUE</h1>
<div>
    <nav>
      <RouterLink to ="/task">Ver Tareas</RouterLink>
      <RouterLink to ="/newTask">Agregar Tarea</RouterLink>

      <!-- <MainView></MainView>       -->
    </nav>
    <!-- ESTE ES EL COMPONENTE QUE FALTABA PARA MOSTRAR LOS ROUTERLINK -->
    <RouterView />
  </div>
</template>



<style scoped>

</style>
