<template>
  <div class="shell">
    <section v-if="!isQuestionDataReady" class="screen active">
      <div class="hero card hero-minimal">
        <h1>{{ loadError ? '题库加载失败' : '正在载入题库…' }}</h1>
        <p v-if="loadError" class="sub" style="margin-top: 16px; max-width: 680px;">
          {{ loadError }}
        </p>
        <div v-else class="sub" style="margin-top: 16px; max-width: 680px;">
          题库会优先加载，结果库与图片素材会在后台继续准备。
        </div>
      </div>
    </section>

    <IntroScreen
      v-else-if="screen === 'intro'"
      @start="startTest"
    />

    <TestScreen
      v-else-if="screen === 'test'"
      :questions="visibleQuestions"
      :answers="answers"
      :progress="progress"
      :is-result-data-ready="isResultDataReady"
      :is-submitting="isSubmitting"
      :get-question-meta-label="getQuestionMetaLabel"
      @back="goIntro"
      @select="selectAnswer"
      @submit="submitTest"
    />

    <ResultScreen
      v-else-if="screen === 'result' && result"
      :result="result"
      @restart="restartTest"
      @home="goIntro"
    />
  </div>
</template>

<script setup>
import IntroScreen from './components/IntroScreen.vue';
import ResultScreen from './components/ResultScreen.vue';
import TestScreen from './components/TestScreen.vue';
import { useSbtiTest } from './composables/useSbtiTest';

const {
  screen,
  isQuestionDataReady,
  isResultDataReady,
  isSubmitting,
  loadError,
  answers,
  visibleQuestions,
  progress,
  result,
  getQuestionMetaLabel,
  startTest,
  selectAnswer,
  submitTest,
  restartTest,
  goIntro,
} = useSbtiTest();
</script>

<style scoped>
.shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px 56px;
}

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

.hero h1 {
  font-size: clamp(28px, 5vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  max-width: 680px;
}

.hero-minimal h1 {
  max-width: none;
}

.sub {
  margin-top: 14px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.75;
  max-width: 720px;
}

@media (max-width: 600px) {
  .shell {
    padding: 14px 12px 42px;
  }

  .hero {
    padding: 16px;
  }

  .hero h1 {
    font-size: 32px;
  }
}
</style>
