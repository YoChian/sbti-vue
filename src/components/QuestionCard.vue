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
