<script setup>
import { ref } from 'vue';

const props = defineProps({
  genres: {
    type: Array,
    default: () => [],
  },
  currentGenreId: {
    type: [Number, null],
    default: null,
  },
  showReset: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select-genre', 'reset']);

const genreScrollContainer = ref(null);

const scrollGenres = (direction) => {
  if (genreScrollContainer.value) {
    const scrollAmount = 300;
    genreScrollContainer.value.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }
};
</script>

<template>
  <section class="genre-section">
    <div class="section-header">
      <h3>Explorar por Gênero</h3>
      <button
        v-if="showReset"
        @click="emit('reset')"
        class="reset-btn"
      >
        Limpar Filtro
      </button>
    </div>

    <div class="genre-carousel-wrapper">
      <button @click="scrollGenres('left')" class="carousel-btn left">‹</button>

      <div class="genre-carousel" ref="genreScrollContainer">
        <div
          v-for="genre in genres"
          :key="genre.id"
          @click="emit('select-genre', genre.id)"
          class="genre-chip"
          :class="{ active: genre.id === currentGenreId }"
        >
          {{ genre.name }}
        </div>
      </div>

      <button @click="scrollGenres('right')" class="carousel-btn right">›</button>
    </div>
  </section>
</template>

<style scoped>
.genre-section {
  padding: 4rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.reset-btn {
  background-color: transparent;
  border: 1px solid #ffffff;
  color: #ffffff;
  padding: 0.6rem 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.reset-btn:hover {
  background-color: #ffffff;
  color: #000000;
}

.genre-carousel-wrapper {
  position: relative;
  padding: 0 3rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.carousel-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}

.carousel-btn.left {
  left: 0;
}

.carousel-btn.right {
  right: 0;
}

.genre-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem 0;
}

.genre-carousel::-webkit-scrollbar {
  display: none;
}

.genre-chip {
  flex-shrink: 0;
  padding: 0.8rem 2rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.genre-chip:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

.genre-chip.active {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}
</style>
