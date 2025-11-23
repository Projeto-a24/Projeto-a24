<script setup>
const props = defineProps({
  cast: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-actor']);
</script>

<template>
  <section v-if="cast.length > 0" class="cast-section">
    <h2 class="cast-title">Elenco Principal</h2>
    <div class="cast-grid">
      <div
        v-for="actor in cast"
        :key="actor.id"
        class="cast-card"
        @click="emit('open-actor', actor.id)"
      >
        <div class="cast-photo-wrapper">
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
            :alt="actor.name"
            class="cast-photo"
          />
          <div v-else class="cast-photo-placeholder">
            Foto Indisponível
          </div>
        </div>
        <div class="cast-info">
          <h4 class="cast-name">{{ actor.name }}</h4>
          <p class="cast-character">{{ actor.character }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cast-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 5rem 2rem 3rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cast-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.cast-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
}

.cast-card:hover {
  transform: translateY(-5px);
}

.cast-photo-wrapper {
  width: 100%;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 50%;
  aspect-ratio: 1;
  background-color: #1a1a1a;
}

.cast-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.3s ease;
}

.cast-card:hover .cast-photo {
  transform: scale(1.1);
}

.cast-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.cast-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cast-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.cast-character {
  font-size: 0.8rem;
  color: #888888;
  margin: 0;
}

@media (max-width: 768px) {
  .cast-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1.5rem;
  }
}
</style>