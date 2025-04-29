import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('image')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class CloudinaryController 
{
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  //Desc: Admin or User can upload image to cloudinary
  //Route: POST api/v1/image/upload
  //Access: Private (admin, user)
  @Roles(['admin', 'user'])
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile(new ParseFilePipe({validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024, message: 'The image size must not exceed 5MB'}), // 5MB
      new FileTypeValidator({ fileType: /jpeg|jpg|png|webp|gif/}),
    ],}),) 
    file: Express.Multer.File) 
  {
    return this.cloudinaryService.uploadFile(file);
  }

  //Desc: Admin or User can upload multiple images to cloudinary
  //Route: POST api/v1/image/uploads
  //Access: Private (admin)
  @Roles(['admin'])
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 5))
  uploadImages(@UploadedFiles(new ParseFilePipe({validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024, message:'Each image must not exceed 5MB'}), // 5MB
      new FileTypeValidator({ fileType: /jpeg|jpg|png|webp|gif/ }),
    ],}),)
  files: Express.Multer.File[],) 
  {
    return this.cloudinaryService.uploadMultipleFiles(files);
  }
}