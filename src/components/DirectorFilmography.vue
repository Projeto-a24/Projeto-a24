<script setup>
const props = defineProps({
  credits: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-movie']);
</script>

<template>
  <section class="filmography-section">
    <div class="filmography-header">
      <h2 class="filmography-title">Filmes Dirigidos</h2>
    </div>

    <div class="credits-grid">
      <div
        v-for="credit in credits"
        :key="credit.id"
        class="credit-card"
        @click="emit('open-movie', credit.id)"
      >
        <div class="credit-poster-wrapper">
          <img
            v-if="credit.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${credit.poster_path}`"
            :alt="credit.title"
            class="credit-poster"
          />
          <div v-else class="credit-poster-placeholder">
            Poster Indisponível
          </div>
          <div class="credit-overlay">
            <div class="credit-info">
              <h4>{{ credit.title }}</h4>
              <p class="credit-date">
                {{ credit.release_date || 'Data desconhecida' }}
              </p>
              <p class="credit-rating" v-if="credit.vote_average">
                ★ {{ credit.vote_average.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="credits.length === 0" class="no-results">
      <p>Nenhum filme encontrado</p>
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

.credit-rating {
  font-size: 0.85rem;
  color: #ffd700;
  margin: 0;
  font-weight: 600;
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

  .credits-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
}
</style>
