import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { UploadedFileLike } from './types/files.types';
import { RedisService } from 'src/shared/modules/redis/redis.service';
import { OcrService } from '../ocr/ocr.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private redisService: RedisService,
    private ocrService: OcrService,
  ) {}

  async handlePersonalDetailsStep(
    body: PersonalDetailsDto,
    files: UploadedFileLike[],
  ) {
    const res = await this.ocrService.extractPassport(files);
    console.log(res);
  }
}
