<script setup>
const props = defineProps({
  movies: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['open-movie']);

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '';
</script>

<template>
  <section class="movies-section">
    <h3 class="section-title">
      {{ title }}
    </h3>

    <div class="movies-grid">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-card"
        @click="emit('open-movie', movie.id)"
      >
        <div class="movie-poster-wrapper">
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="movie-poster"
          />
          <div class="movie-overlay">
            <div class="movie-info">
              <h4>{{ movie.title }}</h4>
              <p class="movie-date">{{ formatDate(movie.release_date) }}</p>
              <div class="movie-rating">
                ★ {{ movie.vote_average?.toFixed(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.movies-section {
  padding: 4rem 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-8px);
}

.movie-poster-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
}

.movie-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.movie-date {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0 0 0.5rem 0;
}

.movie-rating {
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: 600;
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }
}
</style>

