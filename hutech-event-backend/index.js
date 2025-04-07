const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes");
const Event = require("./models/Event");
const EventRegistration = require("./models/EventRegistration");
const Student = require("./models/Student");

app.use(express.json());
app.use(cors());
app.use("/api", router);

app.listen(port, () => {
  console.log(`HutechEventBE listening on port ${port}`);
});

try {
  mongoose.connect(process.env.MONGO_URL, {});
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (student, event, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: student.email,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${student.email}:`, info.response);
  } catch (error) {
    console.log(`Error sending email to ${student.email}:`, error);
  }
};

// Schedule emails for events
const scheduleEmailsForEvents = async () => {
  const now = dayjs();
  const next24h = now.add(24, "hour").toDate();
  const next1h = now.add(1, "hour").toDate();

  const events24h = await Event.find({
    date: { $lte: next24h, $gte: now.toDate() },
  });

  const allStudents = await Student.find();

  // 24-hour reminders
  for (const event of events24h) {
    const notifiedRegistrations = await EventRegistration.find({
      eventId: event._id,
      reminder24hSent: true,
    }).select("studentId");

    const notifiedStudentIds = notifiedRegistrations.map((reg) =>
      reg.studentId.toString()
    );

    for (const student of allStudents) {
      if (notifiedStudentIds.includes(student._id.toString())) continue;

      const subject = `Upcoming Event: ${event.name}`;
      const text = `Chào ${student.fullname},\n\nSự kiện "${event.name}" sẽ bắt đầu vào lúc ${dayjs(event.date).format(
        "HH:mm:ss ngày DD/MM/YYYY"
      )} tại ${event.location}.\n\nBest regards,\nHutech Event Team`;

      await sendEmail(student, event, subject, text);

      await EventRegistration.findOneAndUpdate(
        { studentId: student._id, eventId: event._id },
        {
          $set: { reminder24hSent: true },
          $setOnInsert: {
            query: "notification_only",
            reminder1hSent: false,
          },
        },
        { upsert: true }
      );
    }
  }

  // 1-hour reminders
  const events1h = await Event.find({
    date: { $lte: next1h, $gte: now.toDate() },
  });

  for (const event of events1h) {
    const notifiedRegistrations = await EventRegistration.find({
      eventId: event._id,
      reminder1hSent: true,
    }).select("studentId");

    const notifiedStudentIds = notifiedRegistrations.map((reg) =>
      reg.studentId.toString()
    );

    for (const student of allStudents) {
      if (notifiedStudentIds.includes(student._id.toString())) continue;

      const subject = `Event Reminder: ${event.name} starts in 1 hour`;
      const text = `Chào ${student.fullname},\n\nSự kiện "${event.name}" sẽ bắt đầu trong 1 giờ nữa vào lúc ${dayjs(event.date).format(
        "HH:mm:ss ngày DD/MM/YYYY"
      )} tại ${event.location}.\n\nBest regards,\nHutech Event Team`;

      await sendEmail(student, event, subject, text);

      await EventRegistration.findOneAndUpdate(
        { studentId: student._id, eventId: event._id },
        {
          $set: { reminder1hSent: true },
          $setOnInsert: {
            query: "notification_only",
            reminder24hSent: false,
          },
        },
        { upsert: true }
      );
    }
  }
};

// Schedule job every 1 minute
schedule.scheduleJob("*/1 * * * *", () => {
  scheduleEmailsForEvents().catch((err) => {
    console.error("Error in scheduled email job:", err);
  });
});
