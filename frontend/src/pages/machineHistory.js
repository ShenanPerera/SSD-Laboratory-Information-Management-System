import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MachineDetails from "../components/machineComponent/machineDetails";
import "../css/MachineStyles/machineDetails.css"
import withPermission from "../UtillFuntions/withPermission";
import Permission from "../UtillFuntions/Permission";

const ViewMachineHistory = () => {

    const { id } = useParams();

    const [machine,setMachine] = useState(null);

    useEffect(() => {
        const fetchMachineHistory = async() => {
            const response = await fetch('/api/machines/' + id);
            const json = await response.json();

            if( response.ok ) {
                await setMachine(json);
            }
        }
             
        fetchMachineHistory();
        // eslint-disable-next-line 
    }, [])


    return (
        <div className="viewTest">
            <div className="tests">
                <h3>Machine History</h3>
                { machine ? <MachineDetails key={machine._id} machine = {machine} /> : <div className="loading">Loading...</div>}
            </div>
            
        </div>
    );
}
 
export default withPermission(ViewMachineHistory, [Permission.ADMIN, Permission.LAB_ASSISTANT, Permission.MEDICAL_LAB_TECHNICIAN]);