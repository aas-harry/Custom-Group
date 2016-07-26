"use strict";
var GroupType;
(function (GroupType) {
    GroupType[GroupType["Unknown"] = 0] = "Unknown";
    GroupType[GroupType["MixedAbility"] = 1] = "MixedAbility";
    GroupType[GroupType["Streaming"] = 2] = "Streaming";
    GroupType[GroupType["Banding"] = 3] = "Banding";
    GroupType[GroupType["TopMiddleLowest"] = 4] = "TopMiddleLowest";
    GroupType[GroupType["Language"] = 5] = "Language";
    GroupType[GroupType["CustomGroup"] = 6] = "CustomGroup";
})(GroupType || (GroupType = {}));
var Gender;
(function (Gender) {
    Gender[Gender["All"] = 0] = "All";
    Gender[Gender["Girls"] = 1] = "Girls";
    Gender[Gender["Boys"] = 2] = "Boys";
})(Gender || (Gender = {}));
var BandType;
(function (BandType) {
    BandType[BandType["None"] = 0] = "None";
    BandType[BandType["Top"] = 1] = "Top";
    BandType[BandType["Middle"] = 2] = "Middle";
    BandType[BandType["Lowest"] = 3] = "Lowest";
})(BandType || (BandType = {}));
var StreamType;
(function (StreamType) {
    StreamType[StreamType["None"] = 0] = "None";
    StreamType[StreamType["OverallAbilty"] = 1] = "OverallAbilty";
    StreamType[StreamType["English"] = 1] = "English";
    StreamType[StreamType["MathsAchievement"] = 2] = "MathsAchievement";
})(StreamType || (StreamType = {}));
var BandStreamType;
(function (BandStreamType) {
    BandStreamType[BandStreamType["None"] = 0] = "None";
    BandStreamType[BandStreamType["Streaming"] = 1] = "Streaming";
    BandStreamType[BandStreamType["Parallel"] = 2] = "Parallel";
})(BandStreamType || (BandStreamType = {}));
function createUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
var ClassDefinition = (function () {
    function ClassDefinition(index, count) {
        this.index = index;
        this.count = count;
        this.students = [];
        this.uid = createUuid();
    }
    return ClassDefinition;
}());
exports.ClassDefinition = ClassDefinition;
var BandDefinition = (function () {
    function BandDefinition(bandName, bandType) {
        if (bandType === void 0) { bandType = BandType.None; }
        this.bandName = bandName;
        this.bandType = bandType;
        this.classes = [];
        this.students = [];
        this.uid = createUuid();
    }
    return BandDefinition;
}());
exports.BandDefinition = BandDefinition;
var ClassesDefinition = (function () {
    function ClassesDefinition(testFile) {
        var _this = this;
        this.customBands = [];
        this.topMiddleLowestBands = [];
        this.spreadBoysGirlsEqually = false;
        this.excludeLeavingStudent = false;
        this.onGroupTypeChanged = function (grpType) {
            switch (grpType) {
                case GroupType.MixedAbility:
                    break;
                case GroupType.Streaming:
                    break;
                case GroupType.Banding:
                    break;
                case GroupType.TopMiddleLowest:
                    break;
                case GroupType.Language:
                    break;
                case GroupType.CustomGroup:
                    break;
            }
        };
        this.calculateInitialClasses = function (cnt) {
            if (_this.singleBand.classCount == cnt) {
                return;
            }
            _this.calculateClasses(_this.singleBand, _this.testInfo.studentCount, cnt);
        };
        this.calculateClasses = function (bandDefn, studentCount, classCnt) {
            bandDefn.classCount = classCnt;
            bandDefn.classes.splice(0, bandDefn.classes.length);
            _this.calculateClassesSize(studentCount, classCnt).forEach(function (x) {
                return bandDefn.classes.push(x);
            });
        };
        this.calculateInitialTopMiddleLowestClasses = function () {
            var topClassCnt = _this.topMiddleLowestBands[0].classCount;
            var middleClassCnt = _this.topMiddleLowestBands[1].classCount;
            var lowestClassCnt = _this.topMiddleLowestBands[2].classCount;
            var classes = _this.calculateClassesSize(_this.testInfo.studentCount, 3);
            _this.calculateClasses(_this.topMiddleLowestBands[0], classes[0].count, topClassCnt);
            _this.calculateClasses(_this.topMiddleLowestBands[1], classes[1].count, middleClassCnt);
            _this.calculateClasses(_this.topMiddleLowestBands[2], classes[2].count, lowestClassCnt);
        };
        this.calculateClassesSize = function (totalStudents, classCnt) {
            var studentInClass = Math.floor(totalStudents / classCnt);
            var remainingStudents = totalStudents - (totalStudents * classCnt);
            var classes = [];
            for (var i = 0; i < classCnt; i++) {
                classes.push(new ClassDefinition(i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
                remainingStudents--;
            }
            return classes;
        };
        this.uid = createUuid();
        this.groupType = GroupType.MixedAbility;
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testInfo = testFile;
        this.singleBand = new BandDefinition("Class", BandType.None);
        this.singleBand.classCount = 1;
        this.singleBand.classes = [new ClassDefinition(1, testFile.studentCount)];
        this.topMiddleLowestBands =
            [
                new BandDefinition("Top", BandType.Top),
                new BandDefinition("Middle", BandType.Middle),
                new BandDefinition("Lowest", BandType.Lowest)
            ];
    }
    return ClassesDefinition;
}());
exports.ClassesDefinition = ClassesDefinition;
