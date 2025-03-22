import { applyDecorators } from '@nestjs/common';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

/**
 * Custom decorator to validate a property as a non-empty string.
 *
 * @param propertyName Name of the property to display in error messages.
 * @returns A combined decorator that enforces a valid, non-empty string.
 */
export function IsValidString(propertyName: string = 'Property') {
  return applyDecorators(
    IsString({ message: `${propertyName} must be a valid string.` }),
    IsNotEmpty({ message: `${propertyName} must be non-empty.` }),
  );
}

/**
 * Custom decorator to validate a numeric property within a specified range.
 *
 * @param propertyName Name of the property to display in error messages.
 * @param min Minimum allowed value (inclusive).
 * @param max Maximum allowed value (inclusive).
 * @returns A combined decorator that enforces number range validation.
 */
export function IsInRange(propertyName: string, min: number, max: number) {
  return applyDecorators(
    IsNumber({}, { message: `${propertyName} must be a decimal number.` }),
    Min(min, {
      message: `${propertyName} must be greater than or equal to${min}.`,
    }),
    Max(max, {
      message: `${propertyName} must be greater than or equal to ${max}`,
    }),
  );
}

/**
 * Custom decorator to validate a property as a positive integer.
 *
 * @param propertyName Name of the property to display in error messages.
 * @returns A combined decorator that enforces positive integer validation.
 */
export function IsPositiveInteger(propertyName: string) {
  return applyDecorators(
    IsInt({ message: `${propertyName} must be a whole number.` }),
    IsPositive({ message: `${propertyName} must be a positive number.` }),
  );
}

/**
 * Custom decorator to validate that a numeric property is non-negative (zero or more).
 *
 * @param propertyName Name of the property to display in error messages.
 * @returns A decorator that enforces a minimum value of 0.
 */
export function IsNonNegative(propertyName: string) {
  return applyDecorators(
    Min(0, { message: `${propertyName} must be greater than or equal to 0.` }),
  );
}
