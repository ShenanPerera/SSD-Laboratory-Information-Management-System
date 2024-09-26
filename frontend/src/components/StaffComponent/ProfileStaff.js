import {  useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import withPermission from "../../UtillFuntions/withPermission";
import Permission from "../../UtillFuntions/Permission";


const ProfileStaff = ({Staff}) => {
    
    
    return(
        <div className="container">
            <h4>{Staff.name}</h4>
            <p><strong>Name</strong>{Staff.NIC}</p>
            
        </div>
    )
}



export default withPermission(ProfileStaff, [Permission.MEDICAL_LAB_TECHNICIAN, Permission.LAB_ASSISTANT, Permission.RECEPTIONIST]);