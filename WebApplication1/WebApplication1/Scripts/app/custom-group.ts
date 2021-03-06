﻿import Entities = require("entities");
import TestFile = Entities.TestFile;

enum GroupType {
    Unknown = 0,
    MixedAbility = 1,
    Streaming = 2,
    Banding = 3,
    TopMiddleLowest = 4,
    Language = 5,
    CustomGroup = 6
}


enum Gender {
    All = 0,
    Girls = 1,
    Boys = 2
}

enum BandType {
    None = 0,
    Top = 1,
    Middle = 2,
    Lowest = 3
}

enum StreamType {
    None = 0,
    OverallAbilty = 1,
    English = 1,
    MathsAchievement = 2
}

enum BandStreamType {
    None = 0,
    Streaming = 1,
    Parallel = 2,
}

function createUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

export class ClassDefinition {
    constructor(public index: number, public count: number) {
        this.uid = createUuid();
    }
    uid: string;
    students: Array<Student> = [];
}

export class BandDefinition {
    constructor(public bandName: string, public bandType: BandType = BandType.None) {
        this.uid = createUuid();
    }
    uid: string;
    classCount: number;
    classes: Array<ClassDefinition> = [];
    students: Array<number> = [];
    streamType: BandStreamType;
}

export class ClassesDefinition {
    constructor(testFile: TestFile) {
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

    uid: string;
    testInfo: TestFile;
    groupName: string;
    groupType: GroupType;
    groupGender: Gender;
    streamType: StreamType;
    singleBand: BandDefinition;
    customBands: Array<BandDefinition> = [];
    topMiddleLowestBands: Array<BandDefinition> = [];
    spreadBoysGirlsEqually: boolean = false;
    excludeLeavingStudent: boolean = false;

    onGroupTypeChanged = (grpType: GroupType) => {
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

    calculateInitialClasses = (cnt: number) => {
        if (this.singleBand.classCount == cnt) {
            return;
        }

        this.calculateClasses(this.singleBand, this.testInfo.studentCount, cnt);
    };

    private calculateClasses = (bandDefn: BandDefinition, studentCount: number, classCnt: number) => {
        bandDefn.classCount = classCnt;
        bandDefn.classes.splice(0, bandDefn.classes.length);
        this.calculateClassesSize(studentCount, classCnt).forEach((x: ClassDefinition) =>
            bandDefn.classes.push(x));
    }

    calculateInitialTopMiddleLowestClasses = () => {
        var topClassCnt = this.topMiddleLowestBands[0].classCount;
        var middleClassCnt = this.topMiddleLowestBands[1].classCount;
        var lowestClassCnt = this.topMiddleLowestBands[2].classCount;


        var classes = this.calculateClassesSize(this.testInfo.studentCount, 3);
        this.calculateClasses(this.topMiddleLowestBands[0], classes[0].count, topClassCnt);
        this.calculateClasses(this.topMiddleLowestBands[1], classes[1].count, middleClassCnt);
        this.calculateClasses(this.topMiddleLowestBands[2], classes[2].count, lowestClassCnt);
    };

    private calculateClassesSize = (totalStudents: number, classCnt: number) => {
        var studentInClass = Math.floor(totalStudents / classCnt);
        var remainingStudents = totalStudents - (totalStudents * classCnt);

        var classes: Array<ClassDefinition> = [];
        for (var i = 0; i < classCnt; i++) {
            classes.push(new ClassDefinition(i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
            remainingStudents--;
        }
        return classes;
    }
}