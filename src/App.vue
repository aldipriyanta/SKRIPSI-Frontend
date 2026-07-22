<template>
  <router-view />
  <CompanyFooter v-if="!route.path.startsWith('/admin')" />
  <ChatbotWidget v-if="!route.path.startsWith('/admin')" />
</template>

<script setup>
import { useRoute } from 'vue-router';
import ChatbotWidget from './components/ChatbotWidget.vue';
import CompanyFooter from './components/CompanyFooter.vue';

const route = useRoute();
</script>