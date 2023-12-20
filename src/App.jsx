import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import axios from "axios";

function App() {
  const [excelData, setExcelData] = useState(null);
  const [extractedData1, setExtractedData1] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files) {
      let f = e.target.files[0];

      var reader = new FileReader();

      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false,
        });
        const extractedData = [];
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i][0] !== null) {
            // Iterate through each cell in the row and replace undefined with null
            for (let j = 0; j < jsonData[i].length; j++) {
              if (jsonData[i][j] === undefined) {
                jsonData[i][j] = null;
              }
            }
            const rowData = jsonData[i];

            if (rowData[1]) {
              // Split the data into multiple columns
              const columnData = rowData[1];
              const col1 = columnData.substring(0, 42);
              const col2 = columnData.substring(43, 46);
              const col3 = columnData.substring(46, 63);
              const col4 = columnData.substring(64, 80);

              // Remove the original second column
              rowData.splice(1, 1);

              // Add the new columns to the existing row
              rowData.splice(1, 0, col1, col2, col3, col4);
            }
            // Add the rowData to extractedData
            extractedData.push(rowData);
          }
        }
        const filteredData = extractedData.filter((row) => row[0] !== null);
        setExtractedData1(filteredData);
        setExcelData(extractedData);
      };
      reader.readAsBinaryString(f);
    }
  };
  const sendData = async () => {
    try {
      // Loop through each array in extractedData1 and send it to the server
      for (const dataArray of extractedData1) {
        const response = await axios.post("http://localhost:3009/api/insert", {
          dataArray,
        });
      }
    } catch (error) {
      console.error("Error submitting form data to the server", error);
    }
  };

  return (
    <>
      <div className="wholeDiv">
        <h2 className="title">Torque Tension Data Collector</h2>
        <input className="fileInput" type="file" onChange={handleFileChange} />
        {excelData && (
          <div className="excelData">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {excelData[0].map((header, index) => (
                      <th key={index}>{header || `Column ${index + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="dbButton" onClick={sendData}>
              Send To Database
            </button>
            <p className="successMessage">{status}</p>
          </div>
        )}
      </div>
      {!excelData && <h3>Select your excel sheet to display data</h3>}
    </>
  );
}

export default App;
