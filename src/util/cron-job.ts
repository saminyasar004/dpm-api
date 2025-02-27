import cron from "node-cron";
import OtpService from "@/service/otp.service";

// Schedule the cleanup function to run on the 1st day of every month at midnight
cron.schedule("0 0 1 * *", () => {
	console.log("Running monthly OTP cleanup job...");
	OtpService.cleanupExpiredOtps();
});
