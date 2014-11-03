from bouncer.constants import MANAGE
from flask import Blueprint, Flask, request, current_app
from flask.ext.login import login_required, current_user
from flask.ext.restful import Resource, reqparse, marshal
from sqlalchemy import func

from .authorization import allow, require
from . import dataformat
from .core import event
from .models import PostsForQuestions, CoursesAndUsers, Courses, Posts, PostsForAnswers, UserTypesForCourse,\
				Judgements, AnswerPairings, PostsForAnswersAndPostsForComments, PostsForComments,\
				CriteriaAndCourses
from .util import new_restful_api

import csv, os, time
from .classlist import random_generator

report_api = Blueprint('report_api', __name__)
api = new_restful_api(report_api)

# TODO put in config file
UPLOAD_FOLDER = os.getcwd() + '/acj/static/report'
app = Flask(__name__)
app.config['PERMANENT_REPORT_UPLOAD_FOLDER'] = UPLOAD_FOLDER

report_parser = reqparse.RequestParser()
# may change 'type' to int
report_parser.add_argument('type', type=str, required=True)
report_parser.add_argument('assignment', type=int)

#events
on_export_report = event.signal('EXPORT_REPORT')
# should we have a different event for each type of report?

def name_generator(course, report_name, file_type="csv"):
	date = time.strftime("%Y-%m-%d--%H-%M-%S")
	#return report_name + "_" + course.name + "_" + random_generator(4) + "." + file_type
	return course.name + "-" + report_name + "--" + date + "." + file_type

class ReportRootAPI(Resource):
	@login_required
	def post(self, course_id):
		course = Courses.query.get_or_404(course_id)
		post = Posts(courses_id=course.id)
		question = PostsForQuestions(post=post)
		require(MANAGE, question)

		params = report_parser.parse_args()
		type = params.get('type')
		assignment = params.get('assignment', None)

		if type=="participation_stat":
			if assignment:
				question = PostsForQuestions.query.filter_by(id=assignment).join(Posts).filter_by(courses_id=course_id).first_or_404()
				questions = [question]
				data = participation_stat_report(course_id, questions, False)
			else:
				questions = PostsForQuestions.query.join(Posts).filter_by(courses_id=course_id).all()
				data = participation_stat_report(course_id, questions, True)

			title = ['Question', 'Username', 'Last Name', 'First Name', 'Answer Submitted', 'Answer ID',
					 'Evaluations Submitted', 'Evaluations Required', 'Evaluation Requirements Met',
					 'Replies Submitted']
			titles =[title]
		elif type=="participation":
			user_titles = ['Last Name', 'First Name', 'Student No']
			criteria = CriteriaAndCourses.query.filter_by(courses_id=course_id, active=True).all()
			if assignment:
				question = PostsForQuestions.query.filter_by(id=assignment).join(Posts).filter_by(courses_id=course_id).first_or_404()
				questions = [question]
			else:
				questions = PostsForQuestions.query.join(Posts).filter_by(courses_id=course_id)\
					.order_by(PostsForQuestions.answer_start).all()
			data = participation_report(course_id, questions, criteria)

			title_row1 = ["" for x in user_titles]
			criteria_blank = ["" for x in criteria]
			for ques in questions:
				title_row1 += [ques.title] + criteria_blank

			title_row2 = user_titles
			for q in questions:
				for c in criteria:
					title_row2.append(c.criterion.name)
				title_row2.append("Evaluations Submitted ("+str(ques.num_judgement_req)+' required)')
			titles = [title_row1, title_row2]

		else:
			return {'error': 'The requested report type cannot be found'}, 400

		name = name_generator(course, type)
		tmpName = os.path.join(current_app.config['REPORT_FOLDER'], name)

		report = open(tmpName, 'wb')
		out = csv.writer(report)
		for t in titles:
			out.writerow(t)
		for s in data:
			out.writerow(s)
		report.close()

		return {'file': 'report/'+name}
api.add_resource(ReportRootAPI, '')

def participation_stat_report(course_id, assignments, overall):
	report = []
	student = UserTypesForCourse.query.filter_by(name=UserTypesForCourse.TYPE_STUDENT).first().id
	classlist = CoursesAndUsers.query.filter_by(courses_id=course_id).\
		filter(CoursesAndUsers.usertypesforcourse_id==student).all()

	total_req = 0
	total = {}

	for ques in assignments:
		# ANSWERS: assume max one answer per user
		answers = PostsForAnswers.query.filter_by(postsforquestions_id=ques.id).all()
		answers = {a.users_id: a.id for a in answers}
		# EVALUATIONS
		evaluations = Judgements.query.with_entities(Judgements.users_id, func.count(Judgements.id)).\
			join(AnswerPairings).filter_by(postsforquestions_id=ques.id).group_by(Judgements.users_id).all()
		evaluations = {usersId: count for (usersId, count) in evaluations}
		# COMMENTS
		comments = PostsForAnswersAndPostsForComments.query.\
			join(PostsForAnswers).filter(PostsForAnswers.postsforquestions_id==ques.id).\
			join(PostsForComments, Posts).\
			with_entities(Posts.users_id, func.count(PostsForAnswersAndPostsForComments.id)).\
			group_by(Posts.users_id).all()
		comments = {usersId: count for (usersId, count) in comments}
		total_req += ques.num_judgement_req	# for overall required
		for student in classlist:
			user = student.user
			temp = [ques.title, user.username, user.lastname, user.firstname]

			# OVERALL
			if user.id not in total:
				total[user.id] = {
					'total_answers': 0,
					'total_evaluations': 0,
					'total_comments': 0
				}

			submitted = 1 if user.id in answers else 0
			answerId = answers[user.id] if submitted else 'N/A'
			total[user.id]['total_answers'] += submitted
			temp.extend([submitted, answerId])

			evalSubmitted = evaluations[user.id] if user.id in evaluations else 0
			evalReqMet = 'Yes' if evalSubmitted >= ques.num_judgement_req else 'No'
			total[user.id]['total_evaluations'] += evalSubmitted
			temp.extend([evalSubmitted, ques.num_judgement_req, evalReqMet])

			commentCount = comments[user.id] if user.id in comments else 0
			total[user.id]['total_comments'] += commentCount
			temp.append(commentCount)

			report.append(temp)

	if overall:
		for student in classlist:
			user = student.user
			sum = total[user.id]
			# assume a user can only at most do the required number
			req_met = 'Yes' if sum['total_evaluations'] >= total_req else 'No'
			temp = ['(Overall in Course)', user.id, user.lastname, user.firstname,
					sum['total_answers'], '(Overall in Course)',
					sum['total_evaluations'], total_req, req_met,
					sum['total_comments']]
			report.append(temp)
	return report

def participation_report(course_id, questions, criteriaandcourses):
	report = []
	student = UserTypesForCourse.query.filter_by(name=UserTypesForCourse.TYPE_STUDENT).first().id
	classlist = CoursesAndUsers.query.filter_by(courses_id=course_id).\
		filter(CoursesAndUsers.usertypesforcourse_id==student).all()

	quesIds = [q.id for q in questions]

	for coursesanduser in classlist:
		user = coursesanduser.user
		temp = [user.lastname, user.firstname, user.student_no]

		answers = PostsForAnswers.query.filter(PostsForAnswers.postsforquestions_id.in_(quesIds))\
			.join(Posts).filter_by(users_id=user.id).all()
		answers = {a.postsforquestions_id:{s.criteriaandcourses_id: s.score for s in a.scores} for a in answers}

		judgements = Judgements.query.\
			filter_by(users_id=user.id).join(AnswerPairings).\
			with_entities(AnswerPairings.postsforquestions_id, func.count(Judgements.id)).\
			filter(AnswerPairings.postsforquestions_id.in_(quesIds)).\
			group_by(AnswerPairings.postsforquestions_id).all()
		judgements = {qId: count for (qId, count) in judgements}

		for ques in questions:
			for criterion in criteriaandcourses:
				if ques.id not in answers:
					score = 0
				elif criterion.id not in answers[ques.id]:
					score = 'N/A'
				else:
					score = answers[ques.id][criterion.id]
					score = round(score, 3)
				temp.append(score)
			if ques.id not in judgements:
				judged = 0
			else:
				judged = judgements[ques.id] / len(criteriaandcourses)
			temp.append(str(judged))
		report.append(temp)

	return report