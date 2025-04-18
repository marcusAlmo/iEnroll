import { ApiProperty } from '@nestjs/swagger';

class DocumentDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  size!: number;

  @ApiProperty({ type: String, nullable: true })
  createdAt!: Date | null;

  @ApiProperty({ type: String, nullable: true })
  uuid!: string | null;
}

export class UploadFileResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty({ type: DocumentDto })
  document!: DocumentDto;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  plugins?: Record<string, any>;
}
