import { useLocation } from 'react-router-dom';
import EditBill from '../components/BillComponent/EditBill';
import { useEffect, useState } from 'react';
import withPermission from '../UtillFuntions/withPermission';
import Permission from '../UtillFuntions/Permission';

const EditBillNew = () => {
  const location = useLocation();
  const [patient, setPatient] = useState();
  useEffect(() => {
    const fetchPatient = async () => {
      const response = await fetch('/api/patients/' + location.state.patientId);
      const json = await response.json();
      if (response.ok) {
        setPatient(json);
      }
    };

    fetchPatient();
  }, []);
  return <>{patient && <EditBill patient={patient} />}</>;
};

export default withPermission(EditBillNew, [
  Permission.ADMIN,
  Permission.LAB_ASSISTANT,
  Permission.RECEPTIONIST,
]);
