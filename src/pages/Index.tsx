
import React, { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import PrescriptionManager from '@/components/PrescriptionManager';

interface Doctor {
  id: string;
  name: string;
  title: string;
  registrationNumber: string;
  phone: string;
  email: string;
}

const Index = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const handleLogin = (doctorData: Doctor) => {
    setDoctor(doctorData);
  };

  const handleLogout = () => {
    setDoctor(null);
  };

  if (!doctor) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <PrescriptionManager doctor={doctor} onLogout={handleLogout} />;
};

export default Index;
