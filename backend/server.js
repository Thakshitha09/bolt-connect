require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ================= DATE FORMAT HELPER ================= */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

/* ================= SEARCH BY PHONE NUMBER ================= */
app.get("/students/phone/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params;

  db.query(
    "SELECT * FROM students WHERE phoneNumber = ?",
    [phoneNumber],
    (err, results) => {
      if (err) {
        console.error("PHONE SEARCH ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(results[0]);
    }
  );
});

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
    formatDate(dateOfJoining),
    formatDate(inactiveOn),
    activityStatus === "INACTIVE" ? "INACTIVE" : "ACTIVE",
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

    const newStudentId = result.insertId;

    /* ===== LOG ADD ===== */
    db.query(
      `INSERT INTO logs 
       (adminName, adminEmail, action, studentName, studentId, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "Admin",
        "admin@example.com",
        "ADD",
        name,
        newStudentId,
        `Added student ${name}`,
      ],
      (logErr) => {
        if (logErr) console.error("LOG INSERT ERROR:", logErr);
      }
    );

    res.json({
      message: "Student added successfully ✅",
      id: newStudentId,
    });
  });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { adminName, adminEmail } = req.body;

  db.query(
    `INSERT INTO logs 
     (adminName, adminEmail, action, details)
     VALUES (?, ?, ?, ?)`,
    [
      adminName || "Admin",
      adminEmail || "admin@example.com",
      "LOGIN",
      "Admin logged in",
    ],
    (err) => {
      if (err) {
        console.error("LOGIN LOG ERROR:", err);
        return res.status(500).json({ error: "Login log failed" });
      }

      res.json({ message: "Login successful" });
    }
  );
});


/* ================= LOGOUT ================= */
app.post("/logout", (req, res) => {
  const { adminName, adminEmail } = req.body;

  db.query(
    `INSERT INTO logs 
     (adminName, adminEmail, action, details)
     VALUES (?, ?, ?, ?)`,
    [
      adminName || "Admin",
      adminEmail || "admin@example.com",
      "LOGOUT",
      "Admin logged out",
    ],
    (err) => {
      if (err) {
        console.error("LOGOUT LOG ERROR:", err);
        return res.status(500).json({ error: "Logout log failed" });
      }

      res.json({ message: "Logout logged successfully" });
    }
  );
});


/* ================= UPDATE STUDENT ================= */
app.put("/students/:id", (req, res) => {
  const { id } = req.params;

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
    formatDate(req.body.inactiveOn),
    req.body.activityStatus,
    req.body.inactivityReason,
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

    /* ===== LOG EDIT ===== */
    db.query(
      `INSERT INTO logs 
       (adminName, adminEmail, action, studentName, studentId, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "Admin",
        "admin@example.com",
        "EDIT",
        req.body.name,
        id,
        `Edited student ${req.body.name}`,
      ],
      (logErr) => {
        if (logErr) console.error("LOG INSERT ERROR:", logErr);
      }
    );

    res.json({ message: "Student updated successfully ✅" });
  });
});

/* ================= DELETE STUDENT ================= */
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT name FROM students WHERE id = ?", [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentName = result[0].name;

    db.query("DELETE FROM students WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({ error: "Delete failed" });
      }

      /* ===== LOG DELETE ===== */
      db.query(
        `INSERT INTO logs 
         (adminName, adminEmail, action, studentName, studentId, details)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "Admin",
          "admin@example.com",
          "DELETE",
          studentName,
          id,
          `Deleted student ${studentName}`,
        ],
        (logErr) => {
          if (logErr) console.error("LOG INSERT ERROR:", logErr);
        }
      );

      res.json({ message: "Student deleted successfully ✅" });
    });
  });
});

/* ================= GET LOGS ================= */
app.get("/logs", (req, res) => {
  db.query("SELECT * FROM logs ORDER BY timestamp DESC", (err, results) => {
    if (err) {
      console.error("LOG FETCH ERROR:", err);
      return res.status(500).json({ error: "Failed to fetch logs" });
    }
    res.json(results);
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
