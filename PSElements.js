const PSElementType = {
    Rectangle : "RECTANGLE",
    Beam : "BEAM",
    LBeam : "LBEAM",
    Room : "ROOM"
};

const PSElement = {
    rectangle_540_540 : {
        width : 450,
        depth : 20,
        cornerSize : 112.5,
        chamfer : 22.5,
        holeOffset : 25,
        holeWidth : 10
    },
    beam_7_495 : {
      length : 495,
      width : 45,
      holeCount : 7,
      holeWidth : 8,
      holeLength : 45,
    },
    beam_1_90 : {
      length : 90,
      width : 45,
      holeCount : 1,
      holeWidth : 8,
      holeLength : 45,
    },
    beam_7_3_495_247 : {
      length1 : 495,
      length2 : 247,
      width : 45,
      holeCount1 : 7,
      holeCount2 : 3,
      holeWidth : 8,
      holeLength : 45,
    },
    room_5000_4000_3000 : {
      length : 5000,
      width : 4000,
      height : 3000,
    }
};

exports.PSElementType = PSElementType;
exports.PSElement = PSElement;
