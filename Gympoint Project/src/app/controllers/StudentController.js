// schema validator
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string()
				.email()
				.required(),
			age: Yup.number()
				.required()
				.integer()
				.positive(),
			weight: Yup.number()
				.required()
				.positive(),
			height: Yup.number()
				.required()
				.positive(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const studentExists = await Student.findOne({
			where: {
				email: req.body.email,
			},
		});

		if (studentExists) {
			return res.status(400).json({ error: 'Student already exists' });
		}

		const { id, name, email, age, weight, height } = await Student.create(
			req.body
		);

		return res.json({
			id,
			name,
			email,
			age,
			weight,
			height,
		});
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string()
				.email()
				.required(),
			age: Yup.number()
				.integer()
				.positive(),
			weight: Yup.number().positive(),
			height: Yup.number().positive(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const { email } = req.body;

		const student = await Student.findByPk(req.userId);

		if (email !== student.email) {
			const userExists = await Student.findOne({
				where: { email },
			});

			if (userExists) {
				return res.status(400).json({ error: 'Student already exists.' });
			}
		}

		const studentFields = await student.update(req.body);

		return res.json(studentFields);
	}
}

export default new StudentController();
