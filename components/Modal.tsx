interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  encouragement: string;
}

export default function Modal({ isOpen, onClose, encouragement }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <p className="text-xl text-blue-800 italic mb-6">
            &ldquo;{encouragement}&rdquo;
          </p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
