require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
// ================= LOGS =================

// add log
app.post("/logs", (req, res) => {
  const {
    adminName,
    adminEmail,
    action,
    studentName,
    studentId,
    details,
  } = req.body;

  const sql = `
    INSERT INTO logs 
    (adminName, adminEmail, action, studentName, studentId, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [adminName, adminEmail, action, studentName, studentId, details],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Log stored" });
    }
  );
});

app.post("/logs", (req, res) => {
  const {
    action,
    studentId,
    studentName,
    adminName,
    adminEmail,
    details,
  } = req.body;

  const sql = `
    INSERT INTO logs
    (action, studentId, studentName, adminName, adminEmail, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [action, studentId, studentName, adminName, adminEmail, details],
    (err) => {
      if (err) {
        console.error("LOG INSERT ERROR:", err);
        return res.status(500).json({ error: "Log insert failed" });
      }
      res.json({ message: "Log saved" });
    }
  );
});


// get logs
app.get("/logs", (req, res) => {
  const sql = `
    SELECT *
    FROM logs
    ORDER BY createdAt DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});




/* =========================
   STUDENTS ROUTES
   ========================= */

// GET all students
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({ error: "Failed to fetch students" });
    }
    res.json(results);
  });
});

// POST add student
app.post("/students", (req, res) => {
  const {
    name,
    phoneNumber,
    type,
    email,
    amountPaid,
    dueAmount,
    discount,
    incentivesPaid,
    dateOfJoining,
    inactiveOn,
    activityStatus,
    inactivityReason,
    country,
    state,
    address,
    governmentIdProof,
  } = req.body;

  const sql = `
    INSERT INTO students (
      name, phoneNumber, type, email,
      amountPaid, dueAmount, discount, incentivesPaid,
      dateOfJoining, inactiveOn, activityStatus, inactivityReason,
      country, state, address, governmentIdProof
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    phoneNumber,
    type,
    email,
    amountPaid,
    dueAmount,
    discount,
    incentivesPaid,
    dateOfJoining,
    inactiveOn,
    activityStatus,
    inactivityReason,
    country,
    state,
    address,
    governmentIdProof,
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

// UPDATE student
app.put("/students/:id", (req, res) => {
  const { id } = req.params;

  const {
    name,
    phoneNumber,
    type,
    email,
    amountPaid,
    dueAmount,
    discount,
    incentivesPaid,
    dateOfJoining,
    inactiveOn,
    activityStatus,
    inactivityReason,
    country,
    state,
    address,
    governmentIdProof,
  } = req.body;

  const sql = `
    UPDATE students SET
      name = ?, phoneNumber = ?, type = ?, email = ?,
      amountPaid = ?, dueAmount = ?, discount = ?, incentivesPaid = ?,
      dateOfJoining = ?, inactiveOn = ?, activityStatus = ?, inactivityReason = ?,
      country = ?, state = ?, address = ?, governmentIdProof = ?
    WHERE id = ?
  `;

  const values = [
    name,
    phoneNumber,
    type,
    email,
    amountPaid,
    dueAmount,
    discount,
    incentivesPaid,
    dateOfJoining,
    inactiveOn,
    activityStatus,
    inactivityReason,
    country,
    state,
    address,
    governmentIdProof,
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

// SEARCH student by phone number
app.get("/students/phone/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params;

  const sql = "SELECT * FROM students WHERE phoneNumber = ?";
  db.query(sql, [phoneNumber], (err, results) => {
    if (err) return res.status(500).json({ error: "Search failed" });
    if (results.length === 0)
      return res.status(404).json({ message: "No student found" });

    res.json(results[0]);
  });
});


// DELETE student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: "Failed to delete student" });
    }

    res.json({ message: "Student deleted successfully" });
  });
});


// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
