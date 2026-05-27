import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadedFileLike } from '../registration/types/files.types';

@Injectable()
export class OcrService {
    constructor(private cloudinaryService: CloudinaryService) {}

  async extractPassport(files: UploadedFileLike[]) {
    await this.cloudinaryService.uploadImage(files);
    const result = await Tesseract.recognize(files[0].buffer!, 'eng');
    return this.parsePassport(result.data.text);
  }

  private parsePassport(text: string) {
    const lines = text.replace(/\r/g, '').split('\n');

      const fullText = lines.join(' ');

  const birthDate = fullText.match(/\d{4}-\d{2}-\d{2}/)?.[0];

  const passportNumber = fullText.match(/[A-Z0-9]{6,9}/)?.[0];

  console.log(birthDate, passportNumber);
  
    
    // return {
    //   firstName: '',
    //   lastName: '',
    //   passportNumber: '',
    //   birthDate: '',
    //   citizenship: '',
    // };
  }
}
