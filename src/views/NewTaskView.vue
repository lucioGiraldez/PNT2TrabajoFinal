<script setup>
import { ref } from 'vue';
import axios from 'axios';


</script>

<template>
<H1>AGREGAR LIBRO</H1>
<main>
    <form>
        <div>
            <label for="id">ID</label>
            <input name="id" type="text" required placeholder="ID">
            <label for="titulo">Titulo</label>
            <input name="titulo" type="text" required placeholder="Titulo">
            <label for="complete">Completada</label>
            <input name="complete" type="text" required placeholder="Completada">
            <label for="userId">ID del Usuario</label>
            <input name="userId" type="text" required placeholder="User ID">
        </div>
    </form>
</main>
</template>

<style></style>