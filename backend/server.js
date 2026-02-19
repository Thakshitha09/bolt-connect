require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ================= DATE FORMAT HELPER ================= */
const formatDate = (date) => {
  if (!date) return null;

  if (typeof date === "string" && date.includes("-")) {
    const parts = date.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  return d.toISOString().split("T")[0];
};

/* ================= GET ALL STUDENTS ================= */
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({ error: "Failed to fetch students" });
    }
    res.json(results);
  });
});

/* ================= ADD STUDENT ================= */
app.post("/students", (req, res) => {
  const formattedInactiveDate = formatDate(req.body.inactiveOn);

  // 🔥 AUTOMATIC STATUS LOGIC
  const finalStatus = formattedInactiveDate ? "INACTIVE" : "ACTIVE";

  const sql = `
    INSERT INTO students (
      name, phoneNumber, type, email,
      amountPaid, dueAmount, discount, incentivesPaid,
      dateOfJoining, inactiveOn, activityStatus, inactivityReason,
      country, state, address, governmentIdProof
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.name,
    req.body.phoneNumber,
    req.body.type,
    req.body.email,
    req.body.amountPaid,
    req.body.dueAmount,
    req.body.discount,
    req.body.incentivesPaid,
    formatDate(req.body.dateOfJoining),
    formattedInactiveDate,
    finalStatus,
    finalStatus === "INACTIVE" ? req.body.inactivityReason : "",
    req.body.country,
    req.body.state,
    req.body.address,
    req.body.governmentIdProof,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("INSERT ERROR:", err);
      return res.status(500).json({ error: "Failed to add student" });
    }

    res.json({
      message: "Student added successfully ✅",
      id: result.insertId,
    });
  });
});

/* ================= UPDATE STUDENT ================= */
app.put("/students/:id", (req, res) => {
  const { id } = req.params;

  const formattedInactiveDate = formatDate(req.body.inactiveOn);

  // 🔥 AUTOMATIC STATUS LOGIC
  const finalStatus = formattedInactiveDate ? "INACTIVE" : "ACTIVE";

  const sql = `
    UPDATE students SET
      name = ?, phoneNumber = ?, type = ?, email = ?,
      amountPaid = ?, dueAmount = ?, discount = ?, incentivesPaid = ?,
      dateOfJoining = ?, inactiveOn = ?, activityStatus = ?, inactivityReason = ?,
      country = ?, state = ?, address = ?, governmentIdProof = ?
    WHERE id = ?
  `;

  const values = [
    req.body.name,
    req.body.phoneNumber,
    req.body.type,
    req.body.email,
    req.body.amountPaid,
    req.body.dueAmount,
    req.body.discount,
    req.body.incentivesPaid,
    formatDate(req.body.dateOfJoining),
    formattedInactiveDate,
    finalStatus,
    finalStatus === "INACTIVE" ? req.body.inactivityReason : "",
    req.body.country,
    req.body.state,
    req.body.address,
    req.body.governmentIdProof,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("UPDATE ERROR:", err);
      return res.status(500).json({ error: "Failed to update student" });
    }

    res.json({ message: "Student updated successfully ✅" });
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
