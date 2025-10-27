import React, { useEffect, useState } from "react";
import axios from "axios";

function LaunchpadGallery() {
  const [launchpads, setLaunchpads] = useState([]);

  useEffect(() => {
    axios.get("/api/launchpad/list")
      .then(res => setLaunchpads(res.data))
      .catch(() => setLaunchpads([]));
  }, []);

  return (
    <div>
      <h3>Launchpad Vitrini</h3>
      <table>
        <thead>
          <tr>
            <th>Token Adresi</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
            <th>Fiyat</th>
            <th>Hard Cap</th>
            <th>Soft Cap</th>
          </tr>
        </thead>
        <tbody>
          {launchpads.map(lp => (
            <tr key={lp._id}>
              <td>{lp.tokenAddress}</td>
              <td>{lp.saleStart}</td>
              <td>{lp.saleEnd}</td>
              <td>{lp.price}</td>
              <td>{lp.hardCap}</td>
              <td>{lp.softCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LaunchpadGallery;