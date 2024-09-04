import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';
//useSWR allows the use of SWR inside function components

const ViewQr = () => { 
  const router = useRouter();
  const [qrList, setQrList] = useState([]);

  useEffect(() => {
    fetchQrs();
  },[])

  const fetchQrs = async() => {
    const { data } = await axios.get(`http://localhost:3000/v1/qr`);
    setQrList(data);
  }
  
  return (
    <div>
      <p>QR List</p>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Expiry</th>
            <th>Number of Usage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {qrList.map((qr, _index) => (
            <tr key={_index}>
              <td>{qr._id}</td>
              <td>{qr.expiry}</td>
              <td>{qr.numberOfUsage}</td>
              <td>{qr.isValid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
  
export default ViewQr;