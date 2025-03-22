import { applyDecorators } from '@nestjs/common';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export function IsValidString(propertyName: string = 'Property') {
  return applyDecorators(
    IsString({ message: `${propertyName} must be a valid string.` }),
    IsNotEmpty({ message: `${propertyName} must be non-empty.` }),
  );
}

export function IsInRange(propertyName: string, min: number, max: number) {
  return applyDecorators(
    IsDecimal({}, { message: `${propertyName} must be a decimal number.` }),
    Min(min, {
      message: `${propertyName} must be greater than or equal to${min}.`,
    }),
    Max(max, {
      message: `${propertyName} must be greater than or equal to ${max}`,
    }),
  );
}

export function IsPositiveInteger(propertyName: string) {
  return applyDecorators(
    IsInt({ message: `${propertyName} must be a whole number.` }),
    IsPositive({ message: `${propertyName} must be a positive number.` }),
  );
}
