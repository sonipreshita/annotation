$(document).ready(function(){
	$(".add_project").on("click", function(){
		$(".new_project").show();
	});
	$(".close_icon").on("click", function(){
		$(".new_project").hide();
		$(".register_form").hide();
		$(".login_form").hide();
		$(".forgot_pass").hide();
	});
	$(".register").on("click", function(){
		$(".login_form").hide();
		$(".register_form").show();
		$(".forgot_pass").hide();
	});
	$(".login").on("click", function(){
		$(".register_form").hide();
		$(".login_form").show();
		$(".forgot_pass").hide();
	});
	$(".forgot_pass_link").on("click", function(){
		$(".login_form").hide();
		$(".register_form").hide();
		$(".forgot_pass").show();
	});
	$(".projects").on("click", function(){
		$(".activity").removeClass("active");
		$(".people").removeClass("active");
		$(".create_team").removeClass("active");
		$(".dashboard").removeClass("active");
		$(this).addClass("active");
		$(".activity_list").hide();
		$(".people_list").hide();
		$(".create_team_list").hide();
		$(".view_profile_list").hide();
		$(".change_password_list").hide();
		$(".homepage_header_body").removeClass("open");
		$(".project_list").css("display", "inline-block");
	});
	$(".dashboard").on("click", function(){
		$(".projects").removeClass("active");
		$(".activity").removeClass("active");
		$(".people").removeClass("active");
		$(".create_team").removeClass("active");
		$(this).addClass("active");
		$(".activity_list").hide();
		$(".people_list").hide();
		$(".create_team_list").hide();
		$(".view_profile_list").hide();
		$(".change_password_list").hide();
		$(".homepage_header_body").removeClass("open");
		$(".dashboards").css("display", "inline-block");
	});
	$(".activity").on("click", function(){
		$(".projects").removeClass("active");
		$(".people").removeClass("active");
		$(".create_team").removeClass("active");
		$(".dashboard").removeClass("active");
		$(this).addClass("active");
		$(".project_list").hide();
		$(".people_list").hide();
		$(".create_team_list").hide();
		$(".view_profile_list").hide();
		$(".change_password_list").hide();
		$(".homepage_header_body").removeClass("open");
		$(".activity_list").css("display", "inline-block");
	});
	$(".people").on("click", function(){
		$(".people_list").css("display", "inline-block");
		$(".activity").removeClass("active");
		$(".projects").removeClass("active");
		$(".create_team").removeClass("active");
		$(".dashboard").removeClass("active");
		$(this).addClass("active");
		$(".project_list").hide();
		$(".activity_list").hide();
		$(".create_team_list").hide();
		$(".view_profile_list").hide();
		$(".change_password_list").hide();
		$(".homepage_header_body").removeClass("open");
		
	});
	$("body").on("click", ".create_team", function(){
		$(".create_team_list").css("display", "inline-block");
		$(".activity").removeClass("active");
		$(".projects").removeClass("active");
		$(".people").removeClass("active");
		$(".dashboard").removeClass("active");
		$(this).addClass("active");
		$(".project_list").hide();
		$(".activity_list").hide();
		$(".people_list").hide();
		$(".view_profile_list").hide();
		$(".change_password_list").hide();
		$(".homepage_header_body").removeClass("open");
		
	});
	$(".profile_name").on("click", function(){
		$(".homepage_header_body").toggleClass("open");
	});
	$(".view_profile").on("click", function(){
		$(".view_profile_list").css("display", "inline-block");
		$(".homepage_header_body").removeClass("open");
		$(".projects").removeClass("active");
		$(".activity").removeClass("active");
		$(".people").removeClass("active");
		$(".dashboard").removeClass("active");
		$(".create_team").removeClass("active");
		$(".project_list").hide();
		$(".activity_list").hide();
		$(".people_list").hide();
		$(".create_team_list").hide();
		$(".change_password_list").hide();
		
	});
	$(".change_password").on("click", function(){
		$(".change_password_list").css("display", "inline-block");
		$(".homepage_header_body").removeClass("open");
		$(".projects").removeClass("active");
		$(".activity").removeClass("active");
		$(".dashboard").removeClass("active");
		$(".people").removeClass("active");
		$(".create_team").removeClass("active");
		$(".project_list").hide();
		$(".activity_list").hide();
		$(".people_list").hide();
		$(".create_team_list").hide();
		$(".view_profile_list").hide();
		
	});
	$(".status_p").on("click", function(){
		var name = $(this).children().attr("class");
		var name_split = name.split(" ");
		$("#top_status").removeClass().addClass(name_split[1]);
		$(".status").hide();
	});
	$("#top_status").on("click", function(){
		$(".status").toggle();
	});
	$("body").on('click', '.dropdown dt a', function() {
	  $(".dropdown dd ul").slideToggle('fast');
	});
	
	$("body").on('click', '.dropdown dd ul li a', function() {
	  $(".dropdown dd ul").hide();
	});
	$(document).on('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
	});
	  
	  $('body').on('click', '.mutliSelect input[type="checkbox"]', function() {
		var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
		  title = $(this).val() + ",";
	  
		if ($(this).is(':checked')) {
		  var html = '<span title="' + title + '">' + title + '</span>';
		  $('.multiSel').append(html);
		  $(".hida").hide();
		} else {
		  $('span[title="' + title + '"]').remove();
		  var ret = $(".hida");
		  $('.dropdown dt a').append(ret);
		}
	  });
});



function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#blah')
				.attr('src', e.target.result)
				.width(150)
				.height(200);
		};

		reader.readAsDataURL(input.files[0]);
	}

}
