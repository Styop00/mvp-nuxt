/**
 * Converts an object's keys from camelCase to snake_case
 */
export function camelToSnake(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const snakeCaseObj: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      snakeCaseObj[snakeKey] = camelToSnake(obj[key]);
    }
  }
  
  return snakeCaseObj;
}


