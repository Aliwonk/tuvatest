<template>
    <div class="container">
        <form name="login">
            <div class="caption-form">Авторизация</div>
            <div class="item-form">
                <label for="login">Логин</label>
                <input type="email" id="login" v-model="userData.login" placeholder="Введите логин" />
            </div>
            <div class="item-form">
                <label for="password">Пароль</label>
                <input type="password" id="password" v-model="userData.password" placeholder="Введите пароль" />
            </div>
            <div class="buttons-form">
                <button @click="login">Войти</button>
                <router-link to="/registration">Зарегистрироваться</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { API_SERVER } from '@/constants/API_SERVER.constants';
import router from '@/router';
import { setCookie } from '@/utils/cookie';
import { ref } from 'vue';

const userData = ref({
    login: "",
    password: "",
});

function login(event) {
    event.preventDefault();
    fetch(API_SERVER.AUTH.LOGIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData.value),
    })
    .then((res) => res.json())
    .then((resData) => {
        const { statusCode, data, message } = resData;

        switch (statusCode) {
            case 200:
                setCookie("tkn", data.token, data.exp);
                router.push("/");
                break;

            default:
                alert(message);
                break;
        }
    });
}
</script>

<style scoped>
.container {
    justify-content: center;
}

form{
    width: 320px;
}
</style>