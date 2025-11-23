<script setup>
const props = defineProps({
  actors: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['open-actor']);
</script>

<template>
  <section class="actors-section">
    <h3 class="section-title">{{ title }}</h3>

    <div class="actors-grid">
      <div
        v-for="actor in actors"
        :key="actor.id"
        class="actor-card"
        @click="emit('open-actor', actor.id)"
      >
        <div class="actor-photo-wrapper">
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`"
            :alt="actor.name"
            class="actor-photo"
          />
          <div v-else class="actor-photo-placeholder">
            <span>Foto Indisponível</span>
          </div>
          <div class="actor-overlay">
            <div class="actor-info">
              <h4>{{ actor.name }}</h4>
              <p class="actor-department">{{ actor.known_for_department }}</p>
              <p class="actor-popularity">
                Popularidade: {{ actor.popularity.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.actors-section {
  padding: 4rem 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
}

.actor-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-8px);
}

.actor-photo-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
}

.actor-photo {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.4s ease;
}

.actor-photo-placeholder {
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

.actor-card:hover .actor-photo {
  transform: scale(1.05);
}

.actor-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.actor-card:hover .actor-overlay {
  opacity: 1;
}

.actor-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.actor-department {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0 0 0.3rem 0;
}

.actor-popularity {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }
}
</style>