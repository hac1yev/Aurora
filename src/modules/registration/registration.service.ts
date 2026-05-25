import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { hashPassword } from 'src/utils';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { UploadedFileLike } from './types/files.types';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async handlePersonalDetailsStep(body: PersonalDetailsDto, files: UploadedFileLike[]) {
    
  }
}
