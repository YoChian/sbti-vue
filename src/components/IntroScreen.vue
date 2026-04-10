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

<style scoped>
.screen {
  display: block;
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.hero {
  padding: 28px;
  margin-top: 20px;
  overflow: hidden;
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  right: -60px;
  top: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(127, 165, 134, 0.18), rgba(127, 165, 134, 0.02));
  pointer-events: none;
}

.hero-minimal {
  min-height: 48vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 42px 20px;
}

.hero-minimal::after {
  display: none;
}

.hero-minimal h1 {
  max-width: none;
  margin: 0;
  font-size: clamp(28px, 5vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.hero-actions-single {
  justify-content: center;
  margin-top: 28px;
}

button {
  border: 0;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;
  font: inherit;
}

button:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--accent-strong);
  color: #fff;
  padding: 14px 20px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(77, 106, 83, 0.18);
  font-weight: 700;
}

@media (max-width: 600px) {
  .hero {
    padding: 16px;
  }

  .hero-minimal h1 {
    font-size: 32px;
  }
}
</style>
