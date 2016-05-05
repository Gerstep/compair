Feature: Create Question
  As user, I want to create questions

  Scenario: Loading add question page by Add Assignment button as admin
    Given I'm a System Administrator with courses
    And I'm on "course" page for course with id "1"
    When I select "Add Assignment" button
    Then "Add Assignment" page should load

  Scenario: Loading add question page by Add Assignment button as instructor
    Given I'm an Instructor with courses
    And I'm on "course" page for course with id "1"
    When I select "Add Assignment" button
    Then "Add Assignment" page should load

  Scenario: Creating a question as instructor
    Given I'm an Instructor with courses
    And I'm on "create question" page for course with id "1"
    When I fill in:
      | element        | content       |
      | question.title | Test Question |
    And I select the first criteria
    And I submit form with "Save" button
    Then I should be on the "course" page
    And I should see "Test Question »" in "h3" on the page
