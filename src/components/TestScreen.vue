<template>
  <section class="screen active">
    <div class="test-wrap card">
      <div class="topbar">
        <div class="progress">
          <span :style="{ width: `${progress.percent}%` }"></span>
        </div>
        <div class="progress-text">{{ progress.done }} / {{ progress.total }}</div>
      </div>

      <div class="question-list">
        <QuestionCard
          v-for="(question, index) in questions"
          :key="question.id"
          :index="index"
          :question="question"
          :answer="answers[question.id]"
          :meta-label="getQuestionMetaLabel(question)"
          @select="$emit('select', $event)"
        />
      </div>

      <div class="actions-bottom">
        <div class="hint">
          {{ progress.complete
            ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
            : '全选完才会放行。世界已经够乱了，起码把题做完整。' }}
        </div>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn-secondary" @click="$emit('back')">回到首页</button>
          <button
            class="btn-primary"
            :disabled="!progress.complete"
            @click="$emit('submit')"
          >
            查看结果
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import QuestionCard from './QuestionCard.vue';

defineProps({
  questions: {
    type: Array,
    required: true,
  },
  answers: {
    type: Object,
    required: true,
  },
  progress: {
    type: Object,
    required: true,
  },
  getQuestionMetaLabel: {
    type: Function,
    required: true,
  },
});

defineEmits(['back', 'select', 'submit']);
</script>
