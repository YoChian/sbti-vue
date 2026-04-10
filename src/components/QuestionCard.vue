<template>
  <article class="question">
    <div class="question-meta">
      <div class="badge">第 {{ index + 1 }} 题</div>
      <div>{{ metaLabel }}</div>
    </div>

    <div class="question-title">{{ question.text }}</div>

    <div class="options">
      <label
        v-for="(option, optionIndex) in question.options"
        :key="`${question.id}-${option.value}`"
        class="option"
        :class="{ selected: answer === option.value }"
      >
        <input
          type="radio"
          :name="question.id"
          :checked="answer === option.value"
          @change="$emit('select', { questionId: question.id, value: option.value })"
        />

        <div class="option-body">
          <div class="option-code">{{ optionCodes[optionIndex] ?? optionIndex + 1 }}</div>
          <div>{{ option.label }}</div>
        </div>
      </label>
    </div>
  </article>
</template>

<script setup>
const optionCodes = ['A', 'B', 'C', 'D'];

defineProps({
  index: {
    type: Number,
    required: true,
  },
  question: {
    type: Object,
    required: true,
  },
  answer: {
    type: Number,
    default: undefined,
  },
  metaLabel: {
    type: String,
    required: true,
  },
});

defineEmits(['select']);
</script>

<style scoped>
.question {
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  background: var(--soft);
  border: 1px solid var(--line);
}

.question-title {
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.options {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: #fff;
  transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease,
    box-shadow 0.16s ease;
}

.option:hover {
  border-color: #bcd0c1;
  background: #f8fcf9;
}

.option.selected {
  border-color: #9cb4a1;
  background: #f4fbf5;
  box-shadow: 0 8px 20px rgba(77, 106, 83, 0.08);
}

.option input {
  margin-top: 3px;
  accent-color: var(--accent-strong);
  transform: scale(1.1);
  flex-shrink: 0;
}

.option-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.option-code {
  font-weight: 800;
  color: var(--accent-strong);
  min-width: 22px;
}

@media (max-width: 600px) {
  .question-title {
    font-size: 15px;
  }
}
</style>
