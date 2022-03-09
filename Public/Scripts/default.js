

var socket;

$(document).ready(function () {

    jQuery.event.props.push('dataTransfer');
    socket = io.connect("http://localhost:8080");
    socket.on("connect", connectObject);
    socket.on("updatechat", processMessageObject);
    socket.on("updateusers", updateUserList);
    socket.on("base64 file", function (msg) {
        $("#conversation").append("<br/> " + msg.username + "<a href='" + msg.file + "' download> " + msg.fileName + "</a> ");
    });
    $("#sendBtn").click(sendBtnFunc);
    $('#uploadfile').bind('change', function (e) {
        var data = e.originalEvent.target.files[0];
        readThenSendFile(data);
    });

        $(".messageContainer").on("mouseover", function (e) {
            var a = e.target.tagName;
            if (a != 'A') {
                e.preventDefault();
            }
        });

        $(".messageContainer").on("dragenter", function (e) {
            console.log("this is  dragenter");
            e.preventDefault();
        },);

        $(".messageContainer").on("dragover", function (e) {
            console.log("this is  dragover");
            e.preventDefault();    
        });

        $(".messageContainer").on("drop", function (e) {

            console.log("this is  drop");
            var files = e.dataTransfer.files;
            console.log(files);
            for (var i = 0; i < files.length; i++) {
                if (files[i].size < 100000) {
                    readThenSendFile(files[i]);
                }

            }        
        });

    });
    //drop box
    function readThenSendFile(data) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var msg = {};
            msg.username = '';
            msg.file = evt.target.result;
            msg.fileName = data.name;
            socket.emit('base64 file', msg);
        };
        reader.readAsDataURL(data);
    }

    function connectObject() {
        socket.emit("adduser", prompt("what is your name"));
    }

    function processMessageObject(username, data) {

        console.log("username" + username + ">>>> data : " + data);
        $("#conversation").append("<br/>" + username + " : " + data);
    }
    function updateUserList(users) {
        $("#user").empty();
        $.each(users, function (key, value) {
            $("#user").append("<b>" + key + "</b> <br/>");
        });

        console.log("users" + users);


    }

    function sendBtnFunc() {

        var message = $("#data").val();
        $("#data").val('');

        socket.emit("sendchat", message);


}

//var chatForm = document.getElementById('chat-form');
//var chatMessages = document.querySelector('.messageContainer');
//var userList = document.getElementById('users');