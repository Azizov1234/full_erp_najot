import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString, MinLength } from "class-validator";

export class SendPhoneVerifyDto{
    @ApiProperty()
    @IsString()
    @IsMobilePhone("uz-UZ")
    phone:string
}

export class SendPhoneVerifyOtpDto{
    @ApiProperty()
    @IsString()
    @IsMobilePhone("uz-UZ")
    phone:string

    @ApiProperty()
    @IsString()
    otp:string
}

export class ChangePasswordDto{
    @ApiProperty()
    @IsString()
    @IsMobilePhone("uz-UZ")
    phone:string

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    new_password:string
}