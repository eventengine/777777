
"use strict";

exports.index = function(req, res){
  res.json([{
      coord: [55.81, 37.75],
      name: "Вася Пупкин"
  }, {
      coord: [55.71, 37.75],
      name: "Петя Пупкин"
  }, {
      coord: [55.61, 37.95],
      name: "Гомер Симпсон"
  }]);
};