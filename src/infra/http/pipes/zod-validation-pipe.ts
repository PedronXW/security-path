import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message:
            error.errors[0].message + ' in ' + error.errors[0].path.join('.'), // error.errors[0].message,
          statusCode: 400,
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
