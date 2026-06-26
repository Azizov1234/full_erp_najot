import { Body, Controller, Post } from "@nestjs/common";
import { VerificationService } from "./verification.service";
import { SendOtpDto } from "./dto/verification.dto";
import { ApiBody } from "@nestjs/swagger";
import { ChangePasswordDto, SendPhoneVerifyDto, SendPhoneVerifyOtpDto } from "./dto/send-phone-verify.dto";


@Controller("verification")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("send")
  sendOtp(@Body() payload: any) {
    return this.verificationService.sendOtp(payload);
  }

    @ApiBody({
        type:SendPhoneVerifyDto
    })
    @Post("send/phone/verify")
    sendPhoneVerify(@Body() payload:SendPhoneVerifyDto){
      return this.verificationService.sendPhoneOtp(payload)

    }

    @Post("verify/otp")
    verifyOtp(@Body() payload:SendPhoneVerifyOtpDto){
        return this.verificationService.verifyOtp(payload)
    }

    @Post('change-password')
    changePassword(@Body() payload:ChangePasswordDto){
        return this.verificationService.changePassword(payload)
    }
    
}
