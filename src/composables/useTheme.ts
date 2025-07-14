import { computed } from 'vue'
import { useSettings } from './useSettings'

export function useTheme() {
    const { state } = useSettings()

    // Computed que usa el estado global
    const isDark = computed({
        get: () => state.isDarkMode,
        set: (value: boolean) => {
            state.isDarkMode = value
        }
    })

    return { isDark }
}
