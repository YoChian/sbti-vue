<template>
  <section class="screen active">
    <div class="hero card hero-minimal">
      <h1>MBTI已经过时，SBTI来了。</h1>
      <div class="hero-actions hero-actions-single">
        <button class="btn-primary" @click="$emit('start')">开始测试</button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['start']);
</script>
