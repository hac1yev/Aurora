import { ApiProperty } from '@nestjs/swagger';
import { PersonalDetailsDto } from './personal-details.dto';
import { UploadedFileLike } from '../types/files.types';

export class RegistrationStepOneRequestDto extends PersonalDetailsDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Attach 1 or 2 files',
  })
  files!: UploadedFileLike[];
}
