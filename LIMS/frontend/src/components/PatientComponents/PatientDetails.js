import { usePatientContext } from '../../hooks/usePatientContext';
import { Link, useNavigate } from 'react-router-dom';
import { DELETE_PATIENT } from '../../context/patientContextDeclarations';

const PatientDetails = ({ edit, patient }) => {
  const { dispatch } = usePatientContext();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const response = await fetch('/api/patients/' + patient._id, {
      method: 'DELETE',
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: DELETE_PATIENT, payload: json });
    }

    navigate('/patient-list');
    console.log('Patient Deleted');
  };

  return (
    <div className="container patientDetailBlock">
      <div className="row">
        {edit === true ? (
          <center>
            <h3 className="mb-3">Patient Profile</h3>
          </center>
        ) : (
          <div></div>
        )}
        <div className="col-12">
          <p>
            <strong>Name : </strong> {patient.firstName} {patient.lastName}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>
            <strong>NIC : </strong> {patient.NIC}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>
            <strong>Gender : </strong> {patient.gender}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>
            <strong>Telephone Number : </strong> {patient.tpNo}
          </p>
        </div>
      </div>
      {edit === true ? (
        <div className="container">
          <div className="row">
            <div className="col-6">
              <Link style={{ textDecoration: 'none' }} to={'./edit'}>
                <button
                  id="editProfileButton"
                  className="btn mt-4 px-4 d-block m-auto"
                >
                  Edit Account
                </button>
              </Link>
            </div>
            <div className="col-6">
              <Link style={{ textDecoration: 'none' }} to={''}>
                <button
                  id="deleteProfileButton"
                  className="btn mt-4 px-4 d-block m-auto"
                  onClick={handleDelete}
                >
                  Delete Account
                </button>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Link
                style={{ textDecoration: 'none' }}
                to={'./transactionHistory'}
              >
                <button
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    fontSize: '1rem',
                    background: 'var(--orange)',
                    color: 'white',
                    borderRadius: '66px',
                  }}
                  className="btn mt-4 px-4 d-block m-auto"
                >
                  Transaction History
                </button>
              </Link>
            </div>
            <div className="col-6">
              <Link style={{ textDecoration: 'none' }} to={'./addBill'}>
                <button
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    fontSize: '1rem',
                    background: 'var(--orange)',
                    color: 'white',
                    borderRadius: '66px',
                  }}
                  className="btn mt-4 px-4 d-block m-auto"
                >
                  Add Bill
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PatientDetails;
