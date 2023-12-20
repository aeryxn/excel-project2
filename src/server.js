import Express from "express";
import cors from "cors";
import sql from "mssql";

const app = Express();
const PORT = process.env.PORT || 3009;

app.use(Express.json());
app.use(cors());

const config = {
  user: "sa",
  password: "Just4admin!",
  server: "192.168.1.20",
  database: "FITINCUDB",
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
    trustedConnection: true,
  },
};

// API endpoint for handling form submission and inserting data into the SQL Server database
app.post("/api/insert", async (req, res) => {
  try {
    const excelData = req.body.dataArray;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Your INSERT statement
    const result = await pool
      .request()
      .input("snagAngle1", sql.NVarChar, excelData[34])
      .input("snagTorque1", sql.NVarChar, excelData[33])
      .input("ultimateTth1", sql.NVarChar, excelData[32])
      .input("ultimateSL1", sql.NVarChar, excelData[31])
      .input("ultimateStress1", sql.NVarChar, excelData[30])
      .input("ultimateF1", sql.NVarChar, excelData[29])
      .input("ultimateT1", sql.NVarChar, excelData[28])
      .input("plasticityTth1", sql.NVarChar, excelData[27])
      .input("plasticitySL1", sql.NVarChar, excelData[26])
      .input("plasticityAngle1", sql.NVarChar, excelData[25])
      .input("plasticityF1", sql.NVarChar, excelData[24])
      .input("plasticityT1", sql.NVarChar, excelData[23])
      .input("yieldTth1", sql.NVarChar, excelData[22])
      .input("yieldSl1", sql.NVarChar, excelData[21])
      .input("yieldAngle1", sql.NVarChar, excelData[20])
      .input("yieldStress1", sql.NVarChar, excelData[19])
      .input("yieldF1", sql.NVarChar, excelData[18])
      .input("yieldT1", sql.NVarChar, excelData[17])
      .input("surfaceTorque1", sql.NVarChar, excelData[16])
      .input("threadTorque1", sql.NVarChar, excelData[15])
      .input("surfaceFriction1", sql.NVarChar, excelData[14])
      .input("threadFriction1", sql.NVarChar, excelData[13])
      .input("totalFriction1", sql.NVarChar, excelData[12])
      .input("TBTorqueK1", sql.NVarChar, excelData[11])
      .input("TthTorqueK1", sql.NVarChar, excelData[10])
      .input("torqueK1", sql.NVarChar, excelData[9])
      .input("stretchedLength1", sql.NVarChar, excelData[8])
      .input("rotationAngle1", sql.NVarChar, excelData[7])
      .input("clampForce1", sql.NVarChar, excelData[6])
      .input("tighteningTorque1", sql.NVarChar, excelData[5])
      .input("itemNo1", sql.NVarChar, excelData[4])
      .input("testDate1", sql.Date, excelData[3])
      .input("testNo1", sql.NVarChar, excelData[2])
      .input("fileLoc1", sql.NVarChar, excelData[1])
      .input("groupNo", sql.NVarChar, excelData[0])
      .query(`INSERT INTO torque_ten_tests (group_no, file_loc, test_no, test_date, itemno, tightening_torque_Nm, clamp_force_kN, rotation_angle_deg, stretched_length_mm, hash_torque_k, Tth_torque_k, TB_torque_k, hash_total_friction, hash_thread_friction, hash_surface_friction, thread_torque_Nm, surface_torque_Nm, hash_yield_t_Nm, hash_yield_f_kN, yield_stress_kN_mm2, Yield_angle_deg, yield_sl_mm, yield_Tth_Nm, plasticity_t_Nm, plasticity_f_kN, plasticity_angle_deg, plasticity_sl_mm, plasticity_Tth_Nm, hash_ultimate_t_Nm, hash_ultimate_f_kN, ultimate_stress_kN_mm2, ultimate_sl_mm, ultimate_Tth_Nm, snag_torque_Nm, snag_angle_deg)
      VALUES (@groupNo, @fileLoc1, @testNo1, @testDate1, @itemNo1, @tighteningTorque1, @clampForce1, @rotationAngle1, @stretchedLength1, @torqueK1, @TthTorqueK1, @TBTorqueK1, @totalFriction1, @threadFriction1, @surfaceFriction1, @threadTorque1, @surfaceTorque1, @yieldT1, @yieldF1, @yieldStress1, @yieldAngle1, @yieldSl1, @yieldTth1, @plasticityT1, @plasticityF1, @plasticityAngle1, @plasticitySL1, @plasticityTth1, @ultimateT1, @ultimateF1, @ultimateStress1, @ultimateSL1, @ultimateTth1, @snagTorque1, @snagAngle1)
    `);

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error inserting data into the database",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
