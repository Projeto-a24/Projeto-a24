<script setup>
const props = defineProps({
  directors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-director']);
</script>

<template>
  <section v-if="directors.length > 0" class="director-section">
    <h2 class="director-title">{{ directors.length > 1 ? 'Diretores' : 'Diretor' }}</h2>
    <div class="director-grid">
      <div
        v-for="director in directors"
        :key="director.id"
        class="director-card"
        @click="emit('open-director', director.id)"
      >
        <div class="director-photo-wrapper">
          <img
            v-if="director.profile_path"
            :src="`https://image.tmdb.org/t/p/w200${director.profile_path}`"
            :alt="director.name"
            class="director-photo"
          />
          <div v-else class="director-photo-placeholder">
            <span>📽️</span>
          </div>
        </div>
        <div class="director-info">
          <h4 class="director-name">{{ director.name }}</h4>
          <p class="director-role">Direção</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.director-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.director-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 3rem 2rem;
}

.director-grid {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  flex-wrap: wrap;
}

.director-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.director-card:hover {
  transform: translateY(-5px);
}

.director-photo-wrapper {
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1a1a1a;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.director-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.3s ease;
}

.director-card:hover .director-photo {
  transform: scale(1.1);
}

.director-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.director-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 150px;
}

.director-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.director-role {
  font-size: 0.8rem;
  color: #888888;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .director-grid {
    justify-content: center;
  }
  
  .director-photo-wrapper {
    width: 120px;
    height: 120px;
  }
}
</style>