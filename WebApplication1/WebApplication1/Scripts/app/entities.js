"use strict";
var subjectTypes = [
    { Subject: "Unknown", Index: 0, IsAchievement: false, IsAbility: false },
    { Subject: "Genab", Index: 1, IsAchievement: false, IsAbility: true },
    { Subject: "Verbal", Index: 2, IsAchievement: false, IsAbility: true },
    { Subject: "NonVerbal", Index: 3, IsAchievement: false, IsAbility: true },
    { Subject: "MathReasoning", Index: 4, IsAchievement: false, IsAbility: true },
    { Subject: "MathPerformance", Index: 5, IsAchievement: true, IsAbility: false },
    { Subject: "Reading", Index: 6, IsAchievement: true, IsAbility: false },
    { Subject: "Writing", Index: 7, IsAchievement: true, IsAbility: false },
    { Subject: "Spelling", Index: 8, IsAchievement: true, IsAbility: false },
    { Subject: "Ravens", Index: 9, IsAchievement: false, IsAbility: true }
];
var Subject = (function () {
    function Subject() {
        this.index = 0;
        this.subject = "";
        this.isAchievement = false;
        this.isAbility = false;
    }
    return Subject;
}());
exports.Subject = Subject;
var User = (function () {
    function User() {
        var _this = this;
        this.greeting = function () {
            return "Hi " + _this.name;
        };
    }
    return User;
}());
exports.User = User;
var School = (function () {
    function School() {
        this.isMainSchool = false;
    }
    return School;
}());
exports.School = School;
var TestFile = (function () {
    function TestFile() {
        var _this = this;
        this.school = new School();
        this.hasBoys = false;
        this.hasGirls = false;
        this.description = function () {
            if (_this.fileNumber === 1015049) {
                return _this.fileNumber + " " + _this.category + " Ravens";
            }
            return _this.fileNumber + " " + _this.category;
        };
        this.clear = function () {
            _this.fileNumber = undefined;
            _this.grade = undefined;
            _this.category = undefined;
            _this.testDate = undefined;
            _this.testYear = undefined;
            _this.studentCount = undefined;
            _this.published = undefined;
            _this.subjectTypes = [];
            _this.students = [];
        };
        this.setStudents = function (data) {
            _this.students = [];
            _this.hasGirls = false;
            _this.hasBoys = false;
            data.forEach(function (s) {
                _this.students.push(new Student(s));
                if (!_this.hasBoys && s.Sex == "M") {
                    _this.hasBoys = true;
                }
                if (!_this.hasGirls && s.Sex == "F") {
                    _this.hasGirls = true;
                }
            });
            _this.studentCount = _this.students.length;
            _this.isUnisex = _this.hasGirls && _this.hasBoys;
        };
    }
    return TestFile;
}());
exports.TestFile = TestFile;
var RangeScore = (function () {
    function RangeScore(low, high) {
        var _this = this;
        this.low = low;
        this.high = high;
        this.range = function () {
            return _this.low + "-" + _this.high;
        };
    }
    return RangeScore;
}());
exports.RangeScore = RangeScore;
var Score = (function () {
    function Score(raw, stanine, scaledScore, score, range, naplan) {
        this.raw = raw;
        this.stanine = stanine;
        this.scaledScore = scaledScore;
        this.score = score;
        this.range = range;
        this.naplan = naplan;
    }
    return Score;
}());
exports.Score = Score;
var Student = (function () {
    function Student(r) {
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = r.Dob;
        this.speak = r.Speak;
        this.liveInAus = r.Live_in_as;
        this.ca = r.Ca;
        this.genab = new Score(r.Genab, r.Iqs, r.Tgenab, r.Sgenab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.Tverb, r.Sverb, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.Tnverb, r.Snverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.Tpst, r.Smath, null, r.NpiMath);
        this.reading = new Score(r.Rrs, r.Rst, r.Trst, r.Sread, null, r.NpiRead);
        this.spelling = new Score(r.Srs, r.Sst, r.Tsst, r.Sspell, null, null);
        this.writing = new Score(r.Wrs, r.Wrt, r.Twrit, r.Swrit, null, r.NpiWrit);
        this.raven = new Score(r.Raven, r.Iqs2, r.Tmst, null, new RangeScore(r.Iq12, r.Iq22), null);
        this.serialno = r.snow;
    }
    return Student;
}());
exports.Student = Student;
