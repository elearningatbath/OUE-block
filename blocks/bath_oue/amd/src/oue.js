define(['jquery', 'jqueryui', 'core/config', 'core/yui'], function ($, jqui, config, Y) {
    var block_name = 'bath_oue';
    var remoteURI = config.wwwroot + '/blocks/' + block_name + '/stats.php';
    var progressBar = function (total, completed) {
        //If completed evals are more than or equal to 0
        if (completed >= 0) {
            var html5ProgressBar = $('#progressbar');

            html5ProgressBar.attr('max', total);
            html5ProgressBar.attr('value', completed);
            html5ProgressBar.show();
            /* HANDLE SVG FOR FALLBACK */
            /*var svgGraphic = new Y.Graphic({
             render: "#svg-container"
             });*/

            var completedInPixels = completed * 200 / total;
            /*var totalRectangle = svgGraphic.addShape({
             type: "rect",
             stroke: {
             color: '#491155',
             weight: 1
             },
             fill: {
             color: "#fff",
             opacity: 1,
             },
             width: 200,
             height: 16
             });*/
            /*var completedRectangle = svgGraphic.addShape({
             type: 'rect',
             fill: {
             color: '#712C7F'
             },
             width: completedInPixels,
             height: 15,
             stroke: {
             weight: 0
             }
             });*/
        }

    };
    return {
        init: function (userid) {
            $.ajax({
                beforeSend: function () {
                    //Show the loading message
                    var loaderGIF = M.util.image_url('spinner', 'block_' + block_name);
                    $('#survey_loading').css('height', '124px');
                    $('#survey_loading').css('background', 'url(' + loaderGIF + ') center no-repeat');
                },
                url: remoteURI,
                dataType: 'json',
                cache: false,
                method: 'get',
                data: {'username': userid},
                success: function (data, textStatus, xhr) {

                    $('#survey_loading').css('display', 'none'); //Hide the loader
                    $('#survey_container').css('display', 'block'); // Display survey container
                    var blShowNotice = true;
                    var surveyData = data;
                    var today = new Date();
                    var totalSurveys = 0;
                    var completedSurveys = 0;
                    var incompletedSurveys = 0;
                    //console.log(surveyData);

                    if (surveyData.hasOwnProperty('sits_error')) {
                        M.OUE.handleFailure(id, response, '001');
                        blShowNotice = false;
                    }
                    else if (surveyData.hasOwnProperty('result_error')) {
                        M.OUE.handleFailure(id, response, '002');
                        blShowNotice = false;
                    } else {
                        if (surveyData.data == 'NO ROWS') {
                            //Hide the complete now button
                            $('#oue_link').hide();
                            $('#no_survey_results').show();
                            blShowNotice = false;
                        } else {
                            //We have real data
                            completedSurveys = Number(surveyData.data.C);
                            incompletedSurveys = Number(surveyData.data.S);
                            totalSurveys = completedSurveys + incompletedSurveys; //Total Surveys
                            //Show the progress bar now
                            //totalSurveys = completedSurveys = 4;
                            if (totalSurveys == completedSurveys) //All done!
                            {
                                //hide the notification
                                blShowNotice = false;
                                //Hide the complete now button
                                $('#oue_link').hide();
                                //replace the progress bar with text
                                $('#no_survey_results').show();
                            }
                            else {
                                var survey_progress = 'You have completed <span class="oue_number">' + completedSurveys + '</span>  out of <span class="oue_number">' + totalSurveys + '</span> of your current active unit evaluations';
                                $('.survey_progress').html(survey_progress);
                                var notificationText = 'You have completed <span class="oue_number">' + completedSurveys + '</span>  out of <span class="oue_number">' + totalSurveys + '</span> of your current active unit evaluations';
                                $('#oue_notice').html(notificationText);
                                $('#oue_link').show();//Show the completion now button
                                $('#notice_links').appendTo($('#oue_notice')).show();
                                progressBar(totalSurveys, completedSurveys);
                            }
                        }
                    } //End else

                    $('#oue_notice').hide();
                    //Hide the complete now button
                    //Only Show this if the cookie has expired
                    /* if (!Y.Cookie.exists(M.OUE.blockname) && blShowNotice) {
                     $('#oue_notice').show();
                     overlay.render('#page-wrapper');
                     }*/
                }
            });
        }
    }
});