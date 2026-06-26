import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateExamDto {
  @ApiProperty({ description: "Guruh ID" })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: "Imtihon boshlanish vaqti" })
  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ required: false, description: "Imtihon tugash vaqti" })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
