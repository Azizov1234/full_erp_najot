import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  room_id: number;

  @ApiProperty()
  @IsDateString()
  start_date: string;

  @ApiProperty()
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  week_day: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  max_students: number;

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  students?: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  teachers?: number[];
}
