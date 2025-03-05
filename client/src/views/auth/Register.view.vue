<template>
    <div class="container">
        <form name="login">
            <div class="caption-form">Регистрация</div>
            <div class="item-form">
                <label for="surname">Фамилия</label>
                <input type="text" id="surname" v-model="userData.surname" placeholder="Введите фамилию" />
            </div>
            <div class="item-form">
                <label for="name">Имя</label>
                <input type="text" id="name" v-model="userData.name" placeholder="Введите имя" />
            </div>
            <div class="item-form">
                <label for="patronimyc">Отчество</label>
                <input type="text" id="patronimyc" v-model="userData.patronimyc" placeholder="Введите отчество" />
            </div>
            <div class="item-form">
                <label for="number_phone">Номер телефона</label>
                <input type="number" id="number_phone" v-model="userData.number_phone" placeholder="Введите номер телефона" />
            </div>
            <div class="item-form">
                <label for="email">Эл. почта</label>
                <input type="email" id="email" v-model="userData.email" placeholder="example@mail.com">
            </div>
            <div class="item-form">
                <label for="password">Пароль</label>
                <input type="text" id="password" v-model="userData.password" placeholder="Введите пароль">
            </div>
            <div class="buttons-form">
                <button @click="registration">Зарегистрироваться</button>
                <router-link to="/login">Войти</router-link>
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
    surname: "",
    name: "",
    patronimyc: "",
    number_phone: "",
    email: "",
    password: "",
});

function registration(event) {
    event.preventDefault();
    fetch(API_SERVER.AUTH.REGISTRATION, {
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
            case 201:
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
    width: 350px;
}
</style>


