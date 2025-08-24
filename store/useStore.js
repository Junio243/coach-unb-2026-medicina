import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const storage =
    typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
          };

export const useStore = create(
    persist(
        (set) => ({
            isOnboardingComplete: false,
            profile: {
                availability: {},
                strengths: [],
                weaknesses: [],
            },
            accessibility: {
                highContrast: false,
                reduceMotion: false,
                fontSize: 1, // rem
                letterSpacing: 0, // px
                font: 'default',
            },
            completeOnboarding: (profile) => set({ isOnboardingComplete: true, profile }),
            setAccessibility: (settings) =>
                set((state) => ({
                    accessibility: { ...state.accessibility, ...settings },
                })),
        }),
        {
            name: 'coach-unb-storage',
            storage: createJSONStorage(() => storage),
        }
    )
);
