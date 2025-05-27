export function getHeightInFeetInches(heightInInches) {
  if (!heightInInches || isNaN(heightInInches)) return 'N/A';
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches}"`;
}

export function getAge(birthDate) {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}