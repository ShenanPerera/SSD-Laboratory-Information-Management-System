import useUserPreferenceStore from "../store/useUserPreferenceStore";
import { useAuthContext } from "./useAuthContext";


export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const resetPermissions = useUserPreferenceStore.getState().resetPermissions;

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({type: 'LOGOUT'})
        resetPermissions()
    }

    return {logout}
}