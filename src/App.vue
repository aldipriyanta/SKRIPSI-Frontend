<template>
  <router-view />
  <company-footer />
  <ChatbotWidget />
</template>

<script setup>
import ChatbotWidget from './components/ChatbotWidget.vue';
import CompanyFooter from './components/CompanyFooter.vue';
</script>