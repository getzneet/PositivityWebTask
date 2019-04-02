function InsertLog(call,ext){
    /*tosend: ID, questionnaire, question, answer*/

    $.ajax({
        type: 'POST',
        data: {expID: ExpID, id: SubID, exp: ExpName, log:log, ext:ext},
        async: true,
        url: 'InsertLog.php',
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clog='insertlog failure call '+call+' - status: '+textStatus+' - error: '+errorThrown+'\n';
            log+=clog;
            msg ="Internet connection";
            if(Language=='en'){
                msg ="Please verify your internet connection before continuing the experiment";
            } else if(Language=='fr'){
                msg="Veuillez vérifier votre connexion internet avant de continuer";
            }

            InsertLog(call+1,ext);
        }
    });
}


function SendTrainDataDB(call){

    var wtest = 0; /* training */

    clog = 'EXP: '+ExpName+' $ EXPID: '+ExpID+' $ ID: '+SubID+' $ TEST: '+wtest+' $ TRIAL: '+TrialNum+' $ COND: '+Cond+' $ SYML: '+Symbols[0]+' $ SYMR: '+Symbols[1]+' $ CLR: '+left_right+' $ CGB: '+((Choice == 1)?1:0)+' $ RGB: '+((ThisReward == Rwd)?1:0)+' $ CFGB: '+((OtherReward == Rwd)?1:0)+' $ RTIME: '+(Reaction_time-Choice_time)+ '$ REW: '+parseInt(SumReward)/1000+
        ' $ SESSION: '+TrainSess+' $ P1: '+P1+' $ P2: '+P2+' $ MAG1: '+Mag+' $ MAG2: '+Mag+' $ VAL: '+Val+' $ INF: '+Info+' $ OP1: '+Option[0]+' $ OP2: '+Option[1]+' $ V1: '+OptionValues[0]+' $ V2: '+OptionValues[1]+' $ INV: '+InvertedPosition+' $ CTIME: '+(Choice_time-Init_time);
    /*console.log(clog)*/

    $.ajax({
        type: 'POST',
        data: {exp: ExpName, expID: ExpID, id: SubID, test: wtest, trial: TrialNum, condition:Cond, symL:Symbols[0], symR:Symbols[1], choice_left_right:left_right, choice_good_bad:((Choice == 1)?1:0), reward_good_bad:((ThisReward == Rwd)?1:0), other_reward_good_bad:((OtherReward == Rwd)?1:0), reaction_time:Reaction_time-Choice_time, reward: parseInt(SumReward)/1000, session: TrainSess, p1:P1, p2:P2, magnitude1:Mag, magnitude2:Mag, valence:Val, information:Info, option1:Option[0], option2:Option[1], v1:OptionValues[0], v2:OptionValues[1], inverted:InvertedPosition, choice_time:Choice_time-Init_time},
        async: true,
        url: 'InsertLearningDataDB.php',

        success: function(r) {
            clog = 'learning_data $ '+clog+' $ dbcall success \n';
            log+= clog; //update log before not after because variables get changed

            if (r[0].ErrorNo > 0 && call+1<maxDBCalls){
                SendTrainDataDB(call+1);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clog = 'learning_data $ '+clog+' $ dbcall failure \n';
            log+=clog;

            // what type of error is it
            alert(errorThrown.responseText)

            if(call+1<maxDBCalls){
                SendTrainDataDB(call+1);
            }
        }
    });
}


function SendLearnDataDB(call){

    var wtest = 1; /* learning test */

    clog = 'EXP: '+ExpName+' $ EXPID: '+ExpID+' $ ID: '+SubID+' $ TEST: '+wtest+' $ TRIAL: '+TrialNum+' $ COND: '+Cond+' $ SYML: '+Symbols[0]+' $ SYMR: '+Symbols[1]+' $ CLR: '+left_right+' $ CGB: '+((Choice == 1)?1:0)+' $ RGB: '+((ThisReward == Rwd)?1:0)+' $ CFGB: '+((OtherReward == Rwd)?1:0)+' $ RTIME: '+(Reaction_time-Choice_time)+ '$ REW: '+parseInt(SumReward)/1000+
        ' $ SESSION: '+SessionNum+' $ P1: '+P1+' $ P2: '+P2+' $ MAG1: '+Mag+' $ MAG2: '+Mag+' $ VAL: '+Val+' $ INF: '+Info+' $ OP1: '+Option[0]+' $ OP2: '+Option[1]+' $ V1: '+OptionValues[0]+' $ V2: '+OptionValues[1]+' $ INV: '+InvertedPosition+' $ CTIME: '+(Choice_time-Init_time);
    /*console.log(clog)*/

    $.ajax({
        type: 'POST',
        data: {exp: ExpName, expID: ExpID, id: SubID, test: wtest, trial: TrialNum, condition:Cond, symL:Symbols[0], symR:Symbols[1], choice_left_right:left_right, choice_good_bad:((Choice == 1)?1:0), reward_good_bad:((ThisReward == Rwd)?1:0), other_reward_good_bad:((OtherReward == Rwd)?1:0), reaction_time:Reaction_time-Choice_time, reward: parseInt(SumReward)/1000, session: SessionNum, p1:P1, p2:P2, magnitude1:Mag, magnitude2:Mag, valence:Val, information:Info, option1:Option[0], option2:Option[1], v1:OptionValues[0], v2:OptionValues[1], inverted:InvertedPosition, choice_time:Choice_time-Init_time},
        async: true,
        url: 'InsertLearningDataDB.php',
        /*dataType: 'json',*/
        success: function(r) {
            clog = 'learning_data $ '+clog+' $ dbcall success \n';
            log+= clog;

            if (r[0].ErrorNo > 0 && call+1<maxDBCalls){
                SendLearnDataDB(call+1);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clog = 'learning_data $ '+clog+' $ dbcall failure \n';
            log+=clog;

            if(call+1<maxDBCalls){
                SendLearnDataDB(call+1);
            }
        }
    });
}


function SendPostDataDB(call) {

    var wtest = 2; /* transfer test */
    var SessionNum = 0;
    var Info = 0; /* partial feedback in the transfer test */

    clog = 'EXP: '+ExpName+' $ EXPID: '+ExpID+' $ ID: '+SubID+' $ TEST: '+wtest+' $ TRIAL: '+TrialNum+' $ COND: '+Cond+' $ SYML: '+Symbols[0]+' $ SYMR: '+Symbols[1]+' $ CLR: '+left_right+' $ CGB: '+((Rwd == 1)?1:0)+' $ RGB: '+((ThisReward == 0)?0:1)+' $ CFGB: '+((OtherReward == 0)?0:1)+' $ RTIME: '+(Reaction_time-Choice_time)+ '$ REW: '+parseInt(SumReward)/1000+
    ' $ SESSION: '+SessionNum+' $ P1: '+P1+' $ P2: '+P2+' $ MAG1: '+Mag1+' $ MAG2: '+Mag2+' $ VAL: '+Val+' $ INF: '+Info+' $ OP1: '+Option[0]+' $ OP2: '+Option[1]+' $ V1: '+OptionValues[0]+' $ V2: '+OptionValues[1]+' $ INV: '+InvertedPosition+' $ CTIME: '+(Choice_time-Init_time);
    /*console.log(clog)*/

    $.ajax({
        type: 'POST',
        data: {exp: ExpName, expID: ExpID, id: SubID, test: wtest, trial: TrialNum, condition:Cond, symL:Symbols[0], symR:Symbols[1], choice_left_right:left_right, choice_good_bad:((Rwd == 1)?1:0), reward_good_bad:((ThisReward == 0)?0:1), other_reward_good_bad:((OtherReward == 0)?0:1), reward: parseInt(SumReward)/1000, reaction_time:Reaction_time-Choice_time, session: SessionNum, p1:P1, p2:P2, magnitude1:Mag1, magnitude2:Mag2, valence:Val, information:Info, option1:Option[0], option2:Option[1], v1:OptionValues[0], v2:OptionValues[1], inverted:InvertedPosition, choice_time:Choice_time-Init_time},
        async: true,
        url: 'InsertLearningDataDB.php',
        /*dataType: 'json',*/
        success: function(r) {
            clog = 'learning_data $ '+clog+' $ dbcall success \n';
            log+= clog;

            if (r[0].ErrorNo > 0 && call+1<maxDBCalls){
                SendLearnDataDB(call+1);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clog = 'learning_data $ '+clog+' $ dbcall failure \n';
            log+=clog;

            if(call+1<maxDBCalls){
                SendLearnDataDB(call+1);
            }
        }
    });
}


function SendQuestDataDB(call) {

    clog = 'EXP: '+ExpName+' $ EXPID: '+ExpID+' $ ID: '+SubID+' $ QUESTIONNAIRE: '+questID+' $ NUMBER: '+1+' $ ITEM: '+itemNum+' $ ANSWER: '+answer+' $ VAL:'+answer_value+' $ RTIME: '+(Reaction_time-Question_time);
    /*console.log(clog)*/

    $.ajax({
        type: 'POST',
        data: {exp: ExpName, expID: ExpID, id: SubID, qid: questID, qnum: 1, item: itemNum, ans: answer, val:answer_value, reaction_time:Reaction_time-Question_time},
        async: true,
        url: 'InsertQuestionnaireDataDB.php',
        /*dataType: 'json',*/
        success: function(r) {
            clog = 'questionnaire_data $ '+clog+' $ dbcall success \n';
            log+= clog;

            if (r[0].ErrorNo > 0 && call+1<maxDBCalls){
                SendQuestDataDB(call+1);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clog = 'questionnaire_data $ '+clog+' $ dbcall failure \n';
            log+=clog;

            if(call+1<maxDBCalls){
                SendQuestDataDB(call+1);
            }
        }
    });
}


