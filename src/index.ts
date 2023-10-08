import inquirer from 'inquirer'

// Base class for a person
class Person {
	private name: string
	private age: number

	constructor(name: string, age: number) {
		this.name = name
		this.age = age
	}

	getName(): string {
		return this.name
	}
}

class Student extends Person {
	private rollNumber: string
	private courses: Course[] = []

	constructor(name: string, age: number) {
		super(name, age)
		this.rollNumber = this.generateRollNumber()
	}

	registerForCourses(...courses: Course[]): void {
		this.courses.push(...courses)
	}
	// Function to generate a random student rollNumber
	generateRollNumber() {
		const prefix = 'STUDENT'
		const randomNumber = Math.floor(1000 + Math.random() * 9000)
		return `${prefix}${randomNumber}`
	}
}

class Instructor extends Person {
	private salary: number
	private courses: Course[] = []

	constructor(name: string, age: number, salary: number) {
		super(name, age)
		this.salary = salary
	}

	assignCourses(...courses: Course[]): void {
		this.courses.push(...courses)
	}
}

class Course {
	static id: number = 1
	private name: string
	private students: Student[] = []
	private instructor!: Instructor

	constructor(name: string) {
		this.name = name
		Course.id++
	}

	addStudents(...students: Student[]): void {
		this.students.push(...students)
		for (const student of students) {
			student.registerForCourses(this)
		}
	}

	setInstructor(instructor: Instructor): void {
		this.instructor = instructor
	}
}

class Department {
	name: string
	private courses: Course[] = []

	constructor(name: string) {
		this.name = name
	}

	addCourses(...courses: Course[]): void {
		this.courses.push(...courses)
	}
}

const mainFunc = async () => {
	const courses: Course[] = []

	let answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'newlyCreatedType',
			choices: ['Student', 'Course', 'Department', 'Instructor'],
			message: 'What do you want to create as a Super Administrator?',
		},
		{
			type: 'input',
			name: 'newlyCreatedName',
			message:
				'What is the name of the new course/department/instructor/student?',
		},
	])

	switch (answers.newlyCreatedType) {
		case 'Student':
			let studentAnswers = await inquirer.prompt([
				{
					type: 'input',
					name: 'age',
					message: 'What is the age of the new instructor/student?',
				},
				{
					type: 'list',
					name: 'enrollCourse',
					choices: courses.map((course) => course.name),
					message: 'In which course do you want to enroll in?',
				},
			])
			const student = new Student(answers.newlyCreatedName, studentAnswers.age)
			const selectedCourse = courses.find(
				(course) => course.name === studentAnswers.enrollCourse
			)
			if (selectedCourse) {
				selectedCourse.addStudents(student)
			}
			break
		case 'Course':
			const course = new Course(answers.newlyCreatedName)
			courses.push(course)
			break
		case 'Instructor':
			let instructorAnswers = await inquirer.prompt([
				{
					type: 'input',
					name: 'age',
					message: 'What is the age of the new instructor/student?',
				},
				{
					type: 'input',
					name: 'salary',
					message: 'What is the salary of the new instructor?',
				},
			])
			const instructor = new Instructor(
				answers.newlyCreatedName,
				instructorAnswers.age,
				parseFloat(instructorAnswers.salary)
			)
			instructors.push(instructor)
			break
		case 'Department':
			const department = new Department(answers.newlyCreatedName)
			break
		default:
			return
	}
}

mainFunc()
