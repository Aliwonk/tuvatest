import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.view.vue'
import LoginView from '@/views/auth/Login.view.vue';
import RegisterView from '@/views/auth/Register.view.vue';
import Header from '@/components/Header.vue';
import ProfileView from '@/views/Profile.view.vue';
import TestView from '@/views/Test.view.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Главная',
    },
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Вход',
    },
    component: LoginView,
  },
  {
    path: '/registration',
    name: 'registration',
    meta: {
      title: 'Регистрация',
    },
    component: RegisterView,
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: 'Профиль'
    },
    component: ProfileView,
  },
  {
    path: '/test-train',
    name: 'test-train',
    meta: {
      title: 'Тренировка'
    },
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) =>{
  document.title = to.meta.title;
  next();
});

export default router