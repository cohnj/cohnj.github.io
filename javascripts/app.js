var jobList = [
  "Banker",
  "Executive",
  "Developer",
  "Analyst",
  "Junior Analyst",
  "Junior Developer",
  "IT",
  "Teacher",
  "Designer",
  "Educator",
  "Doctor",
  "Nurse",
  "Trainer",
  "Physician",
  "Translator",
  "Director",
  "Actor",
  "Writer",
  "Curator",
  "Researcher",
  "Coach",
  "Assistant",
  "Pastor",
  "Mentor",
  "Psychologist",
  "Lawyer"
];

var randomJobs = function () {
  return _.chain(jobList).sample(10).union(["None"]).value();
};

var randomPic = function () {
  var num = Math.floor(Math.random() * 3) + 1;

  return num + ".jpg";
};

var model = {
  currentImage: randomPic(),
  jobList: randomJobs(),
  totalSelectMap: {},
  currentSelectMap: {}
};

var todoApp = angular.module("todoApp", []);

var getUniqueCounts = function(arr){
  return _.chain(arr).unique().map(function (tag) {
    var dups = _(arr).reduce(function (memo, tagR) {
      if (tag == tagR) {
        memo.push(tagR);
      }
      return memo;
    }, []);

    return {tag: tag, count: dups.length};
  }).sortBy(function(result){
    return result.count * -1;
  }).value();
};

todoApp.run(function ($http) {
//  $http.get("tasks").success(function (data) {
//    model.items = data.items;
//    model.has_more = data.has_more;
//  });
});

todoApp.filter('trustHTMLFilter', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
});

todoApp.controller("ToDoCtrl", function ($scope, $http) {
  $scope.model = model;

  $scope.jobSelected = function (job) {
    return !!model.currentSelectMap[job];
  };

  $scope.showOthers = function () {
    return _(model.currentSelectMap).toArray().length > 0;
  };

  $scope.selectJob = function (job) {
    if (model.currentSelectMap[job]){
      return;
    }

    model.currentSelectMap[job] = true;
    if (model.totalSelectMap[model.currentImage]) {
      model.totalSelectMap[model.currentImage].push(job)
    } else {
      model.totalSelectMap[model.currentImage] = [job]
    }
    $scope.updateCounts()
  };

  $scope.unselectJob = function (job) {
    model.currentSelectMap[job] = false;
    if (model.totalSelectMap[model.currentImage]) {
      var iArr = model.totalSelectMap[model.currentImage].indexOf(job);
      if (iArr > -1){
        model.totalSelectMap[model.currentImage].splice(iArr, 1);
      }
    } else {
      model.totalSelectMap[model.currentImage] = []
    }
    $scope.updateCounts()
  };

  $scope.nextResume = function(){
    var lastImage = model.currentImage;
    while (lastImage == model.currentImage){
      model.currentImage = randomPic();
    }
    model.jobList = randomJobs()
    model.currentSelectMap = {}
  };

  $scope.updateCounts = function(){
    $scope.jobCounts = getUniqueCounts(model.totalSelectMap[model.currentImage])
  };

});

