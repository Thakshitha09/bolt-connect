import { useForm, useWatch } from "react-hook-form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Student } from "../types";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Student>({
    defaultValues: student,
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
    // Clear inactive fields when reactivating
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
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
            className="mt-1"
          />
        </div>

        {/* PHONE */}
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

        {/* TYPE */}
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

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
            className="mt-1"
          />
        </div>

        {/* AMOUNTS */}
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

        {/* DATES */}
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

        {/* STATUS */}
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

        {/* INACTIVITY REASON */}
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

        {/* LOCATION */}
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

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
