
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, User } from "lucide-react";

interface Patient {
  id: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
}

interface PatientManagementProps {
  patients: Patient[];
  onPatientsChange: (patients: Patient[]) => void;
}

const PatientManagement = ({ patients, onPatientsChange }: PatientManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: ''
  });

  const addPatient = () => {
    if (!newPatient.fullName || !newPatient.idNumber || !newPatient.contactNumber) {
      return;
    }

    const patient: Patient = {
      ...newPatient,
      id: Math.random().toString(36).substr(2, 9)
    };

    onPatientsChange([...patients, patient]);
    setNewPatient({
      fullName: '',
      idNumber: '',
      dateOfBirth: '',
      gender: '',
      contactNumber: '',
      email: ''
    });
    setShowAddForm(false);
  };

  const removePatient = (id: string) => {
    onPatientsChange(patients.filter(patient => patient.id !== id));
  };

  const updateNewPatient = (field: keyof Omit<Patient, 'id'>, value: string) => {
    setNewPatient(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Add Patient Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Patients</h3>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Add New Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={newPatient.fullName}
                  onChange={(e) => updateNewPatient('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={newPatient.idNumber}
                  onChange={(e) => updateNewPatient('idNumber', e.target.value)}
                  placeholder="9001010001080"
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) => updateNewPatient('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value) => updateNewPatient('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={newPatient.contactNumber}
                  onChange={(e) => updateNewPatient('contactNumber', e.target.value)}
                  placeholder="+27123456789"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => updateNewPatient('email', e.target.value)}
                  placeholder="john.doe@email.com"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={addPatient} className="bg-green-600 hover:bg-green-700">
                Add Patient
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient List */}
      {patients.length > 0 && (
        <div className="space-y-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{patient.fullName}</h4>
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <div>ID: {patient.idNumber}</div>
                        {patient.dateOfBirth && <div>DOB: {patient.dateOfBirth}</div>}
                        {patient.gender && <div>Gender: {patient.gender}</div>}
                        <div>Phone: {patient.contactNumber}</div>
                        {patient.email && <div>Email: {patient.email}</div>}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removePatient(patient.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {patients.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No patients added yet. Click "Add Patient" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
