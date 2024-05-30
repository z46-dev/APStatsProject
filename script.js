const dataPoints = [];
const extrapolationFactor = 4;

class DataPoint {
    constructor() {
        this.type = 0; // 0 - Teacher; 1 - students
        this.socialCauseStress = 0;
        this.socialCauseLate = 0;
        dataPoints.push(this);
    }

    get stressScore() {
        return +((this.socialCauseStress - 1) * extrapolationFactor + (this.socialCauseLate - 1) * extrapolationFactor).toFixed(2);
    }
}

function retrieveData() {
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadSheet.getSheetByName("Form Responses 1");

    for (let i = 2;; i++) {
        const row = sheet.getRange(i, 3, 1, 10).getValues()[0];

        if (!row[0]) {
            break;
        }

        const dataPoint = new DataPoint();
        dataPoint.type = row[0].toString().startsWith("I'm not enrolled") ? 0 : 1;
        dataPoint.socialCauseStress = row[8];
        dataPoint.socialCauseLate = row[9];
    }
}

function main() {
    retrieveData();

    const teachers = dataPoints.filter(dataPoint => dataPoint.type === 0);
    const students = dataPoints.filter(dataPoint => dataPoint.type === 1);
    const teachersStressScore = teachers.reduce((acc, dataPoint) => acc + dataPoint.stressScore, 0);
    const studentsStressScore = students.reduce((acc, dataPoint) => acc + dataPoint.stressScore, 0);
    const allStressScore = dataPoints.reduce((acc, dataPoint) => acc + dataPoint.stressScore, 0);

    // Statistics inference procedure
    const teachersMean = teachersStressScore / teachers.length;
    const studentsMean = studentsStressScore / students.length;
    const allMean = allStressScore / dataPoints.length;


    console.log(`Teachers mean: ${teachersMean}`);
    console.log(`Students mean: ${studentsMean}`);
    console.log(`All mean: ${allMean}`);
    console.log(JSON.stringify({
        teachers: teachers.map(dataPoint => dataPoint.stressScore),
        students: students.map(dataPoint => dataPoint.stressScore),
        teachersMean: teachersMean,
        studentsMean: studentsMean,
        allMean: allMean
    }));
}
