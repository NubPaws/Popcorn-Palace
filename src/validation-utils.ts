import { applyDecorators } from '@nestjs/common';
import { IsDecimal, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export function IsValidString(propertyName: string = 'Property') {
  return applyDecorators(
    IsString({ message: `${propertyName} must be a valid string.` }),
    IsNotEmpty({ message: `${propertyName} must be non-empty.` }),
  );
}

export function IsInRange(propertyName: string, min: number, max: number) {
  return applyDecorators(
    IsDecimal(),
    Min(min, {
      message: `${propertyName} must be greater than or equal to${min}.`,
    }),
    Max(max, {
      message: `${propertyName} must be greater than or equal to ${max}`,
    }),
  );
}
