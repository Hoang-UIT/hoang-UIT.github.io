const socket = io('hoangtp-stream-3005.herokuapp.com');

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
	const config = {audio: true, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}

const peer = new Peer({
	key: 'peerjs',
	host: '9000-cdb98c25-7562-4bd0-ac3d-341c2cdab3df.ws-us02.gitpod.io',
	secure: true
});

peer.on('open',id => {
	console.log(id);
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
	.then(stream => {
		call.answer(stream);
		playStream('localStream', stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

$('#ulUser').on('click','li', function() {
	const id = $(this).attr('id');
	openStream()
	.then(stream => {
		const call = peer.call(id, stream);
		playStream('localStream', stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

