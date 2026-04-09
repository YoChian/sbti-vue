import { computed, ref } from 'vue';

const AUTHOR_NOTES = [
  '本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。',
  '由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。',
  '关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！！',
  '再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。',
];

function shuffle(list) {
  const next = [...list];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

function levelNum(level) {
  return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern) {
  return pattern.replace(/-/g, '').split('');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useSbtiTest() {
  const screen = ref('intro');
  const isReady = ref(false);
  const loadError = ref('');
  const previewMode = ref(false);
  const answers = ref({});
  const shuffledQuestions = ref([]);
  const result = ref(null);
  const prototypeData = ref(null);

  async function ensureDataLoaded() {
    if (prototypeData.value || loadError.value) return;

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}prototype-data.json`);

      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }

      prototypeData.value = await response.json();
      isReady.value = true;
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : '未知错误';
    }
  }

  ensureDataLoaded();

  const visibleQuestions = computed(() => {
    if (!prototypeData.value) return [];

    const { specialQuestions } = prototypeData.value;
    const visible = [...shuffledQuestions.value];
    const gateIndex = visible.findIndex((question) => question.id === 'drink_gate_q1');

    if (gateIndex !== -1 && answers.value.drink_gate_q1 === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }

    return visible;
  });

  const progress = computed(() => {
    const total = visibleQuestions.value.length;
    const done = visibleQuestions.value.filter(
      (question) => answers.value[question.id] !== undefined
    ).length;
    const percent = total ? (done / total) * 100 : 0;

    return {
      total,
      done,
      percent,
      complete: total > 0 && done === total,
    };
  });

  function showScreen(nextScreen) {
    screen.value = nextScreen;
    scrollToTop();
  }

  function getQuestionMetaLabel(question) {
    if (!prototypeData.value) return '';
    const { dimensionMeta } = prototypeData.value;
    if (question.special) return '补充题';
    return previewMode.value ? dimensionMeta[question.dim].name : '维度已隐藏';
  }

  async function startTest(preview = false) {
    await ensureDataLoaded();
    if (!prototypeData.value) return;

    const { questions, specialQuestions } = prototypeData.value;

    previewMode.value = preview;
    answers.value = {};
    result.value = null;

    const shuffledRegularQuestions = shuffle(questions);
    const insertIndex = Math.floor(Math.random() * shuffledRegularQuestions.length) + 1;

    shuffledQuestions.value = [
      ...shuffledRegularQuestions.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffledRegularQuestions.slice(insertIndex),
    ];

    showScreen('test');
  }

  function selectAnswer({ questionId, value }) {
    answers.value = {
      ...answers.value,
      [questionId]: Number(value),
    };

    if (questionId === 'drink_gate_q1' && Number(value) !== 3) {
      const { drink_gate_q2, ...rest } = answers.value;
      answers.value = rest;
    }
  }

  function getDrunkTriggered() {
    if (!prototypeData.value) return false;
    const { DRUNK_TRIGGER_QUESTION_ID } = prototypeData.value;
    return answers.value[DRUNK_TRIGGER_QUESTION_ID] === 2;
  }

  function computeResult() {
    const {
      DIM_EXPLANATIONS,
      NORMAL_TYPES,
      TYPE_IMAGES,
      TYPE_LIBRARY,
      dimensionMeta,
      dimensionOrder,
      questions,
    } = prototypeData.value;
    const rawScores = {};
    const levels = {};

    Object.keys(dimensionMeta).forEach((dimension) => {
      rawScores[dimension] = 0;
    });

    questions.forEach((question) => {
      rawScores[question.dim] += Number(answers.value[question.id] || 0);
    });

    Object.entries(rawScores).forEach(([dimension, score]) => {
      levels[dimension] = sumToLevel(score);
    });

    const userVector = dimensionOrder.map((dimension) => levelNum(levels[dimension]));

    const ranked = NORMAL_TYPES.map((type) => {
      const vector = parsePattern(type.pattern).map(levelNum);
      let distance = 0;
      let exact = 0;

      for (let index = 0; index < vector.length; index += 1) {
        const diff = Math.abs(userVector[index] - vector[index]);
        distance += diff;
        if (diff === 0) exact += 1;
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

      return {
        ...type,
        ...TYPE_LIBRARY[type.code],
        distance,
        exact,
        similarity,
      };
    }).sort((left, right) => {
      if (left.distance !== right.distance) return left.distance - right.distance;
      if (left.exact !== right.exact) return right.exact - left.exact;
      return right.similarity - left.similarity;
    });

    const bestNormal = ranked[0];
    const drunkTriggered = getDrunkTriggered();

    let finalType;
    let modeKicker = '你的主类型';
    let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
    let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
    let special = false;
    let secondaryType = null;

    if (drunkTriggered) {
      finalType = TYPE_LIBRARY.DRUNK;
      secondaryType = bestNormal;
      modeKicker = '隐藏人格已激活';
      badge = '匹配度 100% · 酒精异常因子已接管';
      sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
      special = true;
    } else if (bestNormal.similarity < 60) {
      finalType = TYPE_LIBRARY.HHHH;
      modeKicker = '系统强制兜底';
      badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
      sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
      special = true;
    } else {
      finalType = bestNormal;
    }

    return {
      rawScores,
      levels,
      ranked,
      bestNormal,
      finalType,
      modeKicker,
      badge,
      sub,
      special,
      secondaryType,
      imageSrc: TYPE_IMAGES[finalType.code] || '',
      funNote: special
        ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
        : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。',
      dimensions: dimensionOrder.map((dimension) => ({
        key: dimension,
        name: dimensionMeta[dimension].name,
        level: levels[dimension],
        score: rawScores[dimension],
        explanation: DIM_EXPLANATIONS[dimension][levels[dimension]],
      })),
      authorNotes: AUTHOR_NOTES,
    };
  }

  function submitTest() {
    if (!prototypeData.value || !progress.value.complete) return;
    result.value = computeResult();
    showScreen('result');
  }

  function restartTest() {
    startTest(false);
  }

  function goIntro() {
    showScreen('intro');
  }

  return {
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
  };
}
