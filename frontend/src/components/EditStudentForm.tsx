import { useForm, useWatch } from "react-hook-form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Student } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditStudentFormProps {
  student: Student;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
  existingPhoneNumbers: string[];
}

export function EditStudentForm({
  student,
  onSubmit,
  onCancel,
  existingPhoneNumbers,
}: EditStudentFormProps) {

  /* ===== CONVERT YYYY-MM-DD → YYYY-MM-DD (SAFE FOR INPUT) ===== */
  const formatForInput = (date?: string) => {
    if (!date) return "";
    const parts = date.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
      // If stored as DD-MM-YYYY convert back
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return date;
  };

  /* ===== CONVERT TO DD-MM-YYYY BEFORE SUBMIT ===== */
  const formatToDDMMYYYY = (date?: string) => {
    if (!date) return undefined;
    const parts = date.split("-");
    if (parts.length !== 3) return undefined;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Student>({
    defaultValues: {
      ...student,
      dateOfJoining: formatForInput(student.dateOfJoining),
      inactiveOn: formatForInput(student.inactiveOn),
    },
  });

  const status = useWatch({
    control,
    name: "activityStatus",
  });

  const validatePhoneNumber = (value: string) => {
    if (!/^\d{12}$/.test(value)) {
      return "Phone number must be exactly 12 digits";
    }
    if (value !== student.phoneNumber && existingPhoneNumbers.includes(value)) {
      return "This phone number is already registered";
    }
    return true;
  };

  const onFormSubmit = (data: Student) => {

    // Convert date before sending to backend
    data.dateOfJoining = formatToDDMMYYYY(data.dateOfJoining);
    data.inactiveOn = formatToDDMMYYYY(data.inactiveOn);

    if (
      data.activityStatus === "ACTIVE" &&
      student.activityStatus === "INACTIVE"
    ) {
      data.inactivityReason = undefined;
      data.inactiveOn = undefined;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            {...register("phoneNumber", {
              required: "Phone number is required",
              validate: validatePhoneNumber,
            })}
            error={errors.phoneNumber?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register("type", { required: "Type is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
          >
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="PAID_INTERN">Paid Intern</option>
            <option value="UNPAID_INTERN">Unpaid Intern</option>
            <option value="STUDENT">Student</option>
            <option value="LEARNER">Learner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <Input type="number" {...register("amountPaid", { min: 0 })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Amount
          </label>
          <Input type="number" {...register("dueAmount", { min: 0 })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount
          </label>
          <Input type="number" {...register("discount", { min: 0 })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Incentives Paid
          </label>
          <Input type="number" {...register("incentivesPaid", { min: 0 })} />
        </div>

        {/* DATE FIELDS */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Joining
          </label>
          <Input type="date" {...register("dateOfJoining")} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Inactive On
          </label>
          <Input type="date" {...register("inactiveOn")} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("activityStatus")}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {status === "INACTIVE" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inactivity Reason
            </label>
            <textarea
              {...register("inactivityReason", {
                required: "Reason is required",
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300"
            />
            {errors.inactivityReason && (
              <p className="text-sm text-red-500 mt-1">
                {errors.inactivityReason.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <Input {...register("country")} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <Input {...register("state")} />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            {...register("address")}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Government ID Proof
          </label>
          <Input {...register("governmentIdProof")} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
