import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  exports: [OcrService],
  imports: [CloudinaryModule],
  providers: [OcrService],
})
export class OcrModule {}
