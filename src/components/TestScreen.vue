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
          {{ isSubmitting
            ? '正在载入结果库与图片素材，请稍等一下。'
            : progress.complete
            ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
            : '全选完才会放行。世界已经够乱了，起码把题做完整。' }}
        </div>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn-secondary" @click="$emit('back')">回到首页</button>
          <button
            class="btn-primary"
            :disabled="!progress.complete || isSubmitting"
            @click="$emit('submit')"
          >
            {{
              isSubmitting
                ? '正在载入结果…'
                : isResultDataReady
                  ? '查看结果'
                  : '查看结果（将补载结果库）'
            }}
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
  isResultDataReady: {
    type: Boolean,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    required: true,
  },
  getQuestionMetaLabel: {
    type: Function,
    required: true,
  },
});

defineEmits(['back', 'select', 'submit']);
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

.test-wrap {
  margin-top: 22px;
  padding: 22px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  position: sticky;
  top: 12px;
  z-index: 10;
  padding: 12px 14px;
  margin: 0 0 18px;
  border: 1px solid rgba(219, 232, 221, 0.92);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 24px rgba(47, 73, 55, 0.08);
}

.progress {
  flex: 1;
  min-width: 240px;
  height: 10px;
  background: #edf3ee;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress > span {
  display: block;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #97b59c, #5b7a62);
  border-radius: inherit;
  transition: width 0.22s ease;
}

.progress-text {
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
}

.question-list {
  display: grid;
  gap: 16px;
}

.actions-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
  padding-top: 6px;
}

.hint {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
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

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

.btn-primary {
  background: var(--accent-strong);
  color: #fff;
  padding: 14px 20px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(77, 106, 83, 0.18);
  font-weight: 700;
}

.btn-secondary {
  background: #fff;
  color: var(--accent-strong);
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid var(--line);
  font-weight: 700;
}

@media (max-width: 600px) {
  .test-wrap {
    padding: 16px;
  }

  .topbar {
    top: 8px;
    padding: 10px 12px;
  }
}
</style>
