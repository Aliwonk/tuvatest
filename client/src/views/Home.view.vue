<template>
  <Header />
  <main>
    <div style="margin-bottom: 10px;">Выберите темы вопросов</div>
    <div class="list-subjects">
      <div class="subject" v-for="subject in subjects" @click="(event) => {clickSubject(subject, event)}">
        <p>{{ subject.name }}</p>
      </div>
    </div>
    <div id="btn-train" to="test-train" @click="() => {clickTrain()}">ТРЕНИРОВАТЬСЯ</div>
  </main>
</template> 

<script setup>
import Header from "@/components/Header.vue";
import { API_SERVER } from "@/constants/API_SERVER.constants";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const subjects = ref([]);
const selectedSubject = [];

watchEffect(async () => {
  const response = await fetch(API_SERVER.QUESTION.SUBJECT.ALL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });
  const data = await response.json();
  const { statusCode } = data;
  if (statusCode == 200) {
    subjects.value = data.subjects;
  }
});


function clickSubject(subject, event) {
  const already = selectedSubject.findIndex((value) => value == subject.id);
  
  if(already != -1) {
    selectedSubject.splice(already);
    event.currentTarget.classList.remove("subject-clicked");
  } else {
    selectedSubject.push(subject.id);
    event.currentTarget.classList.add("subject-clicked");
  }
}

function clickTrain() {
  router.push({ name: "test-train", query: { subjects: selectedSubject } });
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 93vh;
  padding-top: 65px;
}

#btn-train {
  padding: 10px;
  background-color: aquamarine;
  border-radius: 5px;
}

#btn-train:hover {
  background-color: black;
  color: white;
  cursor: pointer;
}

.navbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.list-subjects{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  height: auto;
  margin-bottom: 10px;
}

.subject {
  width: auto;
  height: auto;
  padding: 7px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid black;
}

.subject:hover {
  /* background-color: grey; */
  cursor: pointer;
  border: none;
}

.subject-clicked {
  background-color: black;
  color: white;
}
</style>
