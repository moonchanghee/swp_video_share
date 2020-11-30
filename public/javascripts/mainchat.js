var socket = io();
var num;
var room = ['room1','room2' ,'room3' , 'choiceroom']
var name ;


$('#namebtn').click(function(){
    name = prompt("닉네임을 입력하세요");
})

$('#name').val(name);
socket.emit('name' , name);

$('#enter1').click(function(){
    socket.emit('roomnum' , 0);   
    location.href = "/chat?id=0";
});

$('#enter2').click(function(){
    socket.emit('roomnum' , 1 );
    location.href = "/chat?id=1";
    });

$('#enter3').click(function(){
    socket.emit('roomnum' , 2 );
    location.href = "/chat?id=2";
    });


    socket.on('joinroom' , function(a , name){
        console.log(a);
          if(a === "room1"){
          num = 0
      }
          if(a === "room2"){
          num =1
      }
          if(a === "room3"){
          num = 2
      }
      console.log("입장")
      if(name != "" ) 
    {
        $('textarea').append(   name + "님이"+ room[num]  + "에 입장"  +'\n');
    }  
    });

    
      $('#leave').click(function(){
        console.log(num)
        socket.emit('leaveroom' , num);
        socket.emit('roomnum' , 3);
        history.back();
    });        

    socket.on('leaveroom' , function(name){
        if(name != "")
    $('textarea').append(  name + "님이 "+ "퇴장하셨습니다"  +'\n'); 
    });


    
    $('#btn').on('click' , function(){
        socket.emit('sendmsg' , $('#name').val() ,$('#text').val() , num); 
        $('#text').val(''); //텍스트창 초기화
      });
      
      socket.on('msg', function(msg , name){ // 서버측에서 받은 이름,메시지내용을 출력창 자식노드로 추가
        if(name != ""){
        $('textarea').append(msg + '\n');}
        else{
            $('textarea').append("닉네임을 등록하세요\n");
        }
        })