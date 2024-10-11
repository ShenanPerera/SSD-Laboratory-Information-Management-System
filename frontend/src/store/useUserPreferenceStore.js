import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserPreferenceStore = create(
    persist(
        (set) => ({
            permissions: [],
            setPermissions: (newPermissions) => set({ permissions : newPermissions }),
            resetPermissions: () => set({ permissions: [] , accessToken: null }),
}),
{
    name: 'user-preference',
    getStorage: () => localStorage,
}
    )
);

export default useUserPreferenceStore;