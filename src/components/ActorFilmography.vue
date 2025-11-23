<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  credits: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-movie']);

const filterType = ref('all');

const filteredCredits = computed(() => {
  if (filterType.value === 'all') return props.credits;
  return props.credits.filter(credit => credit.media_type === filterType.value);
});

const setFilter = (type) => {
  filterType.value = type;
};
</script>

<template>
  <section class="filmography-section">
    <div class="filmography-header">
      <h2 class="filmography-title">Filmografia</h2>
      <div class="filter-buttons">
        <button
          :class="['filter-btn', { active: filterType === 'all' }]"
          @click="setFilter('all')"
        >
          Todos
        </button>
        <button
          :class="['filter-btn', { active: filterType === 'movie' }]"
          @click="setFilter('movie')"
        >
          Filmes
        </button>
        <button
          :class="['filter-btn', { active: filterType === 'tv' }]"
          @click="setFilter('tv')"
        >
          Séries
        </button>
      </div>
    </div>

    <div class="credits-grid">
      <div
        v-for="credit in filteredCredits"
        :key="credit.id"
        class="credit-card"
        @click="credit.media_type === 'movie' && emit('open-movie', credit.id)"
      >
        <div class="credit-poster-wrapper">
          <img
            v-if="credit.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${credit.poster_path}`"
            :alt="credit.title || credit.name"
            class="credit-poster"
          />
          <div v-else class="credit-poster-placeholder">
            Poster Indisponível
          </div>
          <div class="credit-overlay">
            <div class="credit-info">
              <h4>{{ credit.title || credit.name }}</h4>
              <p class="credit-date">
                {{ credit.release_date || credit.first_air_date || 'Data desconhecida' }}
              </p>
              <p class="credit-character" v-if="credit.character">
                {{ credit.character }}
              </p>
              <span class="credit-type">
                {{ credit.media_type === 'movie' ? 'Filme' : 'Série' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredCredits.length === 0" class="no-results">
      <p>Nenhum resultado encontrado</p>
    </div>
  </section>
</template>

<style scoped>
.filmography-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.filmography-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.filmography-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 0.6rem 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.filter-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

.filter-btn.active {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.credits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.credit-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.credit-card:hover {
  transform: translateY(-8px);
}

.credit-poster-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
}

.credit-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.credit-poster-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #666;
  font-size: 0.85rem;
  text-align: center;
}

.credit-card:hover .credit-poster {
  transform: scale(1.05);
}

.credit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
  padding: 2rem 1rem 1rem 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.credit-card:hover .credit-overlay {
  opacity: 1;
}

.credit-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.credit-date {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0 0 0.3rem 0;
}

.credit-character {
  font-size: 0.85rem;
  color: #ccc;
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.credit-type {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 0.7rem;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .filmography-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .filter-buttons {
    width: 100%;
    justify-content: center;
  }

  .credits-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
}
</style>