import MachineForm from "../components/machineComponent/MachineForm"
import "../css/MachineStyles/machineDetails.css"
import withPermission from "../UtillFuntions/withPermission";
import Permission from "../UtillFuntions/Permission";

const AddMachines = () => {
     return ( 
        <div className="history">
            <h4>Add New Machines</h4>
            <div className="machines">
                <MachineForm/>
            </div>
        </div>
     );
}
 
export default withPermission(AddMachines, [Permission.ADMIN, Permission.LAB_ASSISTANT]);