import { useLocation } from "react-router-dom";
import { useEffect , useState } from "react";
import MachinePartsForm from "../components/machineComponent/machinePartsForm"
import withPermission from "../UtillFuntions/withPermission";
import Permission from "../UtillFuntions/Permission";

const AddMachineParts = () => {

    const  {state} = useLocation()
    const [machine,setMachine] = useState(null);
    
    useEffect(() => {
        const fetchMachineHistory = async() => {
            const response = await fetch('/api/machines/' + state.id);
            const json = await response.json();
            console.log(json);
            if( response.ok ) {
                await setMachine(json);
            }
        }
             
        fetchMachineHistory();
        // eslint-disable-next-line
    }, [])
    // console.log(state.id);

     return ( 
        <div className="history">
            <div className="machines">
                <h4>Add Machine Parts</h4>
                {machine && <MachinePartsForm machine = {machine}/>}
            </div>
        </div>
     );
}
 
export default withPermission(AddMachineParts, [Permission.ADMIN, Permission.MEDICAL_LAB_TECHNICIAN]);