import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({
    type: "string",
  })
  @IsMobilePhone("uz-UZ")
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
