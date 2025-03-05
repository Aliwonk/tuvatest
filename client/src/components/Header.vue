<template>
  <header>
    <div class="logo">
      <router-link to="/">TUVATEST</router-link>
    </div>
    <div class="menu">
      <router-link v-if="token" to="profile" class="item-menu">ПРОФИЛЬ</router-link>
      <router-link v-else to="login" class="item-menu">ВОЙТИ</router-link>
    </div>
  </header>
</template>

<script setup>
import { getCookie } from "@/utils/cookie";

const token = getCookie("tkn");
</script>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 99.5%;
  height: 55px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
}

.logo {
  font-size: 1.7rem;
}

.menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  height: auto;
}

.item-menu {
  border: 1px solid black;
  border-radius: 5px;
  margin-right: 5px;
  margin-left: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  transition: 0.2s;
}

.item-menu:hover{
  color: white;
  background-color: black;
}
</style>
