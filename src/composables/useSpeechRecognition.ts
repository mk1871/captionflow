import { ref, onUnmounted } from 'vue';

export function useSpeechRecognition(onResult: (result: string) => void, onClear: () => void, sourceLang: string) {
  const isListening = ref(false);
  const error = ref<string | null>(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition: SpeechRecognition | null = null;

  let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  const TIMEOUT_DURATION = 3000; // 3 segundos de inactividad

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sourceLang; // Establecer el idioma aquí

    recognition.onstart = () => {
      isListening.value = true;
      error.value = null;
      resetInactivityTimer();
    };

    recognition.onend = () => {
      isListening.value = false;
      // Reiniciar automáticamente si no fue una parada manual
      if (recognition) {
        console.log("Reconocimiento finalizado (onend). Reiniciando...");
        setTimeout(() => {
          try {
            recognition?.start();
          } catch (e) {
            console.error("Error al reiniciar el reconocimiento desde onend:", e);
            error.value = "Error al reiniciar el reconocimiento.";
          }
        }, 100); // Pequeña pausa antes de reiniciar
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      error.value = event.error;
      isListening.value = false;
      if (inactivityTimer) clearTimeout(inactivityTimer);
      onClear(); // Limpiar subtítulos en caso de error
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const currentText = finalTranscript || interimTranscript;
      if (currentText && currentText.trim() !== '') {
        onResult(currentText);
        resetInactivityTimer();
      }
    };
  } else {
    error.value = 'La API de reconocimiento de voz no es compatible con este navegador. Por favor, usa Google Chrome.';
  }

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      console.log("Temporizador de inactividad expirado. Limpiando subtítulos.");
      onClear();
    }, TIMEOUT_DURATION);
  };

  const start = () => {
    if (recognition && !isListening.value) {
      recognition.lang = sourceLang; // Asegurarse de que el idioma esté actualizado al iniciar
      recognition.start();
    }
  };

  const stop = () => {
    if (recognition && isListening.value) {
      recognition.stop();
      if (inactivityTimer) clearTimeout(inactivityTimer);
      onClear(); // Limpiar inmediatamente al detener manualmente
    }
  };

  onUnmounted(() => {
    stop();
  });

  return {
    isListening,
    error,
    start,
    stop,
  };
}
