import { PrismaClient, UserRole, Status, StudentStatus, GroupStatus, HomeworkStatus, ExamStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed boshlandi...\n');

  // --- Clear data in correct dependency order ---
  console.log('🗑️  Eski ma\'lumotlar tozalanmoqda...');
  await prisma.examAnswer.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.homeWorkResult.deleteMany({});
  await prisma.homeWorkAnswer.deleteMany({});
  await prisma.homeWork.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.studentGroup.deleteMany({});
  await prisma.teachersGroup.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.courses.deleteMany({});
  await prisma.rooms.deleteMany({});
  await prisma.students.deleteMany({});
  await prisma.teachers.deleteMany({});
  
  // Re-seed SuperAdmin
  const phone = process.env.SUPERADMIN_PHONE || '+998996536494';
  const password = process.env.SUPERADMIN_PASSWORD || "Azizov_09";
  const passHash = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@crm.uz' },
    update: { password: passHash, full_name: 'Super Admin', phone, role: UserRole.SUPERADMIN, status: Status.active },
    create: { full_name: 'Super Admin', email: 'superadmin@crm.uz', password: passHash, phone, role: UserRole.SUPERADMIN, status: Status.active },
  });
  console.log(`✅ SuperAdmin: ${superAdmin.full_name}`);

  // Hashed password for seeded users
  const defaultUserPassword = await bcrypt.hash('password123', 10);

  // --- 1. Create 5 Teachers ---
  console.log('👥 5 ta O\'qituvchi yaratilmoqda...');
  const teachers = [];
  const teacherNames = [
    'Ali Valiev',
    'Zilola Karimova',
    'Sardor Rahimov',
    'Madina Rustamova',
    'Bobur Mansurov'
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const t = await prisma.teachers.create({
      data: {
        full_name: teacherNames[i],
        email: `teacher${i + 1}@crm.uz`,
        password: defaultUserPassword,
        phone: `+99890123450${i}`,
        address: `Toshkent shahri, ${i + 1}-mavze`,
        status: Status.active,
      }
    });
    teachers.push(t);
  }
  console.log(`✅ 5 ta O'qituvchi muvaffaqiyatli yaratildi.`);

  // --- 2. Create 20 Students ---
  console.log('👥 20 ta O\'quvchi yaratilmoqda...');
  const students = [];
  const studentNames = [
    'Diyorbek Abdujalilov', 'Asal Shokirova', 'Javohir Elmurodov', 'Shirin G\'ofurova', 'Rustam Hakimov',
    'Malika Solihova', 'Farrux Isoqov', 'Kamola Orifova', 'Sanjarbek Azimov', 'Laylo Toirova',
    'Iskandar Yusupov', 'Sevara Hasanova', 'Otabek G\'aniyev', 'Guli Ergasheva', 'Mirali Qodirov',
    'Rayhona Alimova', 'Jahongir Safarov', 'Dilnoza Hamidova', 'Shohruh Karimov', 'Nigora Yo\'ldosheva'
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const s = await prisma.students.create({
      data: {
        full_name: studentNames[i],
        email: `student${i + 1}@crm.uz`,
        password: defaultUserPassword,
        phone: `+9989355500${i < 10 ? '0' + i : i}`,
        address: `Toshkent, ${i + 1}-daha`,
        birth_date: new Date(`200${Math.floor(Math.random() * 5) + 3}-08-12`),
        status: StudentStatus.active,
      }
    });
    students.push(s);
  }
  console.log(`✅ 20 ta O'quvchi muvaffaqiyatli yaratildi.`);

  // --- 3. Create 4 Courses ---
  console.log('📚 4 ta Kurs yaratilmoqda...');
  const courseData = [
    { name: 'Frontend React.js', description: 'React.js kutubxonasi yordamida zamonaviy SPA ilovalar yaratish', price: 1200000, duration_month: 6, duration_hours: 144 },
    { name: 'Backend Node.js', description: 'Node.js, Express va NestJS yordamida API lar ishlab chiqish', price: 1400000, duration_month: 6, duration_hours: 144 },
    { name: 'UX/UI Design', description: 'Figma yordamida veb va mobil dizaynlarni tayyorlash', price: 1000000, duration_month: 4, duration_hours: 96 },
    { name: 'Mobile Flutter', description: 'Dart va Flutter yordamida krossplatformali mobil ilovalar yaratish', price: 1300000, duration_month: 5, duration_hours: 120 }
  ];
  const courses = [];
  for (const c of courseData) {
    const dbCourse = await prisma.courses.create({ data: c });
    courses.push(dbCourse);
  }

  // --- 4. Create 4 Rooms ---
  console.log('🚪 4 ta Xona yaratilmoqda...');
  const rooms = [];
  for (let i = 1; i <= 4; i++) {
    const r = await prisma.rooms.create({
      data: {
        name: `${i}-xona`,
        capacity: 15,
        status: Status.active
      }
    });
    rooms.push(r);
  }

  // --- 5. Create 4 Groups ---
  console.log('🏫 4 ta Guruh yaratilmoqda (har birida 5 tadan student)...');
  const groupNames = ['FN-101 (React)', 'BK-202 (NodeJS)', 'UI-303 (Design)', 'FL-404 (Flutter)'];
  const groupWeekDays = [
    ['Monday', 'Wednesday', 'Friday'],
    ['Tuesday', 'Thursday', 'Saturday'],
    ['Monday', 'Wednesday', 'Friday'],
    ['Tuesday', 'Thursday', 'Saturday']
  ];
  const groupTimes = ['14:00', '16:00', '18:00', '20:00'];
  const groups = [];

  for (let i = 0; i < 4; i++) {
    const start = new Date();
    start.setDate(start.getDate() - 30); // Started 1 month ago
    const end = new Date();
    end.setDate(end.getDate() + 150); // Ends in 5 months

    const g = await prisma.groups.create({
      data: {
        name: groupNames[i],
        description: `${courses[i].name} kursi bo'yicha amaliy o'quv guruhi`,
        course_id: courses[i].id,
        room_id: rooms[i].id,
        start_date: start,
        end_date: end,
        week_day: groupWeekDays[i],
        start_time: groupTimes[i],
        status: GroupStatus.active,
      }
    });
    groups.push(g);

    // Assign exactly 5 students to this group
    const grStudents = students.slice(i * 5, (i + 1) * 5);
    for (const student of grStudents) {
      await prisma.studentGroup.create({
        data: {
          student_id: student.id,
          group_id: g.id,
          status: Status.active
        }
      });
    }

    // Assign 1 Teacher to this group
    await prisma.teachersGroup.create({
      data: {
        teacher_id: teachers[i].id,
        group_id: g.id
      }
    });
  }
  console.log(`✅ 4 ta Guruh va student/o'qituvchi bog'lanishlari yaratildi.`);

  // --- 6. Create 20 Lessons and 20 Homeworks for each of the 4 Groups ---
  console.log('📝 20 tadan dars va uyga vazifalar yaratilmoqda...');
  
  for (let gIdx = 0; gIdx < groups.length; gIdx++) {
    const group = groups[gIdx];
    const teacher = teachers[gIdx];
    const grStudents = students.slice(gIdx * 5, (gIdx + 1) * 5);

    console.log(`   👉 Guruh uchun darslar: "${group.name}"`);

    for (let lIdx = 1; lIdx <= 20; lIdx++) {
      const lessonDate = new Date();
      lessonDate.setDate(lessonDate.getDate() - (21 - lIdx)); // Spread back from past 20 days to yesterday

      // Create Lesson
      const lesson = await prisma.lesson.create({
        data: {
          group_id: group.id,
          teacher_id: teacher.id,
          topic: `Mavzu ${lIdx}: ${courses[gIdx].name} bo'yicha amaliy dars`,
          description: `Ushbu darsda ${courses[gIdx].name} mavzusidagi ${lIdx}-bo'lim batafsil o'rganildi.`,
          date: lessonDate,
          status: Status.active,
        }
      });

      // Create Homework
      const homework = await prisma.homeWork.create({
        data: {
          group_id: group.id,
          lesson_id: lesson.id,
          teacher_id: teacher.id,
          title: `Vazifa ${lIdx}: Mavzu bo'yicha mustaqil topshiriq`,
          description: `Iltimos, darsda o'tilgan ${lIdx}-mavzu yuzasidan barcha amaliy topshiriqlarni bajarib, natijani screenshot yoki zip shaklida yuboring.`,
        }
      });

      // --- Create Homework Answers for Students in this Group with diverse statuses ---
      // We want different statuses: PENDING, ACCEPTED, RETURNED, NOT_DONE
      for (let sIdx = 0; sIdx < grStudents.length; sIdx++) {
        const student = grStudents[sIdx];
        
        // Let's decide homework status based on a modular pattern so it's fully distributed
        const stateKey = (lIdx + sIdx) % 6;
        
        if (stateKey === 0 || stateKey === 1) {
          // ACCEPTED
          const answer = await prisma.homeWorkAnswer.create({
            data: {
              student_id: student.id,
              homwork_id: homework.id,
              title: `Uyga vazifa ${lIdx} yechimi - ${student.full_name}`,
              file: JSON.stringify([`src_code_v${lIdx}.zip`]),
              homeworkStatus: HomeworkStatus.ACCEPTED,
              created_at: lessonDate,
            }
          });
          
          await prisma.homeWorkResult.create({
            data: {
              techer_id: teacher.id,
              homework_answer_id: answer.id,
              grade: Math.floor(Math.random() * 20) + 80, // 80 - 99
              title: 'Ajoyib natija! Kod to\'g\'ri yozilgan va talablar bajarilgan.',
            }
          });
        } 
        else if (stateKey === 2) {
          // RETURNED
          const answer = await prisma.homeWorkAnswer.create({
            data: {
              student_id: student.id,
              homwork_id: homework.id,
              title: `Vazifa ${lIdx} topshirishga urinish - ${student.full_name}`,
              file: JSON.stringify([`homework_${lIdx}_error.png`]),
              homeworkStatus: HomeworkStatus.RETURNED,
              allow_resubmit: true,
              created_at: lessonDate,
            }
          });

          await prisma.homeWorkResult.create({
            data: {
              techer_id: teacher.id,
              homework_answer_id: answer.id,
              grade: Math.floor(Math.random() * 20) + 35, // 35 - 54
              title: 'Xatolar mavjud. Kamchiliklarni bartaraf etib qayta topshiring.',
            }
          });
        }
        else if (stateKey === 3) {
          // PENDING (Submitted but not graded yet)
          await prisma.homeWorkAnswer.create({
            data: {
              student_id: student.id,
              homwork_id: homework.id,
              title: `Topshiriq ${lIdx} tayyor - ${student.full_name}`,
              file: JSON.stringify([`check_me_${lIdx}.zip`]),
              homeworkStatus: HomeworkStatus.PENDING,
              created_at: lessonDate,
            }
          });
        }
        else {
          // NOT_DONE (Student didn't submit anything)
          // No HomeWorkAnswer created
        }
      }
    }

    // --- 7. Create Exams & ExamAnswers ---
    console.log(`   📝 Guruh uchun imtihonlar: "${group.name}"`);
    // Create 2 exams for each group
    for (let eIdx = 1; eIdx <= 2; eIdx++) {
      const examDate = new Date();
      examDate.setDate(examDate.getDate() - (eIdx === 1 ? 15 : 5)); // 15 days ago and 5 days ago

      const exam = await prisma.exam.create({
        data: {
          group_id: group.id,
          teacher_id: teacher.id,
          title: `Imtihon ${eIdx}: ${eIdx === 1 ? 'Oraliq' : 'Yakuniy'} Nazorat`,
          description: `Ushbu imtihon o'tilgan barcha mavzular bo'yicha talabalarning bilimlarini sinash uchun mo'ljallangan.`,
          start_date: examDate,
          end_date: new Date(examDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours limit
          is_published: true,
          published_at: new Date(),
        }
      });

      // Create ExamAnswers for group students with mixed scores & statuses
      for (let sIdx = 0; sIdx < grStudents.length; sIdx++) {
        const student = grStudents[sIdx];
        const stateKey = (eIdx + sIdx) % 4;

        if (stateKey === 0 || stateKey === 1) {
          // ACCEPTED (Passed)
          await prisma.examAnswer.create({
            data: {
              student_id: student.id,
              exam_id: exam.id,
              title: `Imtihon yechimi - ${student.full_name}`,
              file: `exam_ans_${exam.id}_student_${student.id}.pdf`,
              examStatus: ExamStatus.ACCEPTED,
              score: Math.floor(Math.random() * 20) + 70, // 70 - 89
              feedback: 'Yaxshi topshirdingiz, keyingi bosqichlarga o\'ting.',
              checked_at: new Date(),
            }
          });
        }
        else if (stateKey === 2) {
          // RETURNED (Failed)
          await prisma.examAnswer.create({
            data: {
              student_id: student.id,
              exam_id: exam.id,
              title: `Imtihon topshirish - ${student.full_name}`,
              file: `exam_ans_fail_${exam.id}.pdf`,
              examStatus: ExamStatus.RETURNED,
              score: Math.floor(Math.random() * 20) + 30, // 30 - 49
              feedback: 'Qoniqarsiz baho. Qayta tayyorlanib, qayta topshirishingiz lozim.',
              checked_at: new Date(),
            }
          });
        }
        else if (stateKey === 3) {
          // PENDING (Waiting checking)
          await prisma.examAnswer.create({
            data: {
              student_id: student.id,
              exam_id: exam.id,
              title: `Imtihon topshirdim - ${student.full_name}`,
              file: `exam_doc_${exam.id}.zip`,
              examStatus: ExamStatus.PENDING,
              score: 0,
              checked_at: null,
            }
          });
        }
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Seed muvaffaqiyatli yakunlandi!');
  console.log('   👥 20 ta Student yaratildi (4 guruhda 5 tadan)');
  console.log('   👥 5 ta Teacher yaratildi');
  console.log('   🏫 4 ta Guruh, 4 ta Xona, 4 ta Kurs yaratildi');
  console.log('   📝 Har bir guruhda 20 tadan Dars va Uyga vazifa yaratildi');
  console.log('   📝 Har bir guruhda 2 ta Imtihon va tegishli natijalar yaratildi');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
