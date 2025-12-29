<template>
  <div class="emergence-stage">
    <div class="white-flash"></div>
    <div class="logo-construct">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
      <div class="core-eye"></div>
    </div>
    <div class="title-construct">
      <h1 class="main-title">AMADEUS GATE</h1>
      <div class="sub-title">AI COGNITION RECONSTRUCTION PROTOCOL</div>
      <div class="divergence-readout">
        WORLD LINE DIVERGENCE: <span class="red">0.000000%</span> -> [READY]
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.emergence-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 95;
  background: #000;
}

.white-flash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  animation: flash-fade 0.5s forwards;
}

@keyframes flash-fade {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.logo-construct {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #0ff;
  border-radius: 50%;
}

.ring-1 {
  width: 100%;
  height: 100%;
  animation: spin 10s linear infinite;
  border-style: dashed;
}

.ring-2 {
  width: 70%;
  height: 70%;
  animation: spin 5s linear reverse infinite;
  border-color: #0f0;
}

.ring-3 {
  width: 40%;
  height: 40%;
  animation: pulse 2s infinite;
  background: rgba(0, 255, 255, 0.2);
}

.core-eye {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px #fff, 0 0 40px #0ff;
  animation: pulse 1s ease-in-out infinite;
}

.title-construct {
  text-align: center;
  animation: slide-up 1s ease-out;
}

.main-title {
  font-size: 4rem;
  color: #fff;
  text-shadow: 0 0 20px #0ff;
  margin: 0;
  letter-spacing: 10px;
  font-family: 'Share Tech Mono', monospace;
}

.sub-title {
  color: #888;
  letter-spacing: 5px;
  margin-top: 10px;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
    letter-spacing: 5px;
  }

  .sub-title {
    font-size: 0.9rem;
    letter-spacing: 2px;
    padding: 0 20px;
  }
}

.divergence-readout {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #0f0;
  font-family: 'Share Tech Mono', monospace;
}

.red {
  color: #f00;
  text-shadow: 0 0 10px #f00;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
