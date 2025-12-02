<script setup>
const props = defineProps({
  movie: {
    type: Object,
    default: () => ({}),
  },
  trailer: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['go-back', 'open-trailer']);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
  });
};

const formatCurrency = (value) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatRuntime = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};
</script>

<template>
  <div
    class="details-hero"
    :style="{
      backgroundImage: movie.backdrop_path
        ? `linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.95) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        : 'none',
    }"
  >
    <button @click="emit('go-back')" class="back-btn">← Voltar</button>

    <div class="details-content">
      <div class="poster-container">
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="poster-image"
        />
      </div>

      <div class="movie-info">
        <h1 class="movie-title">{{ movie.title }}</h1>

        <div class="movie-meta">
          <span v-if="movie.release_date" class="meta-item">{{ formatDate(movie.release_date) }}</span>
          <span v-if="movie.runtime" class="meta-item">{{ formatRuntime(movie.runtime) }}</span>
          <span v-if="movie.vote_average" class="meta-item rating">★ {{ movie.vote_average.toFixed(1) }}</span>
        </div>

        <div v-if="movie.genres && movie.genres.length" class="genres">
          <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
            {{ genre.name }}
          </span>
        </div>

        <p v-if="movie.tagline" class="movie-tagline">{{ movie.tagline }}</p>

        <p v-if="movie.overview" class="movie-overview">{{ movie.overview }}</p>

        <div class="action-buttons">
          <button v-if="trailer" @click="emit('open-trailer')" class="trailer-btn">
            ▶ Assistir Trailer
          </button>
          <span v-else class="trailer-unavailable">Trailer indisponível no momento</span>
        </div>

        <div class="info-compact">
          <div v-if="movie.budget" class="info-item">
            <span class="info-label">Orçamento</span>
            <span class="info-value">{{ formatCurrency(movie.budget) }}</span>
          </div>
          <div v-if="movie.revenue" class="info-item">
            <span class="info-label">Bilheteria</span>
            <span class="info-value">{{ formatCurrency(movie.revenue) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-hero {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  padding: 5rem 2rem 3rem 2rem;
  display: flex;
  flex-direction: column;
}

.back-btn {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-bottom: 2rem;
}

.back-btn:hover {
  color: #ffffff;
}

.details-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

.poster-container {
  position: sticky;
  top: 5rem;
}

.poster-image {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.movie-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.movie-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  font-size: 0.85rem;
  color: #888888;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 500;
}

.meta-item.rating {
  color: #ffd700;
  font-weight: 600;
}

.genres {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.genre-tag {
  padding: 0.4rem 1rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #cccccc;
}

.movie-tagline {
  font-size: 1.1rem;
  font-style: italic;
  color: #aaaaaa;
  margin: 0;
  line-height: 1.6;
}

.movie-overview {
  font-size: 1rem;
  line-height: 1.7;
  color: #cccccc;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.trailer-btn {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trailer-btn:hover {
  background-color: #000000;
  color: #ffffff;
  outline: 2px solid #ffffff;
}

.trailer-unavailable {
  font-size: 0.85rem;
  color: #666666;
  font-style: italic;
}

.info-compact {
  display: flex;
  gap: 3rem;
  padding-top: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666666;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
}


</style>
