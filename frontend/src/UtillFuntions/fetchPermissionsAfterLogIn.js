import useUserPreferenceStore from '../store/useUserPreferenceStore';
import fetchPermissions from '../UtillFuntions/fetchPermissions';

const fetchPermissionsAfterLogIn = async (options = {}) => {
    const {
        fetchFunction = fetchPermissions,
        afterSet = () => {},
        fetchOptions = {},
    }= options;

    const permissions = await fetchFunction(fetchOptions);
    console.log('permissions in fetchAfter:', permissions);

    const setPermissions = useUserPreferenceStore.getState().setPermissions; 
    setPermissions(permissions);
    afterSet(permissions);
};

export default fetchPermissionsAfterLogIn;
