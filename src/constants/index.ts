export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

type Doctor = {
  image: string;
  name: string;
  id: string
};

export const Doctors: Doctor[]= [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
    id: 'green'
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
    id: 'cameron'
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
    id: 'livingston'
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
    id: 'peter'
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
    id: 'powell'
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
    id: 'ramirez'
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
    id: 'Lee'
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
    id: 'cruz'
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    id: 'Sharma'
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};