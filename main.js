const socket = io('https://hoangtp-stream-3500.herokuapp.com/');

$('#div-chat').hide();


socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	$('#div-chat').show();
	$('#div-dang-ky').hide();
	arrUserInfo.forEach(user => {
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id=${peerId}>${ten}</li>`);
	});
	socket.on('CO_NGUOI_DUNG_MOI', user => {
		console.log(user);
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id=${peerId}>${ten}</li>`);
	});
});

socket.on('AI_DO_NGAT_KET_NOI', peerId => {
	$(`#${peerId}`).remove();
});


socket.on('DANG_KY_THAT_BAI',() => {
	alert('Vui long chon username khac');
});


function openStream() {
	const config = {audio: false, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));


const peer = new Peer({
	key:'peerjs', host:'https://hoangtp-stream-3500.herokuapp.com', 
	secure:true, 
	port: 443});

peer.on('open',id => {
	$('#my-peer').append(id);
	$('#btnSignUp').click(()=> {
		const username = $('#txtUsername').val();
		socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
	});
});


// Caller
$('#btnCall').click(() => {
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});


peer.on('call', call => {
	openStream()
	then(stream => {
		call.answer(stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

$('#btnSignUp').click(()=> {
	console.log('Sign Up');
	const username = $('#txtUsername').val();
	console.log(username);
	socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: "peer-key"});
});


$('#ulUser').on('click','li', function() {
	const id = $(this).attr('id');
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

