import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { RegistrationService } from './registration.service';
import { UploadedFileLike } from './types/files.types';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { RegistrationStepOneRequestDto } from './dtos/personal-details-request-swagger.dto';
import { RegistrationStepOneResponseDto } from './dtos/personal-details-response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadValidationPipe } from 'src/shared/pipes/uploadValidation.pipe';

@Controller('registration')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Post('/personal-details')
  @ApiOperation({
    summary:
      'Registration Step 1 - Personal details, consent, and document upload',
    description:
      'Validates files, stores personal details + consent in Redis, and returns registration token.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: RegistrationStepOneRequestDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Files passed validation. Registration data stored successfully in Redis.',
    type: RegistrationStepOneResponseDto,
  })
  @ApiUnsupportedMediaTypeResponse({
    description:
      'This file type isn’t supported. Please upload a JPG, JPEG, PNG file.',
  })
  @ApiPayloadTooLargeResponse({
    description: 'This file is too large. The maximum size allowed is 10MB',
  })
  @ApiBadRequestResponse({
    description:
      'The selected file is empty. Please choose another file and try again. / The file name contains invalid characters. Please rename the file and try again. / You can upload up to 2 files at once.',
  })
  @UseInterceptors(FilesInterceptor('files', 2))
  @HttpCode(200)
  handleStepOne(
    @Body() body: PersonalDetailsDto,
    @UploadedFiles(new UploadValidationPipe()) files: UploadedFileLike[],
  ) {
    return this.registrationService.handlePersonalDetailsStep(body, files);
  }
}
