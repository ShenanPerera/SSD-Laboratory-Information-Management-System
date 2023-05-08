import React, { useEffect, useRef, useState} from 'react';
import { useParams } from "react-router-dom"
import ReactToPrint from 'react-to-print';
import logo from '../assets/common/mediLineLogo.webp';
import '../css/TestResultStyles/testResultPreview.css'

const FinancialReport = () => {
  const componentRef = useRef();
  const [labInfo, setLabInfo] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [billTotal, setBillTotal] = useState()
  const [machineTotal, setMachineTotal] = useState()
  const [machineMTotal, setMachineM] = useState()
  const [machineServiceTotal, setMachineService] = useState()

  

  useEffect(() => {
    const fetchLabInfo = async () => {
        try {
            const response = await fetch('/api/labInfo')
            const json = await response.json()
            if(response.ok){
                setLabInfo(json);
                console.log(labInfo)
            } 
        } catch (error) {
            console.log(error)
        }
    }
    fetchLabInfo();  
},[])

const handleGenarateReport = async (e) => {
  e.preventDefault();

  try {
    const billResponse = await fetch('/api/bills/');
    const billJson= await billResponse.json();
    if (billResponse.ok) {
      const filteredBills = billJson.filter(
        (bill) =>
          new Date(bill.createdAt) >= new Date(startDate) &&
          new Date(bill.createdAt) <= new Date(endDate)
      );
      const total = filteredBills.reduce(
        (acc, curr) => acc + parseFloat(curr.total),
        0
      );
      console.log(total);
      setBillTotal(total)
    
      }  

    const machineResponse = await fetch('/api/machines/');
    const machineJson = await machineResponse.json();
    if (machineResponse.ok) {
      const filteredMachines = machineJson.filter(
        (machines) =>
          new Date(machines.createdAt) >= new Date(startDate) &&
          new Date(machines.createdAt) <= new Date(endDate)
      );
      const total = filteredMachines.reduce(
        (acc, curr) => acc + parseFloat(curr.Price),
        0
      );
      console.log(total);
      setMachineTotal(total)
    }

  const maintainenceResponse = await fetch('/api/machineParts/');
  const maintainenceJson = await maintainenceResponse.json();
  if (maintainenceResponse.ok) {
    const filteredMaintenances = maintainenceJson.filter(
      (maintenances) =>
        new Date(maintenances.createdAt) >= new Date(startDate) &&
        new Date(maintenances.createdAt) <= new Date(endDate)
      );
    const total = filteredMaintenances.reduce(
     (acc, curr) => acc + parseFloat(curr.PriceOfMachinePart + curr.TechnicianPayment),
     0
      );
    console.log(total);
    setMachineM(total)
    }
    
  const serviceResponse = await fetch('/api/serviceMachines/');
  const serviceJson = await serviceResponse.json();
  if (serviceResponse.ok) {
    const filteredService = serviceJson.filter(
      (servicemachines) =>
        new Date(servicemachines.createdAt) >= new Date(startDate) &&
        new Date(servicemachines.createdAt) <= new Date(endDate)
    );
    const total = filteredService.reduce(
      (acc, curr) => acc + parseFloat(curr.TechnicianPayment),
      0
    );
    console.log(total);
    setMachineService(total)
  }
  
    
  } catch (error) {
    console.log(error);
  }

};
  




  return (
    <div>
      <div>
        <form  onSubmit={handleGenarateReport}>
        <label>Start Date</label>
            <input
             type="date"
             onChange={(e) => setStartDate(e.target.value)}
            />
            <label>End Date</label>
            <input
             type="date"
             onChange={(e) => setEndDate(e.target.value)}
            />
        <button type='submit'>Generate Report</button>    
        </form>
      </div>
      <div className="report" ref={componentRef}>
        <div className="reportHeader">
          <div className="reportLogo">
            <img src={logo} alt="logo" />
          </div>
          <div className="reportContact">
            <p class="info">Address : {labInfo?.address ?? 'null'}</p>
            <p class="info">Tel: {labInfo?.tel1 ?? 'null'} | {labInfo?.tel2 ?? 'null'} | {labInfo?.tel3 ?? 'null'}</p>
            <p class="info">Email: {labInfo?.email ?? 'null'}</p>
          </div>
        </div>
        <div className="reporthr">
          <hr />
        </div>
        <div className="reportHeading">
          <h2>Financial Report</h2>
        </div>
        <div className="reportBody">
         
        <div>
        <table className="table ">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Income(Rs:)</th>
                <th scope="col">Expenses(Rs:)</th>
                
              </tr>
             
            </thead>
           
           <tbody>
            <tr>
                <td>sales</td>
                <td>{billTotal}</td>
                <td>-</td>
            </tr>
            

           </tbody>

          

           <tbody>
               <tr>
                <td>inventry</td>
                <td>-</td>
                <td>500</td>
                </tr> 

                <tr>
                <td>machine</td>
                <td>-</td>
                <td>{machineTotal}</td>
                </tr>

                <tr>
                <td>Machine Maintenence</td>
                <td>-</td>
                <td>{machineMTotal}</td>
                </tr>

                <tr>
                <td>Machine Services</td>
                <td>-</td>
                <td>{machineServiceTotal}</td>
                </tr>

                

           </tbody>

           <thead>
              <tr>
                <th>Total</th>
                <th>2000</th>
                <th>1000</th>
              </tr>
           </thead>




            </table>



        </div>
        </div>    
      </div>
      <div className="row my-3">
        <div className="col-12 d-flex justify-content-center">
          <ReactToPrint
            trigger={() => <button className="btnSubmit">Print</button>}
            content={() => componentRef.current}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
