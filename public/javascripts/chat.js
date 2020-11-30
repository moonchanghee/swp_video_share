var socket = io();
var room = ['room1','room2' , 'room3']

$('#btn').on('click' , function(){
  socket.emit('sendmsg' , $('#name').val() ,$('#text').val());
//   $('#name').val(''); //이름칸 초기화  
  $('#text').val(''); //텍스트창 초기화
});

socket.on('msg', function(msg){ // 서버측에서 받은 이름,메시지내용을 출력창 자식노드로 추가
    // console.log(msg);
    $('textarea').append(msg + '\n');
  })

socket.on('joinroom' , function(num){
    console.log("ddd");
    $('textarea').append(room[num]  + "에 입장"  +'\n');
})

socket.on('abc' , function(abc){
    console.log(abc);
})