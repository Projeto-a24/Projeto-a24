<script setup>
import { defineProps, onMounted, computed, ref } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';

const movieStore = useMovieStore();
const router = useRouter();
const isLoading = ref(false);

const props = defineProps({
  movieId: {
    type: [Number, String],
    required: true,
  },
});

const movie = computed(() => movieStore.currentMovie);

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

const goBack = () => {
  router.push({ name: 'Home' });
};

onMounted(async () => {
  isLoading.value = true;
  await movieStore.getMovieDetail(Number(props.movieId));
  isLoading.value = false;
});
</script>

<template>
  <div class="movie-details-page">
    <loading v-model:active="isLoading" is-full-page />

    <!-- Hero Background -->
    <div
      class="details-hero"
      :style="{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.95) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : 'none',
      }"
    >
      <!-- Back Button -->
      <button @click="goBack" class="back-btn">← Voltar</button>

      <!-- Main Content -->
      <div class="details-content">
        <!-- Poster -->
        <div class="poster-container">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="poster-image"
          />
        </div>

        <!-- Info -->
        <div class="movie-info">
          <h1 class="movie-title">{{ movie.title }}</h1>

          <div class="movie-meta">
            <span v-if="movie.release_date" class="meta-item">{{ formatDate(movie.release_date) }}</span>
            <span v-if="movie.runtime" class="meta-item">{{ formatRuntime(movie.runtime) }}</span>
            <span v-if="movie.vote_average" class="meta-item rating">{{ movie.vote_average.toFixed(1) }}</span>
          </div>

          <div v-if="movie.genres && movie.genres.length" class="genres">
            <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>

          <p v-if="movie.tagline" class="movie-tagline">{{ movie.tagline }}</p>
          
          <p v-if="movie.overview" class="movie-overview">{{ movie.overview }}</p>

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

    <!-- Production Companies -->
    <section
      v-if="movie.production_companies && movie.production_companies.length"
      class="companies-section"
    >
      <div class="companies-grid">
        <div
          v-for="company in movie.production_companies"
          :key="company.id"
          class="company-card"
        >
          <img
            v-if="company.logo_path"
            :src="`https://image.tmdb.org/t/p/w200${company.logo_path}`"
            :alt="company.name"
            class="company-logo"
          />
          <span v-else class="company-name">{{ company.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.movie-details-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #ffffff;
  padding-top: 3.5rem;
}

/* Hero Section */
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

/* Content */
.details-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Poster */
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

/* Movie Info */
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
  color: #ffffff;
  font-weight: 600;
}

.meta-item.rating::before {
  content: '★ ';
  color: #ffd700;
}

/* Genres */
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

/* Info Compact */
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

/* Companies Section */
.companies-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.companies-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.company-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.company-logo {
  max-width: 120px;
  max-height: 50px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.company-logo:hover {
  opacity: 1;
}

.company-name {
  font-size: 0.8rem;
  color: #666666;
  text-align: center;
  letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 1024px) {
  .details-content {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }

  .movie-title {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .movie-details-page {
    padding-top: 3rem;
  }

  .details-hero {
    padding: 5rem 1.5rem 2rem 1.5rem;
    background-image: linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.95) 100%) !important;
  }

  .details-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .poster-container {
    position: relative;
    top: 0;
    max-width: 250px;
    margin: 0 auto;
  }

  .movie-title {
    font-size: 2.2rem;
  }

  .movie-tagline {
    font-size: 1rem;
  }

  .info-compact {
    flex-direction: column;
    gap: 1rem;
  }

  .companies-grid {
    gap: 1.5rem;
  }

  .company-logo {
    max-width: 100px;
    max-height: 40px;
  }
}
</style>