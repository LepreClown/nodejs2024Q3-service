import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  year?: number;

  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;
}
