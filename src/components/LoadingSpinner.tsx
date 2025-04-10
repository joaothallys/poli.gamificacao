import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <FaSpinner className="animate-spin text-2xl text-blue-500" />
    </div>
  );
};

export default LoadingSpinner;