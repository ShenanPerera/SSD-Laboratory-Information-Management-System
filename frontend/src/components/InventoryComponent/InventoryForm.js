import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Permission from '../../UtillFuntions/Permission';
import withPermission from '../../UtillFuntions/withPermission';

const TestDataz = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [formData, setFormData] = useState({
    inveType: '',
    proName: '',
    exDate: '',
    quantity: '',
  });

  useEffect(() => {
    // Fetch CSRF token
    fetch('/api/csrf-token', {
      credentials: 'include' // Include credentials (cookies) to get CSRF token
    })
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => console.error('Error fetching CSRF token:', error));

    // Fetch inventory data
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventoryRoutes');
        const json = await response.json();
        if (response.ok) {
          setInventory(json);
          setIsLoaded(true);
        } else {
          throw new Error('Failed to fetch inventory');
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setError('Failed to load inventory. Please try again later.');
        setIsLoaded(true);
      }
    };
    fetchInventory();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sanitizedFormData = {
      inveType: DOMPurify.sanitize(formData.inveType),
      proName: DOMPurify.sanitize(formData.proName),
      exDate: DOMPurify.sanitize(formData.exDate),
      quantity: DOMPurify.sanitize(formData.quantity),
    };
    try {
      const response = await fetch('/api/inventoryRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(sanitizedFormData),
      });
      const json = await response.json();
      if (response.ok) {
        setInventory([...inventory, json]);
        setFormData({
          inveType: '',
          proName: '',
          exDate: '',
          quantity: '',
        });
        Swal.fire({
          title: 'Success',
          text: 'Successfully added new inventory item',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        setError(null);
        setEmptyFields([]);
      } else {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
        Swal.fire({
          title: 'Error',
          text: json.error,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An unexpected error occurred. Please try again.');
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h4>Add Inventory Item</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inveType">Inventory Type:</label>
          <input
            type="text"
            className={`form-control ${
              emptyFields.includes('inveType') ? 'error' : ''
            }`}
            id="inveType"
            name="inveType"
            value={formData.inveType}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="proName">Product Name:</label>
          <input
            type="text"
            className={`form-control ${
              emptyFields.includes('proName') ? 'error' : ''
            }`}
            id="proName"
            name="proName"
            value={formData.proName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exDate">Expire Date:</label>
          <input
            type="date"
            className={`form-control ${
              emptyFields.includes('exDate') ? 'error' : ''
            }`}
            id="exDate"
            name="exDate"
            value={formData.exDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            className={`form-control ${
              emptyFields.includes('quantity') ? 'error' : ''
            }`}
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </div>
        <br />
        <button className="btnConfirm" type="submit">
          Submit
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default withPermission(TestDataz, [
  Permission.ADMIN,
  Permission.LAB_ASSISTANT,
]);