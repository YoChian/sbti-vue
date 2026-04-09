<template>
  <section class="screen active">
    <div class="result-wrap card">
      <div class="result-layout">
        <div class="result-top">
          <div id="posterBox" class="poster-box" :class="{ 'no-image': !result.imageSrc }">
            <img
              v-if="result.imageSrc"
              id="posterImage"
              class="poster-image"
              :src="result.imageSrc"
              :alt="`${result.finalType.code}（${result.finalType.cn}）`"
            />
            <div id="posterCaption" class="poster-caption">{{ result.finalType.intro }}</div>
          </div>

          <div class="type-box">
            <div id="resultModeKicker" class="type-kicker">{{ result.modeKicker }}</div>
            <div id="resultTypeName" class="type-name">
              {{ result.finalType.code }}（{{ result.finalType.cn }}）
            </div>
            <div id="matchBadge" class="match">{{ result.badge }}</div>
            <div id="resultTypeSub" class="type-subname">{{ result.sub }}</div>
          </div>
        </div>

        <div class="analysis-box">
          <h3>该人格的简单解读</h3>
          <p id="resultDesc">{{ result.finalType.desc }}</p>
        </div>

        <div class="dim-box">
          <h3>十五维度评分</h3>
          <div id="dimList" class="dim-list">
            <div v-for="dimension in result.dimensions" :key="dimension.key" class="dim-item">
              <div class="dim-item-top">
                <div class="dim-item-name">{{ dimension.name }}</div>
                <div class="dim-item-score">{{ dimension.level }} / {{ dimension.score }}分</div>
              </div>
              <p>{{ dimension.explanation }}</p>
            </div>
          </div>
        </div>

        <div class="note-box">
          <h3>友情提示</h3>
          <p id="funNote">{{ result.funNote }}</p>
        </div>

        <details class="author-box">
          <summary>作者的话</summary>
          <div class="author-content">
            <p v-for="paragraph in result.authorNotes" :key="paragraph">{{ paragraph }}</p>
          </div>
        </details>
      </div>

      <div class="result-actions">
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn-secondary" @click="$emit('restart')">重新测试</button>
          <button class="btn-primary" @click="$emit('home')">回到首页</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});

defineEmits(['restart', 'home']);
</script>
