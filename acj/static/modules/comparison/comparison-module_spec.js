describe('comparison-module', function () {
    var $httpBackend, sessionRequestHandler;
    var id = "1abcABC123-abcABC123_Z";
    var mockSession = {
        "id": id,
        "permissions": {
            "Course": {
                "create": true,
                "delete": true,
                "edit": true,
                "manage": true,
                "read": true
            },
            "Assignment": {
                "create": true,
                "delete": true,
                "edit": true,
                "manage": true,
                "read": true
            },
            "User": {
                "create": true,
                "delete": true,
                "edit": true,
                "manage": true,
                "read": true
            }
        }
    };
    var mockUser = {
        avatar: "63a9f0ea7bb98050796b649e85481845",
        created: "Tue, 27 May 2014 00:02:38 -0000",
        displayname: "root",
        email: null,
        firstname: "John",
        fullname: "John Smith",
        id: id,
        lastname: "Smith",
        last_online: "Tue, 12 Aug 2014 20:53:31 -0000",
        modified: "Tue, 12 Aug 2014 20:53:31 -0000",
        username: "root",
        system_role: "System Administrator"
    };
    var mockCourse = {
        "available": true,
        "start_date": null,
        "end_date": null,
        "created": "Fri, 09 Jan 2015 17:23:59 -0000",
        "description": null,
        "id": "1abcABC123-abcABC123_Z",
        "modified": "Fri, 09 Jan 2015 17:23:59 -0000",
        "name": "Test Course",
        "year": 2015,
        "term": "Winter",
        "start_time": null,
        "end_time": null
    };
    beforeEach(module('ubc.ctlt.acj.comparison'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        sessionRequestHandler = $httpBackend.when('GET', '/api/session').respond(mockSession);
        $httpBackend.when('GET', '/api/users/' + id).respond(mockUser);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ComparisonController', function () {
        var $rootScope, createController, $location, $modal, $q;
        var mockCritiera = {
            "criteria": [{
                "created": "Sat, 06 Sep 2014 02:13:07 -0000",
                "default": true,
                "public": true,
                "description": "<p>Choose the response that you think is the better of the two.</p>",
                "id": "1abcABC123-abcABC123_Z",
                "compared": true,
                "modified": "Sat, 06 Sep 2014 02:13:07 -0000",
                "name": "Which is better?",
                "user_id": "1abcABC123-abcABC123_Z"
            }, {
                "created": "Fri, 09 Jan 2015 18:35:58 -0000",
                "default": false,
                "public": false,
                "description": "<p>Explaining what a better idea was</p>\n",
                "id": "2abcABC123-abcABC123_Z",
                "compared": false,
                "modified": "Fri, 09 Jan 2015 18:35:58 -0000",
                "name": "Which answer has the better idea?",
                "user_id": "46bcABC123-abcABC123_Z",
            }]
        };
        var mockAssignment = {
            'course_id': "1abcABC123-abcABC123_Z",
            "after_comparing": false,
            "answer_end": "Mon, 14 Sep 2015 04:00:00 -0000",
            "answer_period": false,
            "answer_start": "Mon, 23 Feb 2015 21:50:00 -0000",
            "answer_count": 115,
            "available": true,
            "students_can_reply": false,
            "comment_count": 1,
            "criteria": [{
                "active": true,
                "criterion": {
                    "created": "Fri, 09 Jan 2015 22:47:02 -0000",
                    "default": true,
                    "public": false,
                    "description": "criterionn 1",
                    "id": "4abcABC123-abcABC123_Z",
                    "compared": true,
                    "modified": "Fri, 09 Jan 2015 22:47:02 -0000",
                    "name": "Which answer has the better critical idea?",
                    "user_id": "50bcABC123-abcABC123_Z"
                },
                "id": "12bcABC123-abcABC123_Z"
            }, {
                "active": true,
                "criterion": {
                    "created": "Fri, 09 Jan 2015 22:50:06 -0000",
                    "default": true,
                    "public": false,
                    "description": "criterion 2",
                    "id": "5abcABC123-abcABC123_Z",
                    "compared": true,
                    "modified": "Fri, 09 Jan 2015 22:50:06 -0000",
                    "name": "Which answer is more effectively articulated? Explain the reason for your preference.",
                    "user_id": "50bcABC123-abcABC123_Z"
                },
                "id": "13bcABC123-abcABC123_Z"
            }],
            "evaluation_count": 252,
            "id": "9abcABC123-abcABC123_Z",
            "compare_end": "Thu, 15 Sep 2016 16:00:00 -0000",
            "compare_start": "Tue, 15 Sep 2015 04:00:00 -0000",
            "compared": true,
            "compare_period": true,
            "modified": "Fri, 25 Sep 2015 07:40:19 -0000",
            "number_of_comparisons": 3,
            "total_comparisons_required": 3,
            "total_steps_required": 4,
            "content": "<p><strong>For your answer, write ONLY the premise of 20-60 words. Do not include your notes. Consider spending 10-15 minutes making the notes, but not much longer for this exercise. I strongly recommend marking up a hard copy, as we do in class: paste the poem into a word document and print yourself a working copy.</strong></p>\n\n<p>Transplanted<br />\n&nbsp;&nbsp;&nbsp; ---by Lorna Crozier<br />\n<br />\nThis heart met the air. Grew in the hours<br />\nbetween the first body and the next<br />\na taste for things outside it: the heat<br />\nof high intensity, wind grieving<br />\nin the poplar leaves, the smell of steam<br />\nwafting through the open window<br />\nfrom the hot dog vendor&#39;s cart. Often it skips<br />\n<br />\na beat - grouse explode from ditches,<br />\na man flies through the windshield,<br />\na face the heart once knew<br />\nweeps in the corridor that gives nothing back<br />\nbut unloveliness and glare.<br />\n<br />\nLike a shovel that hits the earth, then rises,<br />\nand hits the earth again, it feels its own<br />\ndull blows. Some nights it is a sail billowing<br />\nwith blood, a raw fist punching.<br />\nSome nights, beneath the weight of blankets,<br />\nflesh and bones, the heart remembers. Feels those<br />\nsurgical gloves close around it, and goes cold.</p>\n",
            "file": [],
            "user": {
                "avatar": "b893bcb68fbeef6738437fa1deca0a28",
                "displayname": "Tiffany Potter",
                "id": "50bcABC123-abcABC123_Z"
            },
            "enable_self_evaluation": true,
            "pairing_algorithm": "random",
            "educators_can_compare": false,
            "rank_display_limit": 10,
            "name": "Read the poem below, and make notes on syntax, figurative language, patterns of diction and imagery, and form. Then, imagining that you are writing a 1200-word essay, write a critical premise of 20-60 words as we have discussed in class."
        };

        var mockAnswer1 = {
            "comment_count": 3,
            "content": "This is answer 1",
            "created": "Sat, 29 Aug 2015 08:00:19 -0000",
            "file": [],
            "flagged": false,
            "id": "407cABC123-abcABC123_Z",
            "private_comment_count": 3,
            "public_comment_count": 0,
            "assignment_id": "9abcABC123-abcABC123_Z",
            "scores": [
                {
                    "answer_id": "407cABC123-abcABC123_Z",
                    "criterion_id": "12bcABC123-abcABC123_Z",
                    "id": "645cABC123-abcABC123_Z",
                    "normalized_score": 75,
                    "rounds": 6,
                    "score": 2.19318,
                    "wins": 3
                },
                {
                    "answer_id": "407cABC123-abcABC123_Z",
                    "criterion_id": "13bcABC123-abcABC123_Z",
                    "id": "646cABC123-abcABC123_Z",
                    "normalized_score": 0,
                    "rounds": 6,
                    "score": 0.0,
                    "wins": 0
                }
            ],
            "user": {
                "id": "1abcABC123-abcABC123_Z",
                "avatar": "63a9f0ea7bb98050796b649e85481845",
                "displayname": "root"
            },
            "user_id": "1abcABC123-abcABC123_Z"
        };

        var mockAnswer2 = {
            "comment_count": 4,
            "content": "This is answer 2",
            "created": "Tue, 24 Feb 2015 04:09:28 -0000",
            "file": [],
            "flagged": false,
            "id": "279cABC123-abcABC123_Z",
            "private_comment_count": 4,
            "public_comment_count": 0,
            "assignment_id": "9abcABC123-abcABC123_Z",
            "scores": [
                {
                    "answer_id": "279cABC123-abcABC123_Z",
                    "criterion_id": "12bcABC123-abcABC123_Z",
                    "id": "445cABC123-abcABC123_Z",
                    "normalized_score": 75,
                    "rounds": 8,
                    "score": 2.19318,
                    "wins": 3
                },
                {
                    "answer_id": "279cABC123-abcABC123_Z",
                    "criterion_id": "13bcABC123-abcABC123_Z",
                    "id": "446cABC123-abcABC123_Z",
                    "normalized_score": 40,
                    "rounds": 8,
                    "score": 1.46212,
                    "wins": 2
                }
            ],
            "user": {
                "id": "162cABC123-abcABC123_Z",
                "avatar": "25242646dab1876796ab95f036a8fc82",
                "displayname": "student_95322345"
            },
            "user_id": "162cABC123-abcABC123_Z"
        };

        var mockComparisons = [
            {
                'id': "1abcABC123-abcABC123_Z",
                'course_id': "1abcABC123-abcABC123_Z",
                'assignment_id': "9abcABC123-abcABC123_Z",
                'criterion_id': "4abcABC123-abcABC123_Z",
                'user_id': id,
                'answer1_id': "407cABC123-abcABC123_Z",
                'answer2_id': "279cABC123-abcABC123_Z",
                'answer1': angular.copy(mockAnswer1),
                'answer2': angular.copy(mockAnswer2),
                'winner_id': null,

                'content': '',
                'criterion': {
                    "created": "Fri, 09 Jan 2015 22:47:02 -0000",
                    "default": true,
                    "public": false,
                    "description": "criterionn 1",
                    "id": "4abcABC123-abcABC123_Z",
                    "compared": true,
                    "modified": "Fri, 09 Jan 2015 22:47:02 -0000",
                    "name": "Which answer has the better critical idea?",
                    "user_id": "50bcABC123-abcABC123_Z",
                },

                'user': {
                    'avatar': "63a9f0ea7bb98050796b649e85481845",
                    'displayname': "root",
                    'fullname': "John Smith",
                    'id': id
                },
                'created': "Fri, 09 Jan 2015 18:35:58 -0000",
            }, {
                'id': "2abcABC123-abcABC123_Z",
                'course_id': "1abcABC123-abcABC123_Z",
                'assignment_id': "9abcABC123-abcABC123_Z",
                'criterion_id': "5abcABC123-abcABC123_Z",
                'user_id': id,
                'answer1_id': "407cABC123-abcABC123_Z",
                'answer2_id': "279cABC123-abcABC123_Z",
                'answer1': angular.copy(mockAnswer1),
                'answer2': angular.copy(mockAnswer2),
                'winner_id': null,

                'content': '',
                'criterion': {
                    "created": "Fri, 09 Jan 2015 22:50:06 -0000",
                    "default": true,
                    "public": false,
                    "description": "criterion 2",
                    "id": "5abcABC123-abcABC123_Z",
                    "compared": true,
                    "modified": "Fri, 09 Jan 2015 22:50:06 -0000",
                    "name": "Which answer is more effectively articulated? Explain the reason for your preference.",
                    "user_id": "50bcABC123-abcABC123_Z"
                },

                'user': {
                    'avatar': "63a9f0ea7bb98050796b649e85481845",
                    'displayname': "root",
                    'fullname': "John Smith",
                    'id': id
                },
                'created': "Fri, 09 Jan 2015 18:35:58 -0000",
            }
        ];

        var mockComments = [{
            "answer_id": "279cABC123-abcABC123_Z",
            "content": "<p>test123213t4453123123</p>\n",
            "course_id": "3abcABC123-abcABC123_Z",
            "created": "Thu, 24 Sep 2015 00:22:34 -0000",
            "id": "3703ABC123-abcABC123_Z",
            "comment_type": 'Evaluation',
            "draft": false,
            "user": {
                "id": "1abcABC123-abcABC123_Z",
                "avatar": "63a9f0ea7bb98050796b649e85481845",
                "displayname": "root"
            },
            "user_id": "1abcABC123-abcABC123_Z"
        }];

        var mockTimer = {
            "date": 1467325647825
        }

        beforeEach(inject(function ($controller, _$rootScope_, _$location_, _$modal_, _$q_) {
            $rootScope = _$rootScope_;
            $location = _$location_;
            $modal = _$modal_;
            $q = _$q_;
            createController = function (route, params) {
                return $controller('ComparisonController', {
                    $scope: $rootScope,
                    $route: route || {},
                    $routeParams: params || {}
                });
            }
        }));

        it('should have correct initial states', function () {
            $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z').respond(mockAssignment);
            $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/status').respond({
                "status": {
                    "answers": {
                        "answered": true,
                        "count": 1,
                        "draft_ids": [],
                        "has_draft": true
                    },
                    "comparisons": {
                        "available": true,
                        "count": 0,
                        "left": 3
                    }
                }
            });
            $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/comparisons').respond({
                'objects':mockComparisons
            });
            $httpBackend.expectGET('/api/timer').respond(mockTimer);

            $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answer_comments?answer_ids=279cABC123-abcABC123_Z,407cABC123-abcABC123_Z&draft=true&evaluation=only&user_ids=1abcABC123-abcABC123_Z').respond(mockComments);
            createController({}, {courseId: "3abcABC123-abcABC123_Z", assignmentId: "9abcABC123-abcABC123_Z"});
            expect($rootScope.assignment).toEqual({});
            expect($rootScope.current).toBe(undefined);
            $httpBackend.flush();

            expect($rootScope.assignment).toEqualData(mockAssignment);
            expect($rootScope.comparisons).toEqualData(mockComparisons);
            expect($rootScope.current).toEqual(1);

            answer1 = angular.copy(mockComparisons[0]).answer1;
            answer2 = angular.copy(mockComparisons[0]).answer2;
            answer1.comment = {};
            answer2.comment = mockComments[0];
            expect($rootScope.answer1).toEqualData(answer1);
            expect($rootScope.answer2).toEqualData(answer2);
        });

        describe('actions:', function() {
            var $mockRoute, controller;
            var mockComparisonResponse = {
                "objects": angular.copy(mockComparisons)
            };
            mockComparisonResponse.objects[0].winner_id = "407cABC123-abcABC123_Z";
            mockComparisonResponse.objects[0].content = 'criterion comment 1';
            mockComparisonResponse.objects[1].winner_id = "279cABC123-abcABC123_Z";
            mockComparisonResponse.objects[1].content = 'criterion comment 2';

            beforeEach(function() {
                $httpBackend.whenGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z').respond(mockAssignment);
                $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/status').respond({
                    "status": {
                        "answers": {
                            "answered": true,
                            "count": 1,
                            "draft_ids": [],
                            "has_draft": true
                        },
                        "comparisons": {
                            "available": true,
                            "count": 0,
                            "left": 3
                        }
                    }
                });
                $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/comparisons').respond({
                    'objects':mockComparisons
                });
                $httpBackend.expectGET('/api/timer').respond(mockTimer);
                $httpBackend.whenGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answer_comments?answer_ids=279cABC123-abcABC123_Z,407cABC123-abcABC123_Z&draft=true&evaluation=only&user_ids=1abcABC123-abcABC123_Z').respond(mockComments);
                $mockRoute = jasmine.createSpyObj('route', ['reload']);
                controller = createController($mockRoute, {courseId: "3abcABC123-abcABC123_Z", assignmentId: "9abcABC123-abcABC123_Z"});
                $httpBackend.flush();
            });

            it('should load the comment saved before when the same answer is shown', function() {
                expect($rootScope.answer2.comment).toEqualData(mockComments[0]);
            });

            it('should submit comparisons when comparisonSubmit is called', function() {
                var expectedComparison = {
                    "comparisons":[
                        {
                            criterion_id: "4abcABC123-abcABC123_Z",
                            content: 'criterion comment 1',
                            winner_id: "407cABC123-abcABC123_Z",
                            draft: false
                        }, {
                            criterion_id: "5abcABC123-abcABC123_Z",
                            content: 'criterion comment 2',
                            winner_id: "279cABC123-abcABC123_Z",
                            draft: false
                        }
                    ]
                };
                // save answer feedback/comments
                var expectedAnswerComment1 = {"content":"Feedback 1", "comment_type":'Evaluation', "draft": false};
                var expectedAnswerComment2 = angular.extend({}, mockComments[0], {"content":"Feedback 2", "comment_type":'Evaluation', "draft": false});
                $rootScope.answer1.comment.content = 'Feedback 1';
                $rootScope.answer2.comment.content = 'Feedback 2';
                // save comparison selection and comments
                $rootScope.comparisons[0].winner_id = mockComparisons[0].answer1_id;
                $rootScope.comparisons[0].content = 'criterion comment 1';
                $rootScope.comparisons[1].winner_id = mockComparisons[0].answer2_id;
                $rootScope.comparisons[1].content = 'criterion comment 2';
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answers/407cABC123-abcABC123_Z/comments', expectedAnswerComment1).respond({});
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answers/279cABC123-abcABC123_Z/comments/3703ABC123-abcABC123_Z', expectedAnswerComment2).respond({});
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/comparisons', expectedComparison).respond(mockComparisonResponse);
				// users with management permissions do not reload the assignment status at this point anymore
                /*
                $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/status').respond({
                    "status": {
                        "answers": {
                            "answered": true,
                            "count": 1,
                            "draft_ids": [],
                            "has_draft": true
                        },
                        "comparisons": {
                            "available": true,
                            "count": 1,
                            "left": 2
                        }
                    }
                });
                */

                expect($rootScope.preventExit).toBe(true);

                $rootScope.comparisonSubmit();
                $httpBackend.flush();

                expect($mockRoute.reload).toHaveBeenCalled();
                expect($rootScope.preventExit).toBe(false);
            })

        });

        describe('draft actions:', function() {
            var $mockRoute, controller;
            var mockComparisonResponse = {
                "objects": angular.copy(mockComparisons)
            };
            mockComparisonResponse.objects[0].winner_id = null;
            mockComparisonResponse.objects[0].content = 'criterion comment 1';
            mockComparisonResponse.objects[1].winner_id = "279cABC123-abcABC123_Z";
            mockComparisonResponse.objects[1].content = 'criterion comment 2';

            beforeEach(function() {
                $httpBackend.whenGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z').respond(mockAssignment);
                $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/status').respond({
                    "status": {
                        "answers": {
                            "answered": true,
                            "count": 1,
                            "draft_ids": [],
                            "has_draft": true
                        },
                        "comparisons": {
                            "available": true,
                            "count": 0,
                            "left": 3
                        }
                    }
                });
                $httpBackend.expectGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/comparisons').respond({
                    'objects':mockComparisons
                });
                $httpBackend.expectGET('/api/timer').respond(mockTimer);
                $httpBackend.whenGET('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answer_comments?answer_ids=279cABC123-abcABC123_Z,407cABC123-abcABC123_Z&draft=true&evaluation=only&user_ids=1abcABC123-abcABC123_Z').respond(mockComments);
                $mockRoute = jasmine.createSpyObj('route', ['reload']);
                controller = createController($mockRoute, {courseId: "3abcABC123-abcABC123_Z", assignmentId: "9abcABC123-abcABC123_Z"});
                $rootScope.isDraft = true;
                $httpBackend.flush();
            });

            it('should submit comparison when comparisonSubmit is called', function() {
                var expectedComparison = {
                    "comparisons":[
                        {
                            criterion_id: "4abcABC123-abcABC123_Z",
                            content: 'criterion comment 1',
                            winner_id: "407cABC123-abcABC123_Z",
                            draft: true
                        }, {
                            criterion_id: "5abcABC123-abcABC123_Z",
                            content: 'criterion comment 2',
                            winner_id: "279cABC123-abcABC123_Z",
                            draft: true
                        }
                    ]
                };
                // save answer feedback/comments
                var expectedAnswerComment1 = {"content":"Feedback 1", "comment_type":'Evaluation', "draft": true};
                var expectedAnswerComment2 = angular.extend({}, mockComments[0], {"content":"Feedback 2", "comment_type":'Evaluation', "draft": true});
                $rootScope.answer1.comment.content = 'Feedback 1';
                $rootScope.answer2.comment.content = 'Feedback 2';
                // save comparison selection and comments
                $rootScope.comparisons[0].winner_id = mockComparisons[0].answer1_id;
                $rootScope.comparisons[0].content = 'criterion comment 1';
                $rootScope.comparisons[1].winner_id = mockComparisons[0].answer2_id;
                $rootScope.comparisons[1].content = 'criterion comment 2';
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answers/407cABC123-abcABC123_Z/comments', expectedAnswerComment1).respond({});
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/answers/279cABC123-abcABC123_Z/comments/3703ABC123-abcABC123_Z', expectedAnswerComment2).respond({});
                $httpBackend.expectPOST('/api/courses/3abcABC123-abcABC123_Z/assignments/9abcABC123-abcABC123_Z/comparisons', expectedComparison).respond(mockComparisonResponse);

                expect($rootScope.preventExit).toBe(true);
                $rootScope.comparisonSubmit();
                expect($rootScope.submitted).toBe(true);
                $httpBackend.flush();

                expect($rootScope.preventExit).toBe(true);
                expect($rootScope.submitted).toBe(false);
            })

        });
    });
});