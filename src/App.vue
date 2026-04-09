<template>
  <div class="shell">
    <section v-if="!isReady" class="screen active">
      <div class="hero card hero-minimal">
        <h1>{{ loadError ? '原型数据加载失败' : '正在载入题库与人格库…' }}</h1>
        <p v-if="loadError" class="sub" style="margin-top: 16px; max-width: 680px;">
          {{ loadError }}
        </p>
        <div v-else class="sub" style="margin-top: 16px; max-width: 680px;">
          首次打开会把原型里拆出的题库、结果库和图片素材载入进来。
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
  isReady,
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
