import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SmsService } from '../service/sms.service';
import { ChangePasswordDto, SendPhoneVerifyDto } from './dto/send-phone-verify.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class VerificationService {
    constructor(
        private readonly smsService: SmsService,
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService
    ) { }

    private getMessage(phone: string, password: string) {
        return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: Login:${phone}_Parol:${password} Kodni hech kimga bermang!`
    }
    private getMessageOtp(otp: number) {
        return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`
    }

    private async getUserRoleandAndAccount(phone: string) {
        console.log(phone);
        const alternatePhone = phone.startsWith("+") ? phone.substring(1) : `+${phone}`;

        const student = await this.prisma.students.findFirst({
            where: {
                OR: [{ phone }, { phone: alternatePhone }],
            },
        });
        if (student) return { account: student, role: UserRole.STUDENT };

        const teacher = await this.prisma.teachers.findFirst({
            where: {
                OR: [{ phone }, { phone: alternatePhone }],
            },
        });
        if (teacher) return { account: teacher, role: UserRole.TEACHER };

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ phone }, { phone: alternatePhone }],
            },
        });
        if (user) return { account: user, role: user.role };

        return null;
    }

    async sendOtp(payload: any) {
        const { phone, password } = payload;

        if (!phone || !password) {
            throw new HttpException("Phone and password are required", HttpStatus.BAD_REQUEST);
        }

        await this.smsService.sendSMS(this.getMessage(phone, password), phone);

        return {
            success: true,
            message: "SMS sent successfully"
        };
    }

    async sendPhoneOtp(payload: SendPhoneVerifyDto) {
        const { phone } = payload;

        if (!phone) {
            throw new HttpException("Phone is required", HttpStatus.BAD_REQUEST);
        }

        const result = await this.getUserRoleandAndAccount(phone);

        if (!result || !result.account) {
            throw new BadRequestException("Taqiqlov");
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await this.redisService.set(phone, otp);

        let smsSent = false;
        try {
            await this.smsService.sendSMS(this.getMessageOtp(otp), phone);
            smsSent = true;
        } catch (smsError: any) {
            console.error("SMS yuborishda xatolik yuz berdi. Konsolga OTP yozilmoqda:", smsError.message || smsError);
        }

        console.log(`\n=========================================\n[OTP Verification] phone: ${phone} | OTP: ${otp}\n=========================================\n`);

        return {
            success: true,
            message: smsSent ? "SMS sent successfully" : "SMS delivery failed, fallback to console OTP",
            otp: otp
        };
    }

    async verifyOtp(payload: any) {
        const { phone, otp } = payload;

        if (!phone || !otp) {
            throw new HttpException("Phone and otp are required", HttpStatus.BAD_REQUEST);
        }

        const storedOtp = await this.redisService.get(phone);

        if (storedOtp !== otp) {
            throw new HttpException("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        const result = await this.getUserRoleandAndAccount(phone);

        if (!result || !result.account) {
            throw new BadRequestException("Taqiqlov");
        }

        await this.redisService.del(phone);
        await this.redisService.set(`${phone}_verifed`, result.account.id);

        return {
            success: true,
            role: result.role
        };
    }

    async changePassword(payload: ChangePasswordDto) {
        const { phone, new_password } = payload;

        if (!phone || !new_password) {
            throw new HttpException("Phone and password are required", HttpStatus.BAD_REQUEST);
        }

        const result = await this.getUserRoleandAndAccount(phone);

        if (!result || !result.account) {
            throw new BadRequestException("User mavjud emas");
        }

        if (!(await this.redisService.get(`${phone}_verifed`))) {
            throw new BadRequestException("Otp tekshirilmadi!!!");
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        if (result.role === UserRole.STUDENT)
            await this.prisma.students.update({
                where: { id: result.account.id },
                data: { password: hashedPassword }
            });
        else if (result.role === UserRole.TEACHER)
            await this.prisma.teachers.update({
                where: { id: result.account.id },
                data: { password: hashedPassword }
            });
        else
            await this.prisma.user.update({
                where: { id: result.account.id },
                data: { password: hashedPassword }
            });

        try {
            await this.smsService.sendSMS(this.getMessage(phone, new_password), phone);
        } catch (smsError: any) {
            console.error("SMS yuborishda xatolik yuz berdi (parol o'zgarishi):", smsError.message || smsError);
        }

        return {
            success: true,
            message: "Password changed successfully"
        };
    }
}
