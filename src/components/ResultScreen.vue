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
              loading="lazy"
              decoding="async"
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

.result-wrap {
  margin-top: 22px;
  padding: 22px;
}

.result-layout {
  display: grid;
  gap: 18px;
}

.result-top {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 18px;
  align-items: stretch;
}

.poster-box,
.type-box,
.analysis-box,
.dim-box,
.note-box {
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
}

.poster-box {
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 280px;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at top right, rgba(127, 165, 134, 0.16), rgba(127, 165, 134, 0) 40%),
    linear-gradient(180deg, #ffffff, #f7fbf8);
}

.poster-box::after {
  content: "";
  position: absolute;
  right: -46px;
  bottom: -46px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(127, 165, 134, 0.12), rgba(127, 165, 134, 0.01));
  pointer-events: none;
}

.poster-image {
  width: 100%;
  min-height: 220px;
  max-height: 460px;
  object-fit: contain;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.75);
  position: relative;
  z-index: 1;
}

.poster-box.no-image {
  min-height: auto;
}

.poster-box.no-image .poster-image {
  display: none;
}

.poster-box.no-image .poster-caption {
  margin-top: 0;
}

.poster-caption {
  margin-top: 14px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

.type-kicker {
  font-size: 12px;
  color: var(--accent-strong);
  margin-bottom: 8px;
  letter-spacing: 0.06em;
}

.type-name {
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.type-subname {
  margin-top: 10px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.match {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 10px 14px;
  background: var(--soft);
  border: 1px solid var(--line);
  color: var(--accent-strong);
  font-weight: 700;
  font-size: 14px;
  line-height: 1.4;
}

.analysis-box h3,
.dim-box h3,
.note-box h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.analysis-box p {
  margin: 0;
  color: #304034;
  font-size: 15px;
  line-height: 1.9;
  white-space: pre-wrap;
}

.dim-list {
  display: grid;
  gap: 12px;
}

.dim-item {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  background: #fff;
}

.dim-item-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.dim-item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.dim-item-score {
  color: var(--accent-strong);
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
}

.dim-item p,
.note-box p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.author-box {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
  overflow: hidden;
}

.author-box summary {
  list-style: none;
  cursor: pointer;
  padding: 18px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.author-box summary::-webkit-details-marker {
  display: none;
}

.author-box summary::after {
  content: "展开";
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-strong);
  border: 1px solid var(--line);
  background: var(--soft);
  padding: 6px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.author-box[open] summary::after {
  content: "收起";
}

.author-content {
  border-top: 1px solid var(--line);
  padding: 0 18px 18px;
}

.author-content p {
  margin: 14px 0 0;
  color: #304034;
  font-size: 14px;
  line-height: 1.9;
}

.result-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
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

.btn-secondary {
  background: #fff;
  color: var(--accent-strong);
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid var(--line);
  font-weight: 700;
}

@media (max-width: 860px) {
  .result-top {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .result-wrap {
    padding: 16px;
  }
}
</style>
