<script setup>
const props = defineProps({
  actor: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['go-back']);

const formatDate = (date) => {
  if (!date) return 'Informação não disponível';
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const calculateAge = (birthday) => {
  if (!birthday) return null;
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
</script>

<template>
  <div
    class="details-hero"
    :style="{
      backgroundImage: actor.profile_path
        ? `linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.95) 100%), url(https://image.tmdb.org/t/p/original${actor.profile_path})`
        : 'none',
    }"
  >
    <button @click="emit('go-back')" class="back-btn">← Voltar</button>

    <div class="details-content">
      <div class="photo-container">
        <img
          v-if="actor.profile_path"
          :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`"
          :alt="actor.name"
          class="photo-image"
        />
        <div v-else class="photo-placeholder">
          Foto Indisponível
        </div>
      </div>

      <div class="actor-info">
        <h1 class="actor-name">{{ actor.name }}</h1>

        <div class="actor-meta">
          <span v-if="actor.known_for_department" class="meta-item">
            {{ actor.known_for_department }}
          </span>
          <span v-if="actor.birthday" class="meta-item">
            {{ calculateAge(actor.birthday) }} anos
          </span>
          <span v-if="actor.popularity" class="meta-item">
            Popularidade: {{ actor.popularity.toFixed(1) }}
          </span>
        </div>

        <div class="personal-info">
          <div v-if="actor.birthday" class="info-row">
            <span class="info-label">Nascimento</span>
            <span class="info-value">{{ formatDate(actor.birthday) }}</span>
          </div>
          <div v-if="actor.place_of_birth" class="info-row">
            <span class="info-label">Local de Nascimento</span>
            <span class="info-value">{{ actor.place_of_birth }}</span>
          </div>
          <div v-if="actor.deathday" class="info-row">
            <span class="info-label">Falecimento</span>
            <span class="info-value">{{ formatDate(actor.deathday) }}</span>
          </div>
        </div>

        <div v-if="actor.biography" class="biography">
          <h3 class="section-subtitle">Biografia</h3>
          <p class="biography-text">
            {{ actor.biography || 'Informação não disponível' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-hero {
  position: relative;
  min-height: 90vh;
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

.photo-container {
  position: sticky;
  top: 5rem;
}

.photo-image {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  object-position: center top;
}

.photo-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #666;
  font-size: 0.9rem;
}

.actor-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 0.5rem;
}

.actor-name {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.actor-meta {
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

.personal-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row {
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
  font-size: 0.95rem;
  font-weight: 400;
  color: #cccccc;
}

.biography {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.biography-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #cccccc;
  margin: 0;
}

@media (max-width: 1024px) {
  .details-content {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }

  .actor-name {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .details-hero {
    padding: 5rem 1.5rem 2rem 1.5rem;
    background-image: linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.95) 100%) !important;
  }

  .details-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .photo-container {
    position: relative;
    top: 0;
    max-width: 250px;
    margin: 0 auto;
  }

  .actor-name {
    font-size: 2.2rem;
  }
}
</style>