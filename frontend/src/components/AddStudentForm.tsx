import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Student } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddStudentFormProps {
  onSubmit: (data: Omit<Student, "id">) => void;
  onCancel: () => void;
  existingPhoneNumbers: string[];
  existingEmails: string[];
}

export function AddStudentForm({
  onSubmit,
  onCancel,
  existingPhoneNumbers,
  existingEmails,
}: AddStudentFormProps) {
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    type: "",
    amountPaid: "",
    dueAmount: "",
    discount: "",
    incentivesPaid: "",
    dateOfJoining: null as Date | null,
    inactiveOn: null as Date | null,
    activityStatus: "ACTIVE",
    inactivityReason: "",
    country: "",
    state: "",
    address: "",
    governmentIdProof: "",
  });

  /* ================= FORMAT DATE TO DD-MM-YYYY ================= */
  const formatToDDMMYYYY = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    /* ===== REQUIRED VALIDATION ===== */
    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.phoneNumber) return setError("Phone number is required");
    if (!formData.type) return setError("Type is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.dateOfJoining) return setError("Date of joining is required");
    if (!formData.country.trim()) return setError("Country is required");
    if (!formData.state.trim()) return setError("State is required");
    if (!formData.address.trim()) return setError("Address is required");
    if (!formData.governmentIdProof.trim())
      return setError("Government ID Proof is required");

    /* ===== PHONE VALIDATION ===== */
    if (!/^\d{12}$/.test(formData.phoneNumber)) {
      return setError("Phone number must be exactly 12 digits");
    }

    if (existingPhoneNumbers.includes(formData.phoneNumber)) {
      return setError("Phone number already exists");
    }

    /* ===== EMAIL VALIDATION ===== */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Invalid email format");
    }

    if (existingEmails.includes(formData.email.toLowerCase())) {
      return setError("Email already exists");
    }

    /* ===== NUMBER VALIDATION ===== */
    const amountPaid = Number(formData.amountPaid || 0);
    const dueAmount = Number(formData.dueAmount || 0);
    const discount = Number(formData.discount || 0);
    const incentivesPaid = Number(formData.incentivesPaid || 0);

    if (
      amountPaid < 0 ||
      dueAmount < 0 ||
      discount < 0 ||
      incentivesPaid < 0
    ) {
      return setError("Amounts cannot be negative");
    }

    /* ===== INACTIVE VALIDATION ===== */
    if (
      formData.activityStatus === "INACTIVE" &&
      !formData.inactivityReason.trim()
    ) {
      return setError("Inactivity reason is required");
    }

  /* ===== FINAL PAYLOAD ===== */
  const payload: Omit<Student, "id"> = {
    ...formData,
    amountPaid,
    dueAmount,
    discount,
    incentivesPaid,
    dateOfJoining: formData.dateOfJoining
      ? formatToDDMMYYYY(formData.dateOfJoining.toISOString().split("T")[0])
      : "",
    inactiveOn: formData.inactiveOn
      ? formatToDDMMYYYY(
          formData.inactiveOn.toISOString().split("T")[0]
        )
      : "",
    inactivityReason: formData.inactivityReason || "",
  };

  onSubmit(payload);
};



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-4">

        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        {/* PHONE FIELD */}
        <Input
          placeholder="Phone (12 digits)"
          value={formData.phoneNumber}
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^\d*$/.test(value)) return;
            if (value.length > 12) return;
            handleChange("phoneNumber", value);
          }}
        />

        <Input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <select
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Type</option>
          <option value="STUDENT">STUDENT</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="MENTOR"> MENTOR</option>
          <option value="LEARNER">LEARNER</option>
          <option value="JOB_SEEKER">JOB SEEKER</option>
          <option value="PAID_INTERN">PAID INTERN</option>
          <option value="UNPAID_INTERN">UNPAID INTERN</option>
        </select>

        <Input type="number" placeholder="Amount Paid"
          value={formData.amountPaid}
          onChange={(e) => handleChange("amountPaid", e.target.value)}
        />

        <Input type="number" placeholder="Due Amount"
          value={formData.dueAmount}
          onChange={(e) => handleChange("dueAmount", e.target.value)}
        />

        <Input type="number" placeholder="Discount"
          value={formData.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
        />

        <Input type="number" placeholder="Incentives Paid"
          value={formData.incentivesPaid}
          onChange={(e) => handleChange("incentivesPaid", e.target.value)}
        />

        <div>
  <DatePicker
    selected={formData.dateOfJoining}
    onChange={(date: Date | null) =>
      handleChange("dateOfJoining", date)
    }
    dateFormat="dd-MM-yyyy"
    placeholderText="dd-mm-yyyy"
    className="w-full border rounded px-3 py-2 text-sm"
  />
</div>

        <div>
  <DatePicker
    selected={formData.inactiveOn}
    onChange={(date: Date | null) =>
      handleChange("inactiveOn", date)
    }
    dateFormat="dd-MM-yyyy"
    placeholderText="dd-mm-yyyy"
    className="w-full border rounded px-3 py-2 text-sm"
  />
</div>

        <Input
          placeholder="Country"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />

        <Input
          placeholder="State"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />

        <Input
          className="col-span-2"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <Input
          className="col-span-2"
          placeholder="Government ID Proof"
          value={formData.governmentIdProof}
          onChange={(e) => handleChange("governmentIdProof", e.target.value)}
        />

        <div className="col-span-2">
          <label className="text-sm font-medium">Activity Status</label>
          <select
            value={formData.activityStatus}
            onChange={(e) => handleChange("activityStatus", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {formData.activityStatus === "INACTIVE" && (
          <div className="col-span-2">
            <Input
              placeholder="Inactivity Reason"
              value={formData.inactivityReason}
              onChange={(e) =>
                handleChange("inactivityReason", e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onCancel}
          className="bg-red-600 text-white"
        >
          Cancel
        </Button>

        <Button type="submit">Add Student</Button>
      </div>
    </form>
  );
}
