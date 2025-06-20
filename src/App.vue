<script setup>
import MainView from './views/MainView.vue';
import Contador from './components/Contador.vue';
import ListaTareas from './components/ListaTareas.vue';
</script>

<template>
<h1>ESTAMOS EN APP.VUE
  aguante la falopa!!!
</h1>
<div>
    <nav>
      <RouterLink to ="/">Tareas</RouterLink>
      <RouterLink to ="/taskView">Ver Tareas</RouterLink>

      <MainView></MainView>      
    </nav>
    
  </div>
</template>



<style scoped>

</style>
