import useUserPreferenceStore from "../store/useUserPreferenceStore";
import Swal from "sweetalert2";

const withPermission = (Component , requiredPermissions ) => {
    return (props) =>{
        
        
        const permissions = useUserPreferenceStore((state) => state.permissions);
        

        const hasPermission = requiredPermissions.some(permission => permissions.includes(permission));
        

        if(!hasPermission){
          Swal.fire({
            title: 'Access Denied',
            text: 'You do not have permission to access this page',
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
        })
        window.location.href = '/dashboard';
            return null;
        }

        return <Component {...props} />;
    }
  };


export default withPermission;