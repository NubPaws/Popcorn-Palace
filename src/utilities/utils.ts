/**
 * Removes all undefined and null values from the object.
 * @param obj Object to be changed in place.
 */
export function deleteEmpties(obj: any) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  }
}
