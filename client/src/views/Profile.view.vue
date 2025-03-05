<template>
  <header>
    <div class="caption">Профиль</div>
    <div v-if="!token">
      <router-link to="login">Войти</router-link>
    </div>
    <div v-else class="badge">
      <div id="fullname">
        {{ userData.surname }} {{ userData.name }} {{ userData.patronimyc }}
      </div>
      <div id="balance">{{ userData.balance }} {{ userData.currency }}</div>
    </div>
  </header>
  <main>
    <form v-if="token">
      <div class="item-form" style="flex-direction: column">
        <label for="wallet">Сумма пополнения</label>
        <input
          id="wallet"
          type="number"
          v-model="amount"
          placeholder="Введите сумму"
        />
      </div>
      <div class="buttons-form">
        <button @click="replenishWallet">Пополнить</button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { getCookie } from "@/utils/cookie";
import { API_SERVER } from "@/constants/API_SERVER.constants";

const token = getCookie("tkn");
const userData = ref({
  surname: "",
  name: "",
  patronimyc: "",
  balance: 0,
  currency: "",
});
const amount = ref(0);

if (token) {
  fetch(API_SERVER.PROFILE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((resData) => {
      const { statusCode, data } = resData;
      switch (statusCode) {
        case 200:
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              userData.value[key] = data[key];
            }
          }
          break;

        default:
          break;
      }
    });
}

function replenishWallet(event) {
  event.preventDefault();
  if (amount.value > 0) {
    fetch(API_SERVER.PAY.WALLET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: {
          value: amount.value,
          currency: "RUB",
        },
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        const { statusCode, redirect } = resData;

        if (statusCode == 301) {
          document.location.href = redirect.url;
        }
      });
  }
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: auto;
  height: 60px;
  padding-left: 15px;
  padding-right: 15px;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
