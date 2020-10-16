var b,bp,wp,user_color,m,num_games,num_practice_games, current_color, gi,mi, current_move, game_data, player_save,gi_save,mi_save, steps
var total_steps, level
var tiles = [];
var game_status = "ready"
//game_status = "ready";
//move_index = 0;
//last_move = 99;
var M=9,N=4
var win_color = "#22ddaa",
	square_color = "#999999",
	highlight_color = "#bbbbbb";
var data_log =[]
var start_category = 1
var dismissed_click_prompt = false;
var lastresult = "win"


function load_game_data(filename){
	$.getJSON(filename, function(response) {
		start_experiment(response)
	});
}


function load_state(){
	create_board()
	var data = game_data[player][gi][mi]
	//var color = data[0]
	var miu = mi
	var cat = gi
	var bp = data[1]
	var wp = data[2]
	//var move = data[3]
	for(var i=0; i<M*N; i++){
		if(bp[i]==1){
			add_piece(i, 0);
		}
		if(wp[i]==1){
			add_piece(i, 1);
		}
	}
}

function load_state_recon(game_num) {
	log_data({"game_num": game_num})
	create_board()
	var data = game_data[player_save][gi_save][mi_save]
	bp_save = data[1]
	wp_save = data[2]
	for (var i = 0; i < M * N; i++) {
		if (bp_save[i] == '1') {
			add_piece(i, 0);
		}
		if (wp_save[i] == '1') {
			add_piece(i, 1);
		}
	}
	timer = setTimeout(function(){
		user_move(game_num)
	},500)
}

function play_next_move(game_num){
	if (mi< mi_save+steps){
		var data = game_data[player][gi][mi]
		var color = data[0]
		var move = data[3]
	add_piece(move,color);
	show_last_move(move, color);
	mi++
	timer = setTimeout(
		function(){
			play_next_move(game_num)},500);
	}
	else{
		//add_piece(move,color);
		//show_last_move(move, color);
		create_board()
		total_steps = bp.filter(x => x==1).length + wp.filter(x => x==1).length
		timer = setTimeout(function (){
			load_state_recon(game_num)
		},3000)
			}
}

function get_level_game(){
	if (game_data[player][gi][0]>1000){
		return game_data[player][gi][0][4]
	}
	else {return  game_data[player][gi][1][4]}
}

function generate_ok_games() {
	steps = getRndInteger(4,10)
	if (game_data != null) {
		player = Math.floor((Math.random() * (game_data.length - 1)) + 1);
		gi = Math.floor((Math.random() * game_data[player].length));
		if (game_data[player][gi].length < steps + 1) {
			generate_ok_games()
		} else {
			var game_length = game_data[player][gi].length
			level = get_level_game()
			mi = getRndEorONumber(0,game_length-steps,start_color)
			player_save = player
			gi_save = gi
			mi_save = mi
			log_data({"mi":mi,game_length})
		}
		log_data({"event_type": "state_para", "event_info" : {"start_color":start_color, "player" : player, "gameIndex":gi,
			"move_index":mi, "steps": steps, "level": level}})
		load_state()
	}
}


function select_random_board(game_num) {
	generate_ok_games()
	timer = setTimeout(function (){
		play_next_move(game_num)
	},200)
}

function create_board() {
	bp = new Array(M*N).fill(0)
	wp = new Array(M*N).fill(0)
	$(".canvas").empty();
	for (var i=0; i<N; i++) {
		for(var j=0; j<M; j++) {
			$(".canvas").append($("<div>", {"class" : "tile", "id": "tile_" + (i*M + j).toString()}))
		}
		$(".canvas").append("<br>");
	}
}

function add_piece(i, color) {
	if(color == 0) {//BLACK
		$("#tile_" + i.toString()).append(
			$("<div>",{"class" : "blackPiece"})
		).removeClass("tile").addClass("usedTile").off('mouseenter').off('mouseleave').css("backgroundColor", square_color);
		bp[i] = 1;
	} else {
		$("#tile_" + i.toString()).append(
			$("<div>",{"class" : "whitePiece"})
		).removeClass("tile").addClass("usedTile").off('mouseenter').off('mouseleave').css("backgroundColor", square_color);
		wp[i] = 1;
	}
}

function remove_piece(i){
	$("#tile_" + i.toString()).empty().removeClass("usedTile").addClass("tile").off().css("backgroundColor", square_color);
	bp[i]=0
	wp[i]=0
}


function show_last_move(i, color) {
	if(color == 0) {//BLACK
		$(".blackShadow").remove();
		$("#tile_" + i.toString()).append($("<div>" , {"class" : "blackShadow"}))
	} else {
		$(".whiteShadow").remove();
		$("#tile_" + i.toString()).append($("<div>" , {"class" : "whiteShadow"}))
	}
}

function check_win(color){
	fourinarows = [[ 0,  9, 18, 27],
				   [ 1, 10, 19, 28],
				   [ 2, 11, 20, 29],
				   [ 3, 12, 21, 30],
				   [ 4, 13, 22, 31],
				   [ 5, 14, 23, 32],
				   [ 6, 15, 24, 33],
				   [ 7, 16, 25, 34],
				   [ 8, 17, 26, 35],
				   [ 0, 10, 20, 30],
				   [ 1, 11, 21, 31],
				   [ 2, 12, 22, 32],
				   [ 3, 13, 23, 33],
				   [ 4, 14, 24, 34],
				   [ 5, 15, 25, 35],
				   [ 3, 11, 19, 27],
				   [ 4, 12, 20, 28],
				   [ 5, 13, 21, 29],
				   [ 6, 14, 22, 30],
				   [ 7, 15, 23, 31],
				   [ 8, 16, 24, 32],
				   [ 0,  1,  2,  3],
				   [ 1,  2,  3,  4],
				   [ 2,  3,  4,  5],
				   [ 3,  4,  5,  6],
				   [ 4,  5,  6,  7],
				   [ 5,  6,  7,  8],
				   [ 9, 10, 11, 12],
				   [10, 11, 12, 13],
				   [11, 12, 13, 14],
				   [12, 13, 14, 15],
				   [13, 14, 15, 16],
				   [14, 15, 16, 17],
				   [18, 19, 20, 21],
				   [19, 20, 21, 22],
				   [20, 21, 22, 23],
				   [21, 22, 23, 24],
				   [22, 23, 24, 25],
				   [23, 24, 25, 26],
				   [27, 28, 29, 30],
				   [28, 29, 30, 31],
				   [29, 30, 31, 32],
				   [30, 31, 32, 33],
				   [31, 32, 33, 34],
				   [32, 33, 34, 35]]

	for(var i=0;i<fourinarows.length;i++){
		var n = 0;
		for(var j=0;j<N;j++){
			if(color==0)//BLACK
				n+=bp[fourinarows[i][j]]
			else
				n+=wp[fourinarows[i][j]]
		}
		if(n==N)
			return fourinarows[i]
	}
	return []
}

//function check_draw(){
//	for(var i=0; i<M*N; i++)
//		if(bp[i]==0 && wp[i]==0)
//			return false;
//	return true;
//}

//function show_win(color, pieces) {
//	for(i=0; i<pieces.length; i++){
//		if(color==0)
//			$("#tile_" + pieces[i] + " .blackPiece").animate({"backgroundColor": win_color}, 250)
//		else
//			$("#tile_" + pieces[i] + " .whitePiece").animate({"backgroundColor": win_color}, 250)
//	}
//}


function user_move(game_num) {
	if (bp.filter(x => x==1).length == wp.filter(x => x==1).length){
		current_color = 0}
	else {current_color = 1}
	color_string = (current_color == 0 ? 'black' : 'white')
	log_data({"event_type": "your turn", "event_info" : {"bp" : bp.join(""), "wp": wp.join(""), "user_color" : color_string, game_num}})
	$('.headertext h1').text('You now play ' + color_string + ".");
	$('.canvas, .tile').css('cursor', 'pointer');
	$('.usedTile, .usedTile div').css('cursor', 'default');
	$('.tile').off().on('mouseenter', function(e){
		$(e.target).animate({"background-color":highlight_color}, 50)
	}).on('mouseleave', function(e){
		$(e.target).animate({"background-color": square_color}, 50)
	});
	$('.tile').off('click').on('click', function(e){
		$('.tile').off('mouseenter').off('mouseleave').off('click');
		$('.canvas, .canvas div').css('cursor', 'default');
		tile_ind = parseInt(e.target.id.replace("tile_", ""));
		log_data({"event_type": "user move", "event_info" : {"tile" : tile_ind, "bp" : bp.join(""), "wp": wp.join(""), "user_color" : color_string}})
		add_piece(tile_ind,current_color);
		show_last_move(tile_ind, current_color);
		$(".clickprompt").hide();
		dismissed_click_prompt = true;
		//winning_pieces = check_win(user_color)    // DON'T WANT TO SHOW WIN ANY POINT IN THE GAME
	 	if (bp.filter(x => x==1).length + wp.filter(x => x==1).length == total_steps){
			//show_win(current_color,winning_pieces)
			log_data({"event_type": "reconstruction over", "event_info" : {"bp" : bp.join(""), "wp": wp.join(""), "game_num":game_num}})
			$('.headertext h1').text('Reconstruction over').css('color', '#000000');
			end_game(game_num)
		}
		else {
			user_move(game_num)
		}
	});
}

function check_all_reconstructed(total_steps){
	return bp.filter(x => x==1).length + wp.filter(x => x==1).length == total_steps;
}
function start_game(game_num){
	log_data({"event_type": "start game", "event_info" : {"game_num" : game_num}})
	select_random_board(game_num)
	if(game_num<num_practice_games){
		$('.gamecount').text("Practice game " + (game_num+1).toString() + " out of " + num_practice_games.toString());
	}
	else{
		$('.gamecount').text("Game " + (game_num-num_practice_games+1).toString() + " out of " + num_games.toString());
	}
	if (!dismissed_click_prompt) $('.clickprompt').show();
	log_data({"event_type": "start game", "event_info": {"game_num": game_num, "is_practice": game_num<num_practice_games,"user_color" : (user_color == 0 ? 'black' : 'white')}})
	user_move(game_num)
}


function end_game(game_num){
	log_data({"event_type": "end game", "event_info" : {"game_num" : game_num, "level" : level}})
	//adjust_level(result)
	$("#nextgamebutton").show().css({"display" :"inline"}).off("click").on("click",function(){
		$("#nextgamebutton").hide()
		$(".canvas").empty();
		if(game_num == num_practice_games + num_games-1){
			finish_experiment()
		}
		else if (game_num == num_practice_games -1){
			show_instructions(0,instructions_text_after_practice,instructions_urls_after_practice,function(){
				start_game(game_num+1)
			},"Start")
		}
		else{
			start_game(game_num+1)
		}
	})
}

function show_instructions(i,texts,urls,callback,start_text){
	log_data({"event_type": "show instructions", "event_info" : {"screen_number": i}})
	category = start_category
	$('.overlayed').show();
	$('#instructions').show();
	$('#instructions p').remove();
	$('#instructions h4').after("<p>" + texts[i] + "</p>");
	if(urls[i]==""){
		$('#instructions img').hide()
	}
	else{
		$('#instructions img').show().attr("src",get_image_path(urls[i] + ".png"));
	}
	if(i==0){
		$('#previousbutton').hide()
	}
	else {
		$('#previousbutton').show().off("click").on("click",function(){
			show_instructions(i-1,texts,urls,callback,start_text);
		});
	}
	if(i == texts.length - 1 || i == urls.length - 1){
		$('#nextbutton').text(start_text)
		$('#nextbutton').off("click").on("click",function(){
			$('#instructions').hide();
			$('.overlayed').hide();
			callback();
		})
	}
	else {
		$('#nextbutton').text("Next")
		$('#nextbutton').off("click").on("click",function(){
			show_instructions(i+1,texts,urls,callback,start_text);
		});
	}
}

function initialize_task(_num_games,_num_practice_games,callback){
	num_games = _num_games
	num_practice_games = _num_practice_games
	user_color = 0
	instructions_text = ["You will be playing a few games called 4-in-a-row against the computer.",
						 "In this game, you and the computer place black or white pieces on a game board.",
						 "If you get 4 pieces in a row, you win!",
						 "You can connect your 4 pieces in any direction, horizontal, vertical or diagonal.",
						 "If the computer gets 4-in-a-row before you do, you lose",
						 "If the board is full and no-one has 4-in-a-row, it's a tie",
						 "If you were playing black pieces for one game, then the next game you will play white pieces.",
						 "You will now play " + _num_practice_games.toString() + " practice games. Click start to begin."
						 ]

	instructions_urls = ["",
						 "black-about-to-win",
						 "black-won",
						 "black-won-diagonal",
						 "",
						 "draw",
						 "",
						 ""]
	instructions_text_after_practice = ["You will now play " + num_games.toString() + " games"]
	instructions_urls_after_practice = [""]


	instructions_text_finished = ["Thank you for playing!"]

	instructions_urls_finished = [""]
	callback()
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}
function getRndEorONumber(min,max, eo){
	var rand = getRndInteger(min,max)
	log_data({"number": rand})
	if ((rand%2 == eo)){return rand}
	else if (rand<max) {return rand+1}
	else {return rand-1}
}

function start_experiment(response){
	game_data = response
	start_color = Math.round(Math.random())
	log_data({"start_color": start_color})
	makemove = Module.cwrap('makemove', 'number', ['number','string','string','number','number'])
	$(document).on("contextmenu",function(e){
		e.preventDefault()
	})
	show_instructions(0,instructions_text,instructions_urls,function(){
		start_game(0)
	},"Start")
}

