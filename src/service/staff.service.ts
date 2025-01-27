import Staff, { StaffAttributes } from "@/model/staff.model";

class StaffService {
	registerStaff = async (
		name: string,
		email: string,
		password: string,
		role: "agent" | "designer",
		commissionPercentage: number,
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.create({
				name,
				email,
				password,
				role,
				commissionPercentage,
			});
			const createdStaff = await Staff.findByPk(staff.staffId);
			if (createdStaff) {
				return createdStaff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while creating staff: ".red,
				err.message,
			);
			throw err;
		}
	};

	uploadStaffAvatar = async (
		staffId: number,
		avatarPath: string,
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.findOne({ where: { staffId: staffId } });
			if (staff) {
				staff.avatar = avatarPath;
				await staff.save();
				return staff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while uploading staff avatar: ".red,
				err.message,
			);
			throw err;
		}
	};

	getStaffByEmail = async (
		email: string,
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.findOne({ where: { email } });
			if (staff) {
				return staff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting staff by email: ".red,
				err.message,
			);
			throw err;
		}
	};

	getStaffByEmailAndRole = async (
		email: string,
		role: "agent" | "designer",
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.findOne({ where: { email, role } });
			if (staff) {
				return staff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting staff by role: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllStaffs = async (): Promise<Staff[] | StaffAttributes[] | null> => {
		try {
			const staffs = await Staff.findAll();
			if (staffs) {
				return staffs.map((staff) => staff.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting all staffs: ".red,
				err.message,
			);
			throw err;
		}
	};

	updateStaff = async (
		name: string,
		email: string,
		password: string,
		role: "agent" | "designer",
		commissionPercentage: number,
	): Promise<boolean> => {
		try {
			const prevTokenVersion = (await Staff.findOne({
				where: { email },
				attributes: ["tokenVersion"],
			})) || { tokenVersion: 0 };
			const isUpdated = await Staff.update(
				{
					name,
					password,
					role,
					commissionPercentage,
					tokenVersion: prevTokenVersion.tokenVersion + 1,
				},
				{
					where: {
						email,
					},
				},
			);
			if (isUpdated) {
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while updating staff: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default StaffService;
