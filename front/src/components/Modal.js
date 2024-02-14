const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" onClick={onClose}>
      <div className="fixed inset-0 transition-opacity duration-500 flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" 
             onClick={e => e.stopPropagation()}
             style={{ 
               animation: `${isOpen ? "modalIn" : "modalOut"} 0.5s forwards`
             }}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-auto max-h-96">
            {children}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={onClose} type="button" className="focus:outline-none text-white bg-sky-500 hover:bg-sky-400 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-sky-900">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Modal;
