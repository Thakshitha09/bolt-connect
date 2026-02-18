import { Student } from '../types';
import { Modal } from './ui/Modal';

interface ViewStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

function ViewStudentModal({ student, isOpen, onClose }: ViewStudentModalProps) {

  /* ================= FORMAT TO DD-MM-YYYY ================= */
  const formatToDDMMYYYY = (date?: string) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const calculateExpiresIn = (inactiveOn?: string) => {
    if (!inactiveOn) return null;

    const today = new Date();
    const inactiveDate = new Date(inactiveOn);
    const diffTime = inactiveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days`;
  };

  const getExpiryStatus = (inactiveOn?: string) => {
    if (!inactiveOn) return null;

    const today = new Date();
    const inactiveDate = new Date(inactiveOn);
    const diffTime = inactiveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { type: 'EXPIRED', message: 'Membership expired' };
    }

    if (diffDays <= 7) {
      return {
        type: 'WARNING',
        message: `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
      };
    }

    return null;
  };

  const expiryStatus = getExpiryStatus(student.inactiveOn);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details">
      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phoneNumber}</p>
        <p><strong>Type:</strong> {student.type}</p>
        <p><strong>Status:</strong> {student.activityStatus}</p>

        <p>
          <strong>Date of Joining:</strong>{' '}
          {formatToDDMMYYYY(student.dateOfJoining)}
        </p>

        {student.inactiveOn && (
          <>
            <p>
              <strong>Expires On:</strong>{' '}
              {formatToDDMMYYYY(student.inactiveOn)}
            </p>

            <p>
              <strong>Expires In:</strong>{' '}
              {calculateExpiresIn(student.inactiveOn)}
            </p>

            {expiryStatus && (
              <p
                className={`font-semibold ${
                  expiryStatus.type === 'EXPIRED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {expiryStatus.message}
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export default ViewStudentModal;
