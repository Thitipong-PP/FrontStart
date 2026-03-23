export interface Dentist {
  id: string;
  name: string;
  yearsOfExperience: number;
  areaOfExpertise: string;
  image?: string;
}

export const dentists: Dentist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    yearsOfExperience: 15,
    areaOfExpertise: "Orthodontics & Cosmetic Dentistry",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    yearsOfExperience: 12,
    areaOfExpertise: "Oral Surgery & Implants",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    yearsOfExperience: 8,
    areaOfExpertise: "Pediatric Dentistry",
  },
  {
    id: "4",
    name: "Dr. James Anderson",
    yearsOfExperience: 20,
    areaOfExpertise: "Periodontics & Endodontics",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    yearsOfExperience: 10,
    areaOfExpertise: "General Dentistry & Teeth Whitening",
  },
  {
    id: "6",
    name: "Dr. David Lee",
    yearsOfExperience: 18,
    areaOfExpertise: "Prosthodontics & Dental Restoration",
  },
];
