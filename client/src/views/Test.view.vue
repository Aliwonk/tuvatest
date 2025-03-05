<template>
  <Header />
  <main>
    <div v-if="finishedTest">
      <div class="test">
        <div
          class="questions"
          v-for="(result, index) in result"
          :key="result.question.id"
        >
          <div class="question-text">
            <p style="margin-right: 5px">{{ index + 1 }}.</p>
            <span :style="result.correct ? 'color: green' : 'color: red'">
              {{ result.question.text }}
            </span>
          </div>
          <div
            class="options"
            v-if="result.question.type == 'ONE_TO_ONE'"
            v-for="option in result.question.options"
          >
            <label>{{ option.text }} {{ option.correct }}</label>
          </div>
        </div>
      </div>
      <button id="btn-restart" @click="() => reloadPage()">Заново</button>
    </div>
    <div v-else>
      <div v-if="questions.length > 0" class="test">
        <div
          class="questions"
          v-for="(question, index) in questions"
          :key="question.id"
        >
          <div class="question-text">
            <p style="margin-right: 5px">{{ index + 1 }}.</p>
            <span>
              {{ question.text }}
            </span>
            <span style="margin-left: 5px"
              >Вес: {{ question.rating }} Сложность:
              {{ question.difficulty }}</span
            >
          </div>
          <div
            class="options"
            v-if="question.type == 'ONE_TO_ONE'"
            v-for="option in question.options"
          >
            <input
              type="radio"
              :name="question.id"
              :id="option.id"
              @change="addOption(question.id, option.id)"
            />
            <label>{{ option.text }} {{ option.correct }}</label>
          </div>
        </div>
        <div class="test-buttons">
          <button id="btn-doubt" @click="clickFinishTest('doubt')">
            Сомневаюсь
          </button>
          <button id="btn-sure" @click="clickFinishTest('sure')">Уверен</button>
        </div>
      </div>
      <div v-else>Вопросы не найдены</div>
    </div>
  </main>
</template>

<script setup>
import Header from "@/components/Header.vue";
import { API_SERVER } from "@/constants/API_SERVER.constants";
import { getCookie } from "@/utils/cookie";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const token = getCookie("tkn");
const questions = ref([]);
const test = ref([]);
const answer = ref([]);
let finishedTest = ref(false);
const result = ref([]);

watchEffect(async () => {
  const headers = () => {
    if (token)
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

    return {
      "Content-Type": "application/json",
    };
  };

  const response = await fetch(API_SERVER.TEST.TRAIN, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      params: {
        subjects:
          route.query.subjects && route.query.subjects.length > 0
            ? route.query.subjects
            : null,
      },
    }),
  });
  const data = await response.json();
  const { statusCode } = data;
  if (statusCode == 200) {
    questions.value = data.questions;
  }
});

function clickFinishTest(type) {
  if (test.value.length < questions.value.length)
    return alert("Нужно ответить на все вопросы");

  const headers = () => {
    if (token)
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

    return {
      "Content-Type": "application/json",
    };
  };
  fetch(API_SERVER.TEST.TRAIN_FINISH, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      finish: type,
      answer: answer.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      result.value = data.result;
      finishedTest.value = true;
    });
}

function reloadPage() {
  window.location.reload();
}

function addOption(idQuestion, idOption) {
  test.value.push({
    question: idQuestion,
    option: idOption,
  });

  const uniqueArr = Array.from(
    new Map(test.value.map((obj) => [obj.question, obj])).values()
  );
  answer.value = uniqueArr;
}
</script>

<style>
main {
  padding-top: 70px;
}
.test {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
}

.questions {
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  padding: 5px;
  margin-bottom: 10px;
}

.question-text {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.question-text > span {
  color: #000080;
  font-weight: 600;
}

.options {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  height: auto;
  padding: 5px;
  margin-left: 5px;
  margin-top: 5px;
}

.options > input {
  margin-right: 5px;
}

.test-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70px;
}

.test-buttons button {
  width: 100px;
  height: 40px;
  margin-right: 15px;
  border: none;
  border-radius: 5px;
}

.test-buttons button:hover {
  opacity: 0.5;
  cursor: pointer;
}

#btn-sure {
  background-color: green;
  color: white;
}

#btn-doubt {
  background-color: yellow;
}

#btn-restart{
  padding: 15px;
  background-color: "blue";
}

#btn-restart:hover {
  cursor: pointer;
}
</style>
