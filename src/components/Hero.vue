<script setup>
import { computed } from 'vue';

const props = defineProps({
  featuredMovies: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['next', 'prev', 'select', 'open']);

const currentMovie = computed(() =>
  props.featuredMovies.length ? props.featuredMovies[props.currentIndex] : null
);
</script>

<template>
  <section class="hero" v-if="featuredMovies.length > 0 && currentMovie">
    <div
      class="hero-background"
      :style="{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`
      }"
    >
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-label">Em Destaque</span>
          <h1 class="hero-title">{{ currentMovie.title }}</h1>
          <p class="hero-overview">{{ currentMovie.overview }}</p>
          <button
            class="hero-btn"
            @click="emit('open', currentMovie.id)"
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      <div class="hero-nav">
        <button @click="emit('prev')" class="hero-nav-btn">‹</button>
        <div class="hero-indicators">
          <span
            v-for="(movie, index) in featuredMovies"
            :key="movie.id"
            :class="['indicator', { active: index === currentIndex }]"
            @click="emit('select', index)"
          ></span>
        </div>
        <button @click="emit('next')" class="hero-nav-btn">›</button>
      </div>
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

.hero-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 0.8s ease-in-out;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.hero-content {
  width: 100%;
  padding: 4rem;
  z-index: 2;
}

.hero-text {
  max-width: 600px;
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
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-overview {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 2rem;
  max-width: 500px;
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

@media (max-width: 768px) {
  .hero {
    margin-top: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-content {
    padding: 2rem;
  }

  .hero-nav {
    right: 2rem;
  }
}
</style>
