<script setup>
import { computed } from 'vue';

const props = defineProps({
  featuredActors: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['next', 'prev', 'select', 'open']);

const currentPair = computed(() => {
  if (!props.featuredActors.length) return [];
  const first = props.featuredActors[props.currentIndex];
  const second = props.featuredActors[(props.currentIndex + 1) % props.featuredActors.length];
  return [first, second];
});

const totalPairs = computed(() => Math.ceil(props.featuredActors.length / 2));
</script>

<template>
  <section class="hero" v-if="featuredActors.length > 0 && currentPair.length">
    <div class="hero-split">
      <div
        class="hero-half left"
        :style="{
          backgroundImage: currentPair[0]?.profile_path
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${currentPair[0].profile_path})`
            : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
        }"
        @click="emit('open', currentPair[0]?.id)"
      >
        <div class="hero-content">
          <div class="hero-text">
            <span class="hero-label">Ator em Destaque</span>
            <h1 class="hero-title">{{ currentPair[0]?.name }}</h1>
            <p class="hero-overview" v-if="currentPair[0]?.known_for_department">
              {{ currentPair[0].known_for_department }}
            </p>
            <button
              class="hero-btn"
              @click.stop="emit('open', currentPair[0]?.id)"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>

      <div
        class="hero-half right"
        :style="{
          backgroundImage: currentPair[1]?.profile_path
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${currentPair[1].profile_path})`
            : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
        }"
        @click="emit('open', currentPair[1]?.id)"
      >
        <div class="hero-content">
          <div class="hero-text">
            <span class="hero-label">Ator em Destaque</span>
            <h1 class="hero-title">{{ currentPair[1]?.name }}</h1>
            <p class="hero-overview" v-if="currentPair[1]?.known_for_department">
              {{ currentPair[1].known_for_department }}
            </p>
            <button
              class="hero-btn"
              @click.stop="emit('open', currentPair[1]?.id)"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-nav">
      <button @click="emit('prev')" class="hero-nav-btn">‹</button>
      <div class="hero-indicators">
        <span
          v-for="index in totalPairs"
          :key="index"
          :class="['indicator', { active: Math.floor(currentIndex / 2) === index - 1 }]"
          @click="emit('select', (index - 1) * 2)"
        ></span>
      </div>
      <button @click="emit('next')" class="hero-nav-btn">›</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 85vh;
  overflow: hidden;
  margin-top: 3.5rem;
}

.hero-split {
  display: flex;
  width: 100%;
  height: 100%;
}

.hero-half {
  width: 50%;
  height: 100%;
  background-size: cover;
  background-position: center 20%;
  transition: background-image 0.8s ease-in-out;
  display: flex;
  align-items: flex-end;
  position: relative;
  cursor: pointer;
}

.hero-half:hover {
  filter: brightness(1.1);
}

.hero-half.left {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-content {
  width: 100%;
  padding: 4rem;
  z-index: 2;
}

.hero-text {
  max-width: 500px;
}

.hero-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffffff;
  font-weight: 500;
  display: block;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-overview {
  font-size: 1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 2rem;
  max-width: 400px;
}

.hero-btn {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  background-color: #000000;
  color: #ffffff;
  outline: 2px solid #ffffff;
}

.hero-nav {
  position: absolute;
  bottom: 2rem;
  right: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 3;
}

.hero-nav-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hero-nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}

.hero-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #ffffff;
  width: 24px;
  border-radius: 4px;
}

</style>
