<script setup>
const props = defineProps({
  directors: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['open-director']);
</script>

<template>
  <section class="directors-section">
    <h3 class="section-title">{{ title }}</h3>

    <div class="directors-grid">
      <div
        v-for="director in directors"
        :key="director.id"
        class="director-card"
        @click="emit('open-director', director.id)"
      >
        <div class="director-photo-wrapper">
          <img
            v-if="director.profile_path"
            :src="`https://image.tmdb.org/t/p/w500${director.profile_path}`"
            :alt="director.name"
            class="director-photo"
          />
          <div v-else class="director-photo-placeholder">
            <span>Foto Indisponível</span>
          </div>
          <div class="director-overlay">
            <div class="director-info">
              <h4>{{ director.name }}</h4>
              <p class="director-department">{{ director.known_for_department }}</p>
              <p class="director-popularity" v-if="director.popularity">
                Popularidade: {{ director.popularity.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="directors.length === 0" class="no-results">
      <p>Nenhum diretor encontrado</p>
    </div>
  </section>
</template>

<style scoped>
.directors-section {
  padding: 4rem 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.directors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
}

.director-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.director-card:hover {
  transform: translateY(-8px);
}

.director-photo-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
}

.director-photo {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.4s ease;
}

.director-photo-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}

.director-card:hover .director-photo {
  transform: scale(1.05);
}

.director-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.director-card:hover .director-overlay {
  opacity: 1;
}

.director-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.director-department {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0 0 0.3rem 0;
}

.director-popularity {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .directors-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }
}
</style>
