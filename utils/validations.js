export function validateCafeForUpdate(cafeForUpdate, updateCafe = true) {
  const errors = [];

  if (!cafeForUpdate._id && updateCafe) {
    errors.push('id is required.');
  }

  if (!cafeForUpdate.name) {
    errors.push('name is required.');
  }

  if (!cafeForUpdate.description) {
    errors.push('description is required.');
  }

  if (!cafeForUpdate.location) {
    errors.push('location is required.');
  }

  if (!cafeForUpdate.logo || typeof cafeForUpdate.logo !== 'string') {
    errors.push('logo is missing or of incorrect format.');
  }

  return errors.length === 0;
}

export function validateEmployeeRequestBody(employee, updateEmployee = true) {
  const errors = [];

  if ((!employee.employee_id || !/^UI[0-9A-Za-z]{7}$/.test(employee.employee_id)) && updateEmployee) {
    errors.push('employee_id is required and must match the pattern /^UI[0-9A-Za-z]{7}$/');
  }

  if (!employee.name) {
    errors.push('name is required');
  }

  if (!employee.email_address || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(employee.email_address)) {
    errors.push('email_address is required and must be a valid email format');
  }

  if (!employee.phone_number || !/^[89][0-9]{7}$/.test(employee.phone_number)) {
    errors.push('phone_number is required and must match the pattern /^[89][0-9]{7}$/');
  }

  if (!employee.gender || !['Male', 'Female'].includes(employee.gender)) {
    errors.push('gender is required and must be one of "Male" or "Female"');
  }

  if (employee.start_date && isNaN(Date.parse(employee.start_date))) {
    errors.push('start_date must be a valid date');
  }

  return errors.length === 0;
}

export function computeDaysWorked(start_date) {
  return Math.floor((new Date() - new Date(start_date)) / (1000 * 60 * 60 * 24));
}