<template>
  <router-view />
</template>

<style>
/* ПОДКЛЮЧЕНИЕ ШРИФТОВ */

/* @import url("https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200..700&display=swap");

* {
  padding: 0;
  margin: 0;
  font-family: "Yanone Kaffeesatz", serif;
  font-optical-sizing: auto;
  font-style: normal;
}

/* ГЛОБАЛЬНЫЙ СТИЛЬ ДЛЯ БЛОКОВ */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

a {
  color: black;
  text-decoration: none;
}

/* ГЛОБАЛЬНЫЙ СТИЛЬ ДЛЯ ФОРМ */

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.caption-form {
  width: 100%;
  height: auto;
  padding: 5px;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
}

.item-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-bottom: 5px;
}

.item-form input {
  height: 70%;
  outline: none;
  padding-left: 5px;
  border: 0.5px solid grey;
  border-radius: 5px;
}

.buttons-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>
